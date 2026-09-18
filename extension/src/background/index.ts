// Background: schedules reminders with alarms and shows each one as a small
// illustrated card (its own little window at the bottom right of the browser).
// If a window cannot be opened, a system notification carries the same
// reminder and the bell plays from here instead: through an offscreen document
// in Chrome (a service worker has no audio), or directly in Firefox (whose
// background page does).
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

// Card window size (outer, including Chrome's small title bar).
const CARD = { compact: { width: 412, height: 188 }, expanded: { width: 412, height: 188 } };
let cardWindowId: number | null = null;

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

/** The card: a small popup window at the bottom right of the last-used browser window. */
async function showCard(r: Reminder, s: Settings): Promise<boolean> {
  try {
    // one card at a time
    if (cardWindowId != null) {
      try {
        await ext.windows.remove(cardWindowId);
      } catch {
        /* already gone */
      }
      cardWindowId = null;
    }
    const size = CARD[s.layout];
    let left: number | undefined;
    let top: number | undefined;
    let anchor: chrome.windows.Window | undefined;
    try {
      anchor = await ext.windows.getLastFocused({ windowTypes: ["normal"] });
      if (anchor.left != null && anchor.top != null && anchor.width && anchor.height) {
        left = Math.max(0, anchor.left + anchor.width - size.width - 24);
        top = Math.max(0, anchor.top + anchor.height - size.height - 24);
      }
    } catch {
      /* no anchor window: let Chrome place it */
    }
    const params = new URLSearchParams({ id: r.id, layout: s.layout, sound: s.soundEnabled ? "1" : "0" });
    const create: chrome.windows.CreateData = {
      url: ext.runtime.getURL(`card.html?${params}`),
      type: "popup",
      width: size.width,
      height: size.height,
      left,
      top,
    };
    // Chrome can open the card without taking focus. Firefox cannot, so there
    // we open it and hand focus straight back to the window that had it.
    if (!isFirefox) create.focused = false;
    const win = await ext.windows.create(create);
    cardWindowId = win?.id ?? null;
    if (isFirefox && anchor?.id != null) {
      await ext.windows.update(anchor.id, { focused: true }).catch(() => undefined);
    }
    return cardWindowId != null;
  } catch {
    return false;
  }
}

/** Fallback: the system notification, illustration as its icon. */
async function showNotification(r: Reminder, s: Settings): Promise<void> {
  await ext.notifications.clear(NOTIFICATION_ID);
  const options: chrome.notifications.NotificationOptions<true> = {
    type: "basic",
    iconUrl: illustrationUrl(r, "icon"),
    title: r.title,
    message: s.layout === "expanded" && r.reflection ? `${r.supporting}\n${r.reflection}` : r.supporting,
  };
  if (!isFirefox) {
    // Chrome-only options; Firefox rejects properties it does not know
    options.silent = true; // the bell is ours, not the system's
    options.priority = 0;
  }
  await ext.notifications.create(NOTIFICATION_ID, options);
  if (s.soundEnabled) await ringFromBackground();
}

/**
 * Play the bell without a card. Chrome's service worker cannot play audio, so
 * it asks an offscreen document to; Firefox's background page simply plays it.
 */
async function ringFromBackground(): Promise<void> {
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

async function show(r: Reminder, s: Settings): Promise<void> {
  const ok = await showCard(r, s);
  if (!ok) await showNotification(r, s);
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

ext.notifications.onClicked.addListener((id) => {
  if (id === NOTIFICATION_ID) void ext.notifications.clear(id);
});

ext.windows.onRemoved.addListener((id) => {
  if (id === cardWindowId) cardWindowId = null;
});

// Any settings change (popup, onboarding) reschedules from now.
onSettingsChanged((s) => {
  void reschedule(s);
});

type Msg =
  | { type: "wyb:preview" } // show the next reminder now (settings → "Send one now")
  | { type: "wyb:ensure" }
  | { type: "wyb:card-resize"; width?: number; height: number }
  | { type: "wyb:card-close" };

ext.runtime.onMessage.addListener((msg: Msg, sender, sendResponse) => {
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
    case "wyb:card-resize": {
      const id = sender.tab?.windowId ?? cardWindowId;
      if (id != null) {
        void ext.windows.getLastFocused({ windowTypes: ["normal"] })
          .then((anchor) => {
            // keep the card pinned to the bottom-right corner as it changes size
            const width = msg.width ? Math.round(msg.width) : undefined;
            const height = Math.round(msg.height);
            const update: chrome.windows.UpdateInfo = { height };
            if (width) update.width = width;
            if (anchor.left != null && anchor.top != null && anchor.width && anchor.height) {
              update.left = Math.max(0, anchor.left + anchor.width - (width ?? CARD.compact.width) - 24);
              update.top = Math.max(0, anchor.top + anchor.height - height - 24);
            }
            return ext.windows.update(id, update);
          })
          .catch(() => undefined);
      }
      sendResponse({ ok: true });
      return false;
    }
    case "wyb:card-close": {
      const id = sender.tab?.windowId ?? cardWindowId;
      if (id != null) void ext.windows.remove(id).catch(() => undefined);
      sendResponse({ ok: true });
      return false;
    }
    default:
      return false;
  }
});
