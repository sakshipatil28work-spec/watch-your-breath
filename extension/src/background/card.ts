// The reminder drawn in the page itself.
//
// Why this exists: a system notification is handed to the operating system,
// and the operating system decides what to draw. Windows draws the large
// illustration; macOS has never drawn it (deprecated since Chrome 59), Edge
// hands it to a Windows toast that leaves it out, and Firefox does not offer
// the format at all. The drawing is the reminder, so on three of those four
// the reminder arrives without the thing it is for.
//
// Here we draw it ourselves, so it looks the same in every browser. The cost
// is that it can only appear where we are allowed to draw: inside a page, in a
// browser that is on screen. So this is the channel used when the browser is
// in front of the person, and the system notification is the channel used when
// it is not. One reminder either way, never both.
//
// Nothing is added to the manifest's required permissions: the host access
// this needs is optional and requested only if the setting is switched on.

import { ext } from "../lib/ext.ts";
import { illustrationUrl, type Reminder } from "../lib/reminders.ts";

/** Everything the page needs, carried in the call: it can reach nothing of ours. */
export interface CardPayload {
  /** The wide illustration as a data URL. */
  image: string;
  /** Eczar, as a data URL, so the card is set in the extension's own face. */
  font: string;
  title: string;
  supporting: string;
  reflection: string;
  /** How long it stays before leaving on its own. */
  linger: number;
  dismiss: string;
}

const FONT_PATH = "fonts/Eczar-normal-500-700.woff2";

/** Base64 without blowing the stack on a 50 KB image. */
function toBase64(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    out += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(out);
}

/**
 * Read one of our own files as a data URL. The card is drawn inside someone
 * else's page, which cannot load a chrome-extension:// URL unless we declare
 * the file web-accessible — and declaring it lets any site on the web probe
 * for it and know the extension is installed. Carrying the bytes in the call
 * instead keeps the extension invisible to the pages it draws on.
 */
const cache = new Map<string, string>();
async function dataUrl(url: string, mime: string): Promise<string> {
  const hit = cache.get(url);
  if (hit) return hit;
  const res = await fetch(url);
  const buf = new Uint8Array(await res.arrayBuffer());
  const out = `data:${mime};base64,${toBase64(buf)}`;
  cache.set(url, out);
  return out;
}

/**
 * Drawn inside the page. This function is serialised and runs with none of the
 * scope it was written in, so everything it needs arrives in `p` and every
 * value it uses is written out in full.
 *
 * It lives in a shadow root with `all: initial`, so no page's stylesheet can
 * reach it and it can leak nothing back. It is inert: no links, no inputs,
 * nothing to click but the dismiss.
 */
function draw(p: CardPayload): boolean {
  // a tab that is not being looked at is not a reminder
  if (document.hidden || !document.body) return false;

  const HOST_ID = "watch-your-breath-reminder";
  document.getElementById(HOST_ID)?.remove();

  const host = document.createElement("div");
  host.id = HOST_ID;
  // the page's own stacking cannot bury it, and it never takes a click
  host.style.cssText = "all:initial;position:fixed;inset:auto 20px 20px auto;z-index:2147483647;";
  const root = host.attachShadow({ mode: "open" });

  const quiet = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const style = document.createElement("style");
  style.textContent = `
    @font-face{font-family:'WYB Eczar';font-style:normal;font-weight:500 700;src:url(${p.font}) format('woff2');}
    :host{all:initial}
    *{margin:0;padding:0;box-sizing:border-box}
    .card{
      width:360px;max-width:calc(100vw - 40px);
      background:#f3e8d2;color:#243c3a;
      border:1.5px solid #243c3a;
      border-radius:26px 24px 27px 25px / 25px 27px 24px 26px;
      overflow:hidden;
      box-shadow:0 12px 32px rgba(36,60,58,.22);
      font-family:'WYB Eczar',Georgia,'Times New Roman',serif;
      ${quiet ? "" : "animation:wyb-in 420ms cubic-bezier(.23,1,.32,1) both;"}
    }
    .art{display:block;width:100%;height:auto;background:#f3e8d2}
    .words{padding:14px 44px 16px 18px;position:relative}
    .title{font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-.005em}
    .supporting{font-size:17px;line-height:1.3;font-weight:500;color:rgba(36,60,58,.72);margin-top:2px}
    .reflection{font-size:15px;line-height:1.45;font-weight:500;color:rgba(36,60,58,.72);margin-top:8px}
    .close{
      position:absolute;top:10px;right:10px;width:28px;height:28px;
      display:grid;place-items:center;border:0;background:none;cursor:pointer;
      border-radius:50%;color:rgba(36,60,58,.34);
    }
    .close:hover{color:#243c3a}
    .close svg{width:14px;height:14px}
    @keyframes wyb-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes wyb-out{to{opacity:0;transform:translateY(6px)}}
    .leaving{animation:wyb-out 320ms ease-out both}
  `;

  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("role", "status");
  card.setAttribute("aria-live", "polite");

  const art = document.createElement("img");
  art.className = "art";
  art.alt = "";
  art.src = p.image;

  const words = document.createElement("div");
  words.className = "words";
  const title = document.createElement("p");
  title.className = "title";
  title.textContent = p.title;
  const supporting = document.createElement("p");
  supporting.className = "supporting";
  supporting.textContent = p.supporting;
  words.append(title, supporting);
  if (p.reflection) {
    const reflection = document.createElement("p");
    reflection.className = "reflection";
    reflection.textContent = p.reflection;
    words.append(reflection);
  }

  const close = document.createElement("button");
  close.className = "close";
  close.type = "button";
  close.setAttribute("aria-label", p.dismiss);
  close.innerHTML =
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.6 3.4 C6.4 6.2 9.3 9.1 12.2 12 M12.3 3.5 C9.5 6.3 6.6 9.2 3.7 12.1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  words.append(close);

  card.append(art, words);
  root.append(style, card);
  document.body.append(host);

  let gone = false;
  const leave = () => {
    if (gone) return;
    gone = true;
    if (quiet) return void host.remove();
    card.classList.add("leaving");
    setTimeout(() => host.remove(), 340);
  };
  close.addEventListener("click", leave);
  setTimeout(leave, p.linger);
  return true;
}

/** True when the user is looking at a browser window we are allowed to draw in. */
async function focusedTabId(): Promise<number | null> {
  try {
    const win = await ext.windows.getLastFocused({ populate: false });
    // not in front: the system notification is the right channel instead
    if (!win.focused || win.state === "minimized") return null;
    const [tab] = await ext.tabs.query({ active: true, windowId: win.id });
    if (!tab?.id || !tab.url) return null;
    // the browser's own pages refuse injection, and a reminder drawn on the
    // extension's own settings would be absurd anyway
    if (!/^https?:/i.test(tab.url)) return null;
    return tab.id;
  } catch {
    return null;
  }
}

export async function hostAccess(): Promise<boolean> {
  try {
    return await ext.permissions.contains({ origins: ["<all_urls>"] });
  } catch {
    return false;
  }
}

/**
 * Draw the reminder in the page the person is looking at. Returns false when
 * that was not possible for any reason, and the caller shows the system
 * notification instead, so a refusal here never costs the reminder.
 */
export async function showInPage(r: Reminder, expanded: boolean, linger: number, dismiss: string): Promise<boolean> {
  try {
    if (!(await hostAccess())) return false;
    const tabId = await focusedTabId();
    if (tabId === null) return false;
    const [image, font] = await Promise.all([
      dataUrl(illustrationUrl(r, "wide"), "image/png"),
      dataUrl(ext.runtime.getURL(FONT_PATH), "font/woff2"),
    ]);
    const payload: CardPayload = {
      image,
      font,
      title: r.title,
      supporting: r.supporting,
      reflection: expanded && r.reflection ? r.reflection : "",
      linger,
      dismiss,
    };
    const [result] = await ext.scripting.executeScript({
      target: { tabId },
      func: draw,
      args: [payload],
      world: "ISOLATED",
    });
    return result?.result === true;
  } catch (e) {
    console.warn("Watch Your Breath: could not draw the reminder in the page.", e);
    return false;
  }
}
