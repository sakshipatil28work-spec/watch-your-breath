// Dev-only: serves dist/ with a chrome.* stub injected so the popup and
// first-run pages can be viewed in an ordinary browser tab.
//   node scripts/preview.mjs   →  http://localhost:4180/popup.html
//   ?state=off|on|quiet|active|custom|denied  presets the stubbed storage.
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const port = Number(process.env.PORT || 4180);

const STUB = `<script>
(() => {
  const q = new URLSearchParams(location.search);
  const preset = q.get("state") || "on";
  const now = Date.now();
  const presets = {
    off:    { settings: { enabled: false, interval: 60, customMinutes: 45, randomize: false, quietEnabled: true, quietStart: "22:00", quietEnd: "07:00", layout: "compact", soundEnabled: true, onboarded: true }, state: { nextFireAt: null, lastFiredAt: null, cycle: [], lastReminderId: null } },
    on:     { settings: { enabled: true,  interval: 60, customMinutes: 45, randomize: false, quietEnabled: true, quietStart: "22:00", quietEnd: "07:00", layout: "compact", soundEnabled: true, onboarded: true }, state: { nextFireAt: now + 41*60000, lastFiredAt: null, cycle: ["nothing-to-change","a-little-pause"], lastReminderId: "watch-your-breath" } },
    quiet:  { settings: { enabled: true,  interval: 60, customMinutes: 45, randomize: true,  quietEnabled: true, quietStart: "00:00", quietEnd: "23:59", layout: "expanded", soundEnabled: true, onboarded: true }, state: { nextFireAt: now + 9*3600000, lastFiredAt: null, cycle: ["no-hurry"], lastReminderId: "be-here" } },
    active: { settings: { enabled: true,  interval: 30, customMinutes: 45, randomize: false, quietEnabled: true, quietStart: "22:00", quietEnd: "07:00", layout: "compact", soundEnabled: false, onboarded: true }, state: { nextFireAt: now + 29*60000, lastFiredAt: now - 5000, cycle: [], lastReminderId: "let-it-move" } },
    custom: { settings: { enabled: true,  interval: "custom", customMinutes: 45, randomize: true, quietEnabled: true, quietStart: "22:00", quietEnd: "07:00", layout: "compact", soundEnabled: true, onboarded: true }, state: { nextFireAt: now + 44*60000, lastFiredAt: null, cycle: [], lastReminderId: null } },
    denied: { settings: { enabled: true,  interval: 60, customMinutes: 45, randomize: false, quietEnabled: true, quietStart: "22:00", quietEnd: "07:00", layout: "compact", soundEnabled: true, onboarded: true }, state: { nextFireAt: now + 41*60000, lastFiredAt: null, cycle: [], lastReminderId: null } },
  };
  const store = structuredClone(presets[preset] || presets.on);
  const listeners = [];
  const emit = (changes) => listeners.forEach((l) => l(changes, "local"));
  window.chrome = {
    runtime: {
      getManifest: () => ({ version: "0.1.0 (preview)" }),
      getURL: (p) => "/" + p,
      sendMessage: (msg, cb) => {
        if (msg.type === "wyb:ensure") cb && cb(store.state);
        else if (msg.type === "wyb:preview") { window.open("/card.html?id=nothing-to-change&layout=" + store.settings.layout + "&sound=0", "wyb-card", "popup,width=412,height=188"); cb && cb({ ok: true }); }
        else if (msg.type === "wyb:card-close") { window.close(); cb && cb({ ok: true }); }
        else if (msg.type === "wyb:card-resize") { try { window.resizeTo(msg.width || 412, msg.height); } catch {} cb && cb({ ok: true }); }
      },
      lastError: null,
    },
    storage: {
      local: {
        get: async (key) => ({ [key]: store[key] }),
        set: async (obj) => {
          const changes = {};
          for (const [k, v] of Object.entries(obj)) { changes[k] = { oldValue: store[k], newValue: v }; store[k] = v; }
          emit(changes);
        },
      },
      onChanged: { addListener: (l) => listeners.push(l), removeListener: (l) => { const i = listeners.indexOf(l); if (i >= 0) listeners.splice(i, 1); } },
    },
    notifications: { getPermissionLevel: (cb) => cb(preset === "denied" ? "denied" : "granted") },
    tabs: { create: ({ url }) => console.log("[stub] open", url) },
  };
})();
</script>`;

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json" };

createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  let path = url.pathname === "/" ? "/popup.html" : url.pathname;
  const file = join(dist, path);
  if (!existsSync(file)) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  let body = readFileSync(file);
  if (path.endsWith(".html")) body = Buffer.from(body.toString().replace("<head>", "<head>" + STUB));
  res.writeHead(200, { "content-type": types[extname(path)] || "application/octet-stream" });
  res.end(body);
}).listen(port, () => console.log(`preview → http://localhost:${port}/popup.html?state=on`));
