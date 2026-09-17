// Bundles the extension into dist/ with esbuild and copies static files.
import { build, context } from "esbuild";
import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const watch = process.argv.includes("--watch");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

function copyStatic() {
  cpSync(join(root, "manifest.json"), join(dist, "manifest.json"));
  cpSync(join(root, "src/popup/popup.html"), join(dist, "popup.html"));
  cpSync(join(root, "src/popup/popup.css"), join(dist, "popup.css"));
  cpSync(join(root, "src/popup/onboarding.html"), join(dist, "onboarding.html"));
  cpSync(join(root, "src/card/card.html"), join(dist, "card.html"));
  cpSync(join(root, "src/card/card.css"), join(dist, "card.css"));
  cpSync(join(root, "src/offscreen/offscreen.html"), join(dist, "offscreen.html"));
  cpSync(join(root, "assets"), join(dist, "assets"), { recursive: true });
  cpSync(join(root, "fonts"), join(dist, "fonts"), { recursive: true });
  if (existsSync(join(root, "icons"))) cpSync(join(root, "icons"), join(dist, "icons"), { recursive: true });
}

const options = {
  entryPoints: {
    background: join(root, "src/background/index.ts"),
    popup: join(root, "src/popup/popup.ts"),
    onboarding: join(root, "src/popup/onboarding.ts"),
    card: join(root, "src/card/card.ts"),
    offscreen: join(root, "src/offscreen/offscreen.ts"),
  },
  outdir: dist,
  bundle: true,
  format: "esm",
  target: ["chrome116"],
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
  if (!existsSync(join(root, "icons/icon128.png"))) {
    console.warn("icons/ missing: run `npm run icons -w extension` first.");
  }
}
