// The reminder card page. Opened by the background worker as a small window:
//   card.html?id=<reminder id>&layout=compact|expanded&sound=1|0
// Shows one reminder, rings the bell once, and goes away on its own.

import { getReminder, illustrationUrl } from "../lib/reminders.ts";
import { playReminderSound } from "../lib/audio.ts";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const params = new URLSearchParams(location.search);
const reminder = getReminder(params.get("id"));
const layout = params.get("layout") === "expanded" ? "expanded" : "compact";
const sound = params.get("sound") === "1";
const preview = params.get("preview") === "1"; // rendered inside settings, not as a window

const card = $("card");
const img = $("illustration") as HTMLImageElement;
const more = $("more") as HTMLButtonElement;

// ---------- render ----------
document.title = reminder.title;
card.dataset.layout = layout;
card.dataset.motion = reminder.motion;
img.src = illustrationUrl(reminder);
img.alt = reminder.alt;
$("title").textContent = reminder.title;
$("supporting").textContent = reminder.supporting;
$("reflection-text").textContent = reminder.reflection ?? "";
more.hidden = !(layout === "expanded" && reminder.reflection);

// ---------- the bell, once ----------
if (sound && !preview) void playReminderSound(true);

// ---------- go away on its own ----------
const LINGER = layout === "expanded" ? 14_000 : 9_000;
let timer: number | null = null;
let held = false; // hovered, focused, or expanded

function close() {
  if (preview) return;
  chrome.runtime.sendMessage({ type: "wyb:card-close" }, () => {
    if (chrome.runtime.lastError) window.close();
  });
}

function arm() {
  if (timer != null) clearTimeout(timer);
  timer = held || preview ? null : window.setTimeout(close, LINGER);
}

function hold(on: boolean) {
  held = on || more.getAttribute("aria-expanded") === "true";
  arm();
}

card.addEventListener("mouseenter", () => hold(true));
card.addEventListener("mouseleave", () => hold(false));
card.addEventListener("focusin", () => hold(true));
card.addEventListener("focusout", () => hold(false));

$("close").addEventListener("click", close);
$("close-button").addEventListener("click", close);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") close();
});

// ---------- size the window to the card ----------
function fitWindow() {
  if (preview) return;
  // the card's own box plus its 10px margins, plus Chrome's small title bar
  const box = card.getBoundingClientRect();
  const width = Math.ceil(box.width + 20);
  const height = Math.ceil(box.height + 20 + 40);
  chrome.runtime.sendMessage({ type: "wyb:card-resize", width, height }, () => void chrome.runtime.lastError);
}
// once fonts and the illustration are in, so the measurement is honest
Promise.all([document.fonts.ready, img.decode().catch(() => undefined)]).then(() => requestAnimationFrame(fitWindow));

more.addEventListener("click", () => {
  const open = more.getAttribute("aria-expanded") !== "true";
  more.setAttribute("aria-expanded", String(open));
  card.dataset.open = String(open);
  held = open;
  arm();
  requestAnimationFrame(fitWindow);
});

arm();
