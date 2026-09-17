// Background service worker: schedules reminders with chrome.alarms and shows
// each one as a small illustrated card (its own little window at the bottom
// right of the browser). If a window cannot be opened, a system notification
// carries the same reminder, and the bell plays through an offscreen document.

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

const ALARM = "wyb:reminder";
const NOTIFICATION_ID = "wyb:reminder";

// Card window size (outer, including Chrome's small title bar).
const CARD = { compact: { width: 412, height: 188 }, expanded: { width: 412, height: 188 } };
let cardWindowId: number | null = null;

// ---------- scheduling ----------

async function reschedule(settings?: Settings): Promise<void> {
  const s = settings ?? (await loadSettings());
  await chrome.alarms.clear(ALARM);
  if (!s.enabled) {
    await saveState({ nextFireAt: null });
    return;
  }
  const next = computeNextFire(new Date(), s);
  await chrome.alarms.create(ALARM, { when: next.getTime() });
  await saveState({ nextFireAt: next.getTime() });
}

/** Make sure an alarm exists when it should (after a browser restart, say). */
async function ensureScheduled(): Promise<void> {
  const s = await loadSettings();
  if (!s.enabled) return;
  const existing = await chrome.alarms.get(ALARM);
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
        await chrome.windows.remove(cardWindowId);
      } catch {
        /* already gone */
      }
      cardWindowId = null;
    }
    const size = CARD[s.layout];
    let left: number | undefined;
    let top: number | undefined;
    try {
      const anchor = await chrome.windows.getLastFocused({ windowTypes: ["normal"] });
      if (anchor.left != null && anchor.top != null && anchor.width && anchor.height) {
        left = Math.max(0, anchor.left + anchor.width - size.width - 24);
        top = Math.max(0, anchor.top + anchor.height - size.height - 24);
      }
    } catch {
      /* no anchor window: let Chrome place it */
    }
    const params = new URLSearchParams({ id: r.id, layout: s.layout, sound: s.soundEnabled ? "1" : "0" });
    const win = await chrome.windows.create({
      url: chrome.runtime.getURL(`card.html?${params}`),
      type: "popup",
      focused: false,
      width: size.width,
      height: size.height,
      left,
      top,
    });
    cardWindowId = win?.id ?? null;
    return cardWindowId != null;
  } catch {
    return false;
  }
}

/** Fallback: the system notification, illustration as its icon. */
async function showNotification(r: Reminder, s: Settings): Promise<void> {
  await chrome.notifications.clear(NOTIFICATION_ID);
  await chrome.notifications.create(NOTIFICATION_ID, {
    type: "basic",
    iconUrl: illustrationUrl(r, "icon"),
    title: r.title,
    message: s.layout === "expanded" && r.reflection ? `${r.supporting}\n${r.reflection}` : r.supporting,
    silent: true, // the bell is ours, not the system's
    priority: 0,
  });
  if (s.soundEnabled) await ringOffscreen();
}

/** Play the bell from an offscreen document (service workers cannot play audio). */
async function ringOffscreen(): Promise<void> {
  try {
    const has = await chrome.offscreen.hasDocument();
    if (!has) {
      await chrome.offscreen.createDocument({
        url: "offscreen.html",
        reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
        justification: "Play the reminder bell once when a reminder appears.",
      });
    }
    await chrome.runtime.sendMessage({ type: "wyb:offscreen-ring", url: chrome.runtime.getURL(BELL_URL) });
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
    await chrome.alarms.create(ALARM, { when: resume.getTime() });
    await saveState({ nextFireAt: resume.getTime() });
    return;
  }
  const r = await nextReminder();
  await show(r, s);
  await saveState({ lastFiredAt: now.getTime() });
  await reschedule(s);
}

// ---------- events ----------

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    await saveSettings({});
    await chrome.tabs.create({ url: chrome.runtime.getURL("onboarding.html") });
  }
  await ensureScheduled();
});

chrome.runtime.onStartup.addListener(() => {
  void ensureScheduled();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM) void fire();
});

chrome.notifications.onClicked.addListener((id) => {
  if (id === NOTIFICATION_ID) void chrome.notifications.clear(id);
});

chrome.windows.onRemoved.addListener((id) => {
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

chrome.runtime.onMessage.addListener((msg: Msg, sender, sendResponse) => {
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
        void chrome.windows.getLastFocused({ windowTypes: ["normal"] })
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
            return chrome.windows.update(id, update);
          })
          .catch(() => undefined);
      }
      sendResponse({ ok: true });
      return false;
    }
    case "wyb:card-close": {
      const id = sender.tab?.windowId ?? cardWindowId;
      if (id != null) void chrome.windows.remove(id).catch(() => undefined);
      sendResponse({ ok: true });
      return false;
    }
    default:
      return false;
  }
});
