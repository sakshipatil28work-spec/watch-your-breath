// User preferences. Stored in the browser's local extension storage; no account, no backend.
import { ext } from "./ext.ts";

export type IntervalPreset = 30 | 60 | 120;
/** Compact: illustration + reminder. Expanded: the same, with an optional reflection behind a chevron. */
export type NotificationLayout = "compact" | "expanded";

export interface Settings {
  /** Reminders on/off. */
  enabled: boolean;
  /** Preset interval in minutes, or "custom". */
  interval: IntervalPreset | "custom";
  /** Minutes used when interval === "custom". */
  customMinutes: number;
  /** Jitter each reminder inside a window around the interval. */
  randomize: boolean;
  /** Quiet hours on/off, and the window as "HH:MM" 24h. */
  quietEnabled: boolean;
  quietStart: string;
  quietEnd: string;
  /** How the reminder card is laid out. */
  layout: NotificationLayout;
  /** Play the bell once when a reminder appears. */
  soundEnabled: boolean;
  /** First-run screen has been completed or dismissed. */
  onboarded: boolean;
}

/** Runtime state the background worker keeps; not user preferences. */
export interface RuntimeState {
  /** Epoch ms of the next scheduled reminder, or null when off. */
  nextFireAt: number | null;
  /** Epoch ms of the last reminder that was actually shown. */
  lastFiredAt: number | null;
  /** Reminder ids still to show in the current cycle. */
  cycle: string[];
  /** The reminder shown most recently. */
  lastReminderId: string | null;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: false,
  interval: 60,
  customMinutes: 45,
  randomize: false,
  quietEnabled: true,
  quietStart: "22:00",
  quietEnd: "07:00",
  layout: "compact",
  soundEnabled: true,
  onboarded: false,
};

export const DEFAULT_STATE: RuntimeState = {
  nextFireAt: null,
  lastFiredAt: null,
  cycle: [],
  lastReminderId: null,
};

export const CUSTOM_MIN = 5;
export const CUSTOM_MAX = 720;

const SETTINGS_KEY = "settings";
const STATE_KEY = "state";

export function intervalMinutes(s: Settings): number {
  if (s.interval === "custom") {
    return Math.min(CUSTOM_MAX, Math.max(CUSTOM_MIN, Math.round(s.customMinutes || CUSTOM_MIN)));
  }
  return s.interval;
}

function sanitize(raw: unknown): Settings {
  const r = (raw ?? {}) as Partial<Settings> & { notificationStyle?: string };
  const interval =
    r.interval === "custom" || r.interval === 30 || r.interval === 60 || r.interval === 120
      ? r.interval
      : DEFAULT_SETTINGS.interval;
  // earlier builds stored notificationStyle; "silent" meant sound off
  const legacySilent = r.notificationStyle === "silent";
  return {
    enabled: !!r.enabled,
    interval,
    customMinutes:
      typeof r.customMinutes === "number" && Number.isFinite(r.customMinutes)
        ? r.customMinutes
        : DEFAULT_SETTINGS.customMinutes,
    randomize: !!r.randomize,
    quietEnabled: typeof r.quietEnabled === "boolean" ? r.quietEnabled : true,
    quietStart: isTime(r.quietStart) ? r.quietStart : DEFAULT_SETTINGS.quietStart,
    quietEnd: isTime(r.quietEnd) ? r.quietEnd : DEFAULT_SETTINGS.quietEnd,
    layout: r.layout === "expanded" ? "expanded" : "compact",
    soundEnabled: typeof r.soundEnabled === "boolean" ? r.soundEnabled : !legacySilent,
    onboarded: !!r.onboarded,
  };
}

export function isTime(v: unknown): v is string {
  return typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}

export async function loadSettings(): Promise<Settings> {
  const got = await ext.storage.local.get(SETTINGS_KEY);
  return sanitize(got[SETTINGS_KEY]);
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await loadSettings();
  const next = sanitize({ ...current, ...patch });
  await ext.storage.local.set({ [SETTINGS_KEY]: next });
  return next;
}

export async function loadState(): Promise<RuntimeState> {
  const got = await ext.storage.local.get(STATE_KEY);
  return { ...DEFAULT_STATE, ...((got[STATE_KEY] as Partial<RuntimeState>) ?? {}) };
}

export async function saveState(patch: Partial<RuntimeState>): Promise<RuntimeState> {
  const current = await loadState();
  const next = { ...current, ...patch };
  await ext.storage.local.set({ [STATE_KEY]: next });
  return next;
}

/** Subscribe to settings changes (popup ↔ background). Returns an unsubscribe. */
export function onSettingsChanged(cb: (s: Settings) => void): () => void {
  const handler = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
    if (area === "local" && changes[SETTINGS_KEY]) cb(sanitize(changes[SETTINGS_KEY].newValue));
  };
  ext.storage.onChanged.addListener(handler);
  return () => ext.storage.onChanged.removeListener(handler);
}

export function onStateChanged(cb: (s: RuntimeState) => void): () => void {
  const handler = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
    if (area === "local" && changes[STATE_KEY]) {
      cb({ ...DEFAULT_STATE, ...((changes[STATE_KEY].newValue as Partial<RuntimeState>) ?? {}) });
    }
  };
  ext.storage.onChanged.addListener(handler);
  return () => ext.storage.onChanged.removeListener(handler);
}
