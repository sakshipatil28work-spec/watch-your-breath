// Copies the packaged extension zips into the site, under stable names, so the
// install card can offer them until the store listings exist.
import { copyFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { version } = JSON.parse(readFileSync(join(root, "extension/manifest.json"), "utf8"));
const out = join(root, "web/public/downloads");
mkdirSync(out, { recursive: true });
for (const [src, dst] of [
  [`watch-your-breath-${version}.zip`, "watch-your-breath-chrome.zip"],
  [`watch-your-breath-${version}-firefox.zip`, "watch-your-breath-firefox.zip"],
]) {
  const from = join(root, "extension", src);
  if (!existsSync(from)) throw new Error(`${from} is missing: run npm run package:all -w extension first`);
  copyFileSync(from, join(out, dst));
  console.log(`${src} → web/public/downloads/${dst}`);
}
