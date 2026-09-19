// Background: schedules reminders with alarms and delivers each one as a
// system notification, the kind the operating system shows at the corner of
// the screen over whatever is in use: the illustration as its icon, the
// reminder as its words, and our bell once. The bell plays from an offscreen
// document in Chrome (a service worker has no audio) or directly in Firefox
// (whose background page does).
//
// Runs as a service worker in Chrome and as an event page in Firefox; the
// same code, via `ext`.

import {
  loadSettings,
  loadState,
  saveSettings,
  saveState,
  onSettingsChanged,
  type Settings,
  type RuntimeState,
} from "../lib/settings.ts";
import { computeNextFire, isQuiet, quietEndAfter } from "../lib/schedule.ts";
import { getReminder, illustrationUrl, type Reminder } from "../lib/reminders.ts";
import { pickNext } from "../lib/selection.ts";
import { BELL_URL } from "../lib/audio.ts";
import { ext, isFirefox } from "../lib/ext.ts";

const ALARM = "wyb:reminder";
const NOTIFICATION_ID = "wyb:reminder";
/** How long a reminder stays on screen before it clears itself. */
const LINGER_MS = 12_000;
let clearTimer: ReturnType<typeof setTimeout> | null = null;

// ---------- scheduling ----------

async function reschedule(settings?: Settings): Promise<void> {
  const s = settings ?? (await loadSettings());
  await ext.alarms.clear(ALARM);
  if (!s.enabled) {
    await saveState({ nextFireAt: null });
    return;
  }
  const next = computeNextFire(new Date(), s);
  await ext.alarms.create(ALARM, { when: next.getTime() });
  await saveState({ nextFireAt: next.getTime() });
}

/** Make sure an alarm exists when it should (after a browser restart, say). */
async function ensureScheduled(): Promise<void> {
  const s = await loadSettings();
  if (!s.enabled) return;
  const existing = await ext.alarms.get(ALARM);
  if (!existing || existing.scheduledTime < Date.now()) await reschedule(s);
}

// ---------- choosing ----------

async function nextReminder(): Promise<Reminder> {
  const state = await loadState();
  const { id, state: next } = pickNext({ cycle: state.cycle, lastReminderId: state.lastReminderId });
  await saveState({ cycle: next.cycle, lastReminderId: next.lastReminderId });
  return getReminder(id);
}

// ---------- showing ----------

/**
 * The reminder, as the system's own notification: the round icon, the words,
 * and in Chrome the drawing large on a sand panel beneath them. It is asked to
 * stay (the system would hide it after a few seconds) and cleared by us after
 * LINGER_MS, so it is seen without ever nagging. The bell plays separately.
 */
async function show(r: Reminder, s: Settings): Promise<void> {
  if (clearTimer) clearTimeout(clearTimer);
  await ext.notifications.clear(NOTIFICATION_ID);
  const options: chrome.notifications.NotificationOptions<true> = {
    type: "basic",
    iconUrl: illustrationUrl(r, "icon"),
    title: r.title,
    // Compact: the one supporting line. Expanded: the short reflection too.
    message: s.layout === "expanded" && r.reflection ? `${r.supporting}\n${r.reflection}` : r.supporting,
  };
  if (!isFirefox) {
    // Chrome-only: the large picture, and the options Firefox would reject
    options.type = "image";
    options.imageUrl = illustrationUrl(r, "wide");
    options.requireInteraction = true; // stays until we clear it below
    options.silent = true; // the bell is ours, not the system's
    options.priority = 0;
  }
  await ext.notifications.create(NOTIFICATION_ID, options);
  clearTimer = setTimeout(() => void ext.notifications.clear(NOTIFICATION_ID), LINGER_MS);
  if (s.soundEnabled) await ring();
}

/**
 * Play the bell once. Chrome's service worker cannot play audio, so it asks
 * an offscreen document to; Firefox's background page simply plays it.
 */
async function ring(): Promise<void> {
  try {
    const url = ext.runtime.getURL(BELL_URL);
    if (typeof Audio === "function") {
      const audio = new Audio(url);
      audio.loop = false;
      audio.volume = 0.7;
      await audio.play();
      return;
    }
    const has = await ext.offscreen.hasDocument();
    if (!has) {
      await ext.offscreen.createDocument({
        url: "offscreen.html",
        reasons: ["AUDIO_PLAYBACK" as chrome.offscreen.Reason],
        justification: "Play the reminder bell once when a reminder appears.",
      });
    }
    await ext.runtime.sendMessage({ type: "wyb:offscreen-ring", url });
  } catch {
    /* no sound is still a reminder */
  }
}

async function fire(): Promise<void> {
  const s = await loadSettings();
  if (!s.enabled) return;
  const now = new Date();
  if (isQuiet(now, s)) {
    // quiet hours changed after the alarm was set: resume when they end
    const resume = quietEndAfter(now, s);
    await ext.alarms.create(ALARM, { when: resume.getTime() });
    await saveState({ nextFireAt: resume.getTime() });
    return;
  }
  const r = await nextReminder();
  await show(r, s);
  await saveState({ lastFiredAt: now.getTime() });
  await reschedule(s);
}

// ---------- events ----------

ext.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    await saveSettings({});
    await ext.tabs.create({ url: ext.runtime.getURL("onboarding.html") });
  }
  await ensureScheduled();
});

ext.runtime.onStartup.addListener(() => {
  void ensureScheduled();
});

ext.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM) void fire();
});

// a click is a dismissal; there is nothing to open
ext.notifications.onClicked.addListener((id) => {
  if (id === NOTIFICATION_ID) void ext.notifications.clear(id);
});

// Any settings change (popup, onboarding) reschedules from now.
onSettingsChanged((s) => {
  void reschedule(s);
});

type Msg =
  | { type: "wyb:preview" } // show the next reminder now (settings → "Send one now")
  | { type: "wyb:ensure" };

ext.runtime.onMessage.addListener((msg: Msg, _sender, sendResponse) => {
  switch (msg?.type) {
    case "wyb:preview": {
      loadSettings()
        .then(async (s) => show(await nextReminder(), s))
        .then(() => sendResponse({ ok: true }))
        .catch((e: unknown) => sendResponse({ ok: false, error: String(e) }));
      return true;
    }
    case "wyb:ensure": {
      ensureScheduled()
        .then(() => loadState())
        .then((st: RuntimeState) => sendResponse(st));
      return true;
    }
    default:
      return false;
  }
});
