// Bundles the extension with esbuild and copies static files.
//   node scripts/build.mjs                   → dist/          (Chrome, Edge, Brave, Opera, Arc, Vivaldi)
//   node scripts/build.mjs --target firefox  → dist-firefox/  (Firefox)
// Same source; only the manifest differs. See manifestFor().
import { build, context } from "esbuild";
import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const watch = process.argv.includes("--watch");
const targetIdx = process.argv.indexOf("--target");
const target = targetIdx >= 0 ? process.argv[targetIdx + 1] : "chrome";
if (!["chrome", "firefox"].includes(target)) throw new Error(`unknown --target ${target}`);
const dist = join(root, target === "firefox" ? "dist-firefox" : "dist");

/** The manifest for each browser, derived from manifest.json (the Chrome one). */
function manifestFor(browser) {
  const m = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
  if (browser !== "firefox") return m;
  // Firefox: an event page instead of a service worker, no offscreen API
  // (its background page can play audio itself), and an add-on id.
  delete m.minimum_chrome_version;
  m.permissions = m.permissions.filter((p) => p !== "offscreen");
  m.background = { scripts: ["background.js"], type: "module" };
  m.browser_specific_settings = {
    gecko: {
      id: "watch-your-breath@sakshipatil.dev",
      strict_min_version: "142.0",
      // nothing is collected or sent anywhere; Firefox shows this on the listing
      data_collection_permissions: { required: ["none"] },
    },
  };
  return m;
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

function copyStatic() {
  writeFileSync(join(dist, "manifest.json"), JSON.stringify(manifestFor(target), null, 2) + "\n");
  cpSync(join(root, "src/popup/popup.html"), join(dist, "popup.html"));
  cpSync(join(root, "src/popup/popup.css"), join(dist, "popup.css"));
  cpSync(join(root, "src/popup/onboarding.html"), join(dist, "onboarding.html"));
  cpSync(join(root, "src/card/card.html"), join(dist, "card.html"));
  cpSync(join(root, "src/card/card.css"), join(dist, "card.css"));
  if (target !== "firefox") cpSync(join(root, "src/offscreen/offscreen.html"), join(dist, "offscreen.html"));
  cpSync(join(root, "assets"), join(dist, "assets"), { recursive: true });
  cpSync(join(root, "fonts"), join(dist, "fonts"), { recursive: true });
  if (existsSync(join(root, "icons"))) cpSync(join(root, "icons"), join(dist, "icons"), { recursive: true });
}

const entryPoints = {
  background: join(root, "src/background/index.ts"),
  popup: join(root, "src/popup/popup.ts"),
  onboarding: join(root, "src/popup/onboarding.ts"),
  card: join(root, "src/card/card.ts"),
};
if (target !== "firefox") entryPoints.offscreen = join(root, "src/offscreen/offscreen.ts");

const options = {
  entryPoints,
  outdir: dist,
  bundle: true,
  format: "esm",
  target: target === "firefox" ? ["firefox115"] : ["chrome116"],
  minify: !watch,
  sourcemap: watch ? "inline" : false,
  legalComments: "none",
  logLevel: "info",
};

copyStatic();
if (watch) {
  const ctx = await context({
    ...options,
    plugins: [{ name: "copy-static", setup: (b) => b.onEnd(copyStatic) }],
  });
  await ctx.watch();
  console.log("watching for changes");
} else {
  await build(options);
  console.log(`built for ${target} → ${dist}`);
  if (!existsSync(join(root, "icons/icon128.png"))) {
    console.warn("icons/ missing: run `npm run icons -w extension` first.");
  }
}
