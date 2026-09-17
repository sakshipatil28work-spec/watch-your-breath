// Zips dist/ into watch-your-breath-<version>.zip for the Chrome Web Store.
import { zipSync } from "fflate";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
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
const outFile = join(root, `watch-your-breath-${version}.zip`);
writeFileSync(outFile, zip);
console.log(`packaged ${Object.keys(files).length} files into ${outFile}`);
