import {
  loadSettings,
  loadState,
  saveSettings,
  onSettingsChanged,
  onStateChanged,
  CUSTOM_MIN,
  CUSTOM_MAX,
  type Settings,
  type RuntimeState,
  type NotificationLayout,
} from "../lib/settings.ts";
import { isQuiet, quietEndAfter, formatClock } from "../lib/schedule.ts";
import { COPY } from "../lib/copy.ts";
import { playReminderSound } from "../lib/audio.ts";
import { ext } from "../lib/ext.ts";
import { REMINDERS, illustrationUrl } from "../lib/reminders.ts";
import { emblemHtml, gearSvg, arrowLeftSvg, bellSvg, playSvg, chevronDataUri } from "../ui/ink.ts";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const app = $("app");
const views = { home: $("view-home"), settings: $("view-settings") };
type View = keyof typeof views;

function showView(v: View) {
  for (const [name, el] of Object.entries(views)) el.hidden = name !== v;
  app.dataset.view = v;
  if (v === "settings") $("close-settings").focus();
}

// ---------- drawings ----------
document.documentElement.style.setProperty("--chevron", `url("${chevronDataUri}")`);
$("emblem").innerHTML = emblemHtml({ rings: true });
$("open-settings").innerHTML = gearSvg();
$("close-settings").innerHTML = arrowLeftSvg();
$("bell-glyph").innerHTML = bellSvg();
document.querySelector(".play-glyph")!.innerHTML = playSvg();
$("version").textContent = COPY.settings.version(ext.runtime.getManifest().version);

// ---------- controls (home + settings share the same settings) ----------
const toggles = {
  enabled: [$("toggle-enabled"), $("toggle-enabled-2")] as HTMLButtonElement[],
  sound: [$("toggle-sound"), $("toggle-sound-2")] as HTMLButtonElement[],
  randomize: [$("toggle-randomize")] as HTMLButtonElement[],
};
const selects = [$("select-interval"), $("select-interval-2")] as HTMLSelectElement[];
const layoutSelect = $("select-layout") as HTMLSelectElement;
const customRows = [$("row-custom"), $("row-custom-2")];
const customInputs = [$("input-custom"), $("input-custom-2")] as HTMLInputElement[];
const quietStart = $("input-quiet-start") as HTMLInputElement;
const quietEnd = $("input-quiet-end") as HTMLInputElement;
const layoutRadios = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="layout"]'));

function setToggle(btn: HTMLButtonElement, on: boolean) {
  btn.setAttribute("aria-checked", String(on));
  const text = document.getElementById(`${btn.id}-text`);
  if (text) text.textContent = on ? "On" : "Off";
}

let current: Settings;
let state: RuntimeState = { nextFireAt: null, lastFiredAt: null, cycle: [], lastReminderId: null };

function render(s: Settings) {
  current = s;
  app.dataset.enabled = String(s.enabled);
  toggles.enabled.forEach((b) => setToggle(b, s.enabled));
  toggles.sound.forEach((b) => setToggle(b, s.soundEnabled));
  toggles.randomize.forEach((b) => setToggle(b, s.randomize));
  selects.forEach((sel) => (sel.value = String(s.interval)));
  layoutSelect.value = s.layout;
  const isCustom = s.interval === "custom";
  customRows.forEach((r) => (r.hidden = !isCustom));
  customInputs.forEach((i) => {
    if (document.activeElement !== i) i.value = String(s.customMinutes);
  });
  if (document.activeElement !== quietStart) quietStart.value = s.quietStart;
  if (document.activeElement !== quietEnd) quietEnd.value = s.quietEnd;
  layoutRadios.forEach((r) => (r.checked = r.value === s.layout));
  renderPreview(s);
  renderQuiet(s);
  renderStatus();
}

/** The settings preview: the reminder that will come next, worded as its notification will be. */
function renderPreview(s: Settings) {
  const nextId = state.cycle[0] ?? REMINDERS.find((r) => r.id !== state.lastReminderId)?.id ?? REMINDERS[0].id;
  const r = REMINDERS.find((x) => x.id === nextId) ?? REMINDERS[0];
  ($("preview-icon") as HTMLImageElement).src = illustrationUrl(r, "icon");
  $("preview-title").textContent = r.title;
  $("preview-message").textContent =
    s.layout === "expanded" && r.reflection ? `${r.supporting}\n${r.reflection}` : r.supporting;
}

function renderQuiet(s: Settings) {
  const now = new Date();
  const active = s.enabled && isQuiet(now, s);
  $("group-quiet").classList.toggle("is-quiet", active);
  $("quiet-now").textContent = active ? `Quiet now, until ${formatClock(quietEndAfter(now, s))}.` : "";
}

function renderStatus() {
  const el = $("status");
  const emblem = $("emblem");
  const now = new Date();
  const justFired = state.lastFiredAt != null && now.getTime() - state.lastFiredAt < 90_000;
  emblem.classList.toggle("is-active", justFired && current.enabled);

  if (!current.enabled) {
    el.textContent = COPY.home.off;
    el.dataset.tone = "off";
    return;
  }
  if (justFired) {
    el.textContent = COPY.home.active;
    el.dataset.tone = "active";
    return;
  }
  if (isQuiet(now, current)) {
    el.textContent = COPY.home.quiet(formatClock(quietEndAfter(now, current)));
    el.dataset.tone = "quiet";
    return;
  }
  if (state.nextFireAt) {
    el.textContent = COPY.home.next(formatClock(new Date(state.nextFireAt)));
    el.dataset.tone = "on";
    return;
  }
  el.textContent = COPY.home.scheduling;
  el.dataset.tone = "on";
}

/** Swap a hint’s text for a moment, then put the original back. */
function flash(el: HTMLElement, text: string, error = false, ms = 2800) {
  const original = el.dataset.original ?? el.textContent ?? "";
  el.dataset.original = original;
  el.textContent = text;
  el.classList.toggle("is-error", error);
  window.clearTimeout(Number(el.dataset.timer));
  el.dataset.timer = String(
    window.setTimeout(() => {
      el.textContent = original;
      el.classList.remove("is-error");
    }, ms)
  );
}

// ---------- events ----------
toggles.enabled.forEach((b) =>
  b.addEventListener("click", () => void saveSettings({ enabled: !current.enabled, onboarded: true }))
);
toggles.sound.forEach((b) => b.addEventListener("click", () => void saveSettings({ soundEnabled: !current.soundEnabled })));
toggles.randomize.forEach((b) => b.addEventListener("click", () => void saveSettings({ randomize: !current.randomize })));

selects.forEach((sel) =>
  sel.addEventListener("change", () => {
    const v = sel.value;
    const interval = v === "custom" ? "custom" : (Number(v) as 30 | 60 | 120);
    void saveSettings({ interval });
    if (interval === "custom") {
      const input = sel.id.endsWith("-2") ? customInputs[1] : customInputs[0];
      setTimeout(() => input.focus(), 0);
    }
  })
);

layoutSelect.addEventListener("change", () => void saveSettings({ layout: layoutSelect.value as NotificationLayout }));
layoutRadios.forEach((r) =>
  r.addEventListener("change", () => {
    if (r.checked) void saveSettings({ layout: r.value as NotificationLayout });
  })
);

function commitCustom(input: HTMLInputElement) {
  const n = Math.round(Number(input.value));
  if (!Number.isFinite(n)) return;
  const clamped = Math.min(CUSTOM_MAX, Math.max(CUSTOM_MIN, n));
  input.value = String(clamped);
  if (clamped !== current.customMinutes) void saveSettings({ customMinutes: clamped });
}
customInputs.forEach((i) => {
  i.addEventListener("change", () => commitCustom(i));
  i.addEventListener("blur", () => commitCustom(i));
  i.addEventListener("keydown", (e) => {
    if (e.key === "Enter") i.blur();
  });
});

quietStart.addEventListener("change", () => void saveSettings({ quietStart: quietStart.value, quietEnabled: true }));
quietEnd.addEventListener("change", () => void saveSettings({ quietEnd: quietEnd.value, quietEnabled: true }));

$("open-settings").addEventListener("click", () => showView("settings"));
$("close-settings").addEventListener("click", () => showView("home"));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && app.dataset.view === "settings") showView("home");
});

const previewBtn = $("send-preview") as HTMLButtonElement;
previewBtn.addEventListener("click", () => {
  previewBtn.disabled = true;
  ext.runtime
    .sendMessage({ type: "wyb:preview" })
    .then((res?: { ok: boolean }) => Boolean(res?.ok))
    .catch(() => false)
    .then((ok) => {
      flash($("preview-hint"), ok ? COPY.settings.previewSent : "Couldn’t show it. Try once more.", !ok);
      setTimeout(() => (previewBtn.disabled = false), 1200);
    });
});

const playBtn = $("play-bell") as HTMLButtonElement;
playBtn.addEventListener("click", async () => {
  playBtn.disabled = true;
  const ok = await playReminderSound(true); // the preview always plays: the user just asked for it
  if (!ok) flash($("bell-hint"), COPY.settings.bellFailed, true, 5000);
  setTimeout(() => (playBtn.disabled = false), 1500);
});

$("open-chrome-settings").addEventListener("click", () => {
  void ext.tabs.create({ url: "chrome://settings/content/notifications" });
});

// ---------- permission (only the fallback path needs it; Chrome-only API) ----------
async function checkPermission(): Promise<void> {
  const api = ext.notifications as { getPermissionLevel?: (cb: (level: string) => void) => unknown };
  if (typeof api.getPermissionLevel !== "function") {
    $("denied-note").hidden = true;
    return;
  }
  const level = await new Promise<string>((resolve) => {
    try {
      const r = api.getPermissionLevel!(resolve);
      if (r && typeof (r as Promise<string>).then === "function") void (r as Promise<string>).then(resolve);
    } catch {
      resolve("granted");
    }
  });
  $("denied-note").hidden = level !== "denied";
}

// ---------- boot ----------
async function boot() {
  const [s, st] = await Promise.all([loadSettings(), loadState()]);
  state = st;
  render(s);
  showView("home");
  await checkPermission();
  ext.runtime
    .sendMessage({ type: "wyb:ensure" })
    .then((fresh?: RuntimeState) => {
      if (!fresh) return;
      state = fresh;
      renderStatus();
      renderPreview(current);
    })
    .catch(() => undefined);
}

onSettingsChanged((s) => render(s));
onStateChanged((st) => {
  state = st;
  renderStatus();
  renderPreview(current);
});

void boot();
