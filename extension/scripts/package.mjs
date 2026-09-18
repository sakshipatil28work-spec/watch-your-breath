// Zips a build for its store:
//   node scripts/package.mjs                   → watch-your-breath-<version>.zip          (Chrome Web Store, Edge Add-ons)
//   node scripts/package.mjs --target firefox  → watch-your-breath-<version>-firefox.zip  (Firefox Add-ons)
import { zipSync } from "fflate";
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const targetIdx = process.argv.indexOf("--target");
const target = targetIdx >= 0 ? process.argv[targetIdx + 1] : "chrome";
const dist = join(root, target === "firefox" ? "dist-firefox" : "dist");
if (!existsSync(dist)) throw new Error(`${dist} is missing: build for ${target} first`);
const { version } = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));

const files = {};
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else files[relative(dist, p).replaceAll("\\", "/")] = readFileSync(p);
  }
}
walk(dist);
const zip = zipSync(files, { level: 9 });
const outFile = join(root, `watch-your-breath-${version}${target === "firefox" ? "-firefox" : ""}.zip`);
writeFileSync(outFile, zip);
console.log(`packaged ${Object.keys(files).length} files into ${outFile}`);
