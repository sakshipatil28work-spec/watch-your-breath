// Cuts the Apple app icon from the ring crop (extension/icons/ring.png, itself
// cut from the author's hero drawing by illustrations/scripts/crop.mjs).
//   node apple/scripts/app-icon.mjs  → apple/App/Assets.xcassets/AppIcon.appiconset/
//
// iOS: the ring on a full square of warm sand (the system rounds the corners).
// macOS: the same on a sand rounded square inside Apple's 1024 grid (824 wide,
// 100px margin), because a Mac icon draws its own shape.
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const RING = join(repo, "extension", "icons", "ring.png");
const OUT = join(repo, "apple", "App", "Assets.xcassets", "AppIcon.appiconset");
const SAND = "#F3E8D2";
const PAPER = "#F9F2E4";
mkdirSync(OUT, { recursive: true });

const ring = (size) => sharp(RING).resize(size, size, { kernel: "lanczos3" }).png().toBuffer();

// iOS: opaque 1024 square, ring at 68 %
const ios = await sharp({ create: { width: 1024, height: 1024, channels: 3, background: SAND } })
  .composite([{ input: await ring(696), gravity: "centre" }])
  .flatten({ background: SAND })
  .png()
  .toBuffer();
writeFileSync(join(OUT, "ios-1024.png"), ios);

// macOS: sand rounded square with a paper edge, ring at 60 % of the square
const mac = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([
    {
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
          <rect x="96" y="96" width="832" height="832" rx="190" fill="${PAPER}"/>
          <rect x="100" y="100" width="824" height="824" rx="186" fill="${SAND}"/>
        </svg>`
      ),
    },
    { input: await ring(500), gravity: "centre" },
  ])
  .png()
  .toBuffer();

const macSizes = [16, 32, 128, 256, 512];
const images = [{ filename: "ios-1024.png", idiom: "universal", platform: "ios", size: "1024x1024" }];
for (const pt of macSizes) {
  for (const scale of [1, 2]) {
    const px = pt * scale;
    const filename = `mac-${px}.png`;
    writeFileSync(join(OUT, filename), await sharp(mac).resize(px, px, { kernel: "lanczos3" }).png().toBuffer());
    images.push({ filename, idiom: "mac", scale: `${scale}x`, size: `${pt}x${pt}` });
  }
}
writeFileSync(join(OUT, "Contents.json"), JSON.stringify({ images, info: { author: "xcode", version: 1 } }, null, 2) + "\n");
writeFileSync(
  join(dirname(OUT), "Contents.json"),
  JSON.stringify({ info: { author: "xcode", version: 1 } }, null, 2) + "\n"
);
console.log(`wrote the app icon → ${OUT}`);
