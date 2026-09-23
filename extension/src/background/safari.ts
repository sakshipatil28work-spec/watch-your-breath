// Background for Safari (macOS, iOS, iPadOS). Safari has no notifications API,
// so here the extension does not remind: the Watch Your Breath app that
// carries it does, with the system's own scheduled notifications, which arrive
// whether Safari is open or not. This page only keeps the two in step: a
// settings change in the popup goes to the app, and the app's schedule comes
// back so the popup can say when the next reminder is.
//
// The app answers through SafariWebExtensionHandler.swift (apple/Extension).
// The popup and first-run page are the same as in Chrome and Firefox.

import { loadSettings, saveSettings, saveState, onSettingsChanged, type Settings, type RuntimeState } from "../lib/settings.ts";
import { ext } from "../lib/ext.ts";

/** Safari ignores the application id and always talks to the containing app. */
const APP_ID = "dev.sakshipatil.WatchYourBreath";
/** While Safari keeps this page alive, ask the app to top up its schedule. */
const TOP_UP = "wyb:top-up";

interface NativeReply {
  ok: boolean;
  settings?: Settings;
  state?: RuntimeState;
  /** False when notifications for the app are switched off in system settings. */
  notificationsAllowed?: boolean;
  error?: string;
}

async function native(message: Record<string, unknown>): Promise<NativeReply> {
  try {
    const reply = (await ext.runtime.sendNativeMessage(APP_ID, message)) as NativeReply | undefined;
    return reply ?? { ok: false, error: "no reply" };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

// The settings last agreed with the app, so a change that came from the app
// is not sent straight back to it.
let agreed = "";
let notificationsAllowed = true;

async function adopt(reply: NativeReply): Promise<void> {
  if (!reply.ok) return;
  if (typeof reply.notificationsAllowed === "boolean") notificationsAllowed = reply.notificationsAllowed;
  if (reply.settings) {
    const saved = await saveSettings(reply.settings);
    agreed = JSON.stringify(saved);
  }
  if (reply.state) await saveState(reply.state);
}

async function refresh(): Promise<NativeReply> {
  const reply = await native({ type: "refresh" });
  await adopt(reply);
  return reply;
}

ext.runtime.onInstalled.addListener(async (details) => {
  await ext.alarms.create(TOP_UP, { periodInMinutes: 60 });
  const reply = await refresh();
  // the app has its own first-run; only open ours if that has not happened
  const onboarded = reply.settings?.onboarded ?? (await loadSettings()).onboarded;
  if (details.reason === "install" && !onboarded) {
    await ext.tabs.create({ url: ext.runtime.getURL("onboarding.html") });
  }
});

ext.runtime.onStartup.addListener(() => {
  void refresh();
});

ext.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === TOP_UP) void refresh();
});

// A change made in the popup or first-run page: hand it to the app, which
// reschedules and answers with the new schedule.
onSettingsChanged((s) => {
  const json = JSON.stringify(s);
  if (json === agreed) return;
  agreed = json;
  void native({ type: "settings", settings: s }).then((reply) => adopt({ ...reply, settings: undefined }));
});

type Msg = { type: "wyb:preview" } | { type: "wyb:ensure" } | { type: "wyb:permission" };

ext.runtime.onMessage.addListener((msg: Msg, _sender, sendResponse) => {
  switch (msg?.type) {
    case "wyb:preview": {
      native({ type: "preview" }).then((reply) => sendResponse({ ok: reply.ok }));
      return true;
    }
    case "wyb:ensure": {
      refresh().then((reply) => sendResponse(reply.state));
      return true;
    }
    case "wyb:permission": {
      sendResponse(notificationsAllowed ? "granted" : "denied");
      return false;
    }
    default:
      return false;
  }
});
