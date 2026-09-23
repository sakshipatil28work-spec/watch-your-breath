// Writes the reminder library (extension/src/lib/reminders.ts) as JSON for the
// Apple app, so the twelve reminders stay defined in one place.
//   node apple/scripts/export-reminders.mjs  → apple/Generated/reminders.json
import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const out = join(repo, "apple", "Generated", "reminders.json");

// reminders.ts reaches for the browser's extension API through ext.ts; Node has none.
const stubExt = {
  name: "stub-ext",
  setup(b) {
    b.onResolve({ filter: /\/ext\.ts$/ }, () => ({ path: "ext", namespace: "stub" }));
    b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export const ext = {};", loader: "js" }));
  },
};

const result = await build({
  stdin: {
    contents: `export { REMINDERS } from "./src/lib/reminders.ts";`,
    resolveDir: join(repo, "extension"),
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
  plugins: [stubExt],
  logLevel: "silent",
});
const { REMINDERS } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(REMINDERS, null, 2) + "\n");
console.log(`wrote ${REMINDERS.length} reminders → ${out}`);
