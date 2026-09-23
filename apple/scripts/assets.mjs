// Puts the extension's drawn marks into the app's asset catalog:
//   the hand-drawn UI glyphs (illustrations/src/glyphs.ts) as template vectors,
//   the sticker and ring crops (extension/icons) as images.
//   node apple/scripts/assets.mjs  → apple/App/Assets.xcassets/
import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gearSvg, arrowLeftSvg, bellSvg, playSvg, chevronDataUri } from "../../illustrations/src/glyphs.ts";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CATALOG = join(repo, "apple", "App", "Assets.xcassets");

function imageset(name, file, contents, { template = false } = {}) {
  const dir = join(CATALOG, `${name}.imageset`);
  mkdirSync(dir, { recursive: true });
  if (typeof contents === "string") writeFileSync(join(dir, file), contents);
  else cpSync(contents.from, join(dir, file));
  const json = {
    images: [{ filename: file, idiom: "universal" }],
    info: { author: "xcode", version: 1 },
    properties: template
      ? { "preserves-vector-representation": true, "template-rendering-intent": "template" }
      : {},
  };
  writeFileSync(join(dir, "Contents.json"), JSON.stringify(json, null, 2) + "\n");
}

/** The glyph functions return inline SVG for HTML; Xcode wants a standalone file. */
function standalone(svg, size) {
  return (
    svg
      .replace(/\sclass="[^"]*"/g, "")
      .replace(/\saria-hidden="true"|\sfocusable="false"/g, "")
      .replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"`)
      .replaceAll("currentColor", "#000000")
      .replace(/\s*\n\s*/g, " ")
      .trim() + "\n"
  );
}

imageset("glyph-gear", "gear.svg", standalone(gearSvg(), 24), { template: true });
imageset("glyph-back", "back.svg", standalone(arrowLeftSvg(), 24), { template: true });
imageset("glyph-bell", "bell.svg", standalone(bellSvg(), 24), { template: true });
imageset("glyph-play", "play.svg", standalone(playSvg(), 24), { template: true });
const chevron = decodeURIComponent(chevronDataUri.replace("data:image/svg+xml,", ""))
  .replace("<svg", `<svg width="16" height="16"`)
  .replace("#1F3B3E", "#000000");
imageset("glyph-chevron", "chevron.svg", chevron + "\n", { template: true });

imageset("sticker", "sticker.png", { from: join(repo, "extension", "icons", "sticker.png") });
imageset("ring", "ring.png", { from: join(repo, "extension", "icons", "ring.png") });

console.log(`wrote glyphs, sticker and ring → ${CATALOG}`);
