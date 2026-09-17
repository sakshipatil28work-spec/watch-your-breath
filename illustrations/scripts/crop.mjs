// Cuts every asset the product needs from the one hand-drawn illustration:
//   web/public/illustrations/hero.png  (source, supplied by the author)
// →  web/public/illustrations/sticker.png  the whole drawing, ink on transparent (1000 wide)
//    web/public/illustrations/sticker-large.png  same at full size, for the hero
//    extension/icons/sticker.png            same, for the popup and first run
//    web/public/illustrations/ring.png      the ring alone, masked to a circle (also extension/icons)
//    web/public/illustrations/flow.png      the sweep of wind lines to the right of the ring
//    extension/icons/icon{16,32,48,128}.png toolbar icon, tight crop of the ring
//    extension/icons/notification.png       the whole drawing on a cream card
//    web/public/icon.png                    favicon (32)
//    web/public/illustrations/{notification,icon-*}.png  copies for the site
//
// Run: node illustrations/scripts/crop.mjs
// Tune the boxes below if the source image changes.

import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { crc32 } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = join(repo, "web", "public", "illustrations", "hero.png");
const WEB = join(repo, "web", "public", "illustrations");
const ICONS = join(repo, "extension", "icons");

const INK = { r: 0x1f, g: 0x3b, b: 0x3e };
const CREAM = "#F4EBDD";

// Geometry in source pixels (the supplied image is 1312×1199).
// The ring: centre and radius, measured off the drawing.
const RING = { cx: 371, cy: 595, r: 172 };
// The ring crop keeps a margin so the line is not clipped, and is masked to a
// circle so the lettering that overlaps the ring's lower left is cut away.
const RING_PAD = 22;

if (!existsSync(SRC)) {
  console.error(`Missing ${SRC}\nSave the hand-drawn illustration there (PNG), then run this again.`);
  process.exit(1);
}

mkdirSync(WEB, { recursive: true });
mkdirSync(ICONS, { recursive: true });

/** Turn black-on-white line art into ink-on-transparent, recoloured to the brand ink. */
async function keyToInk(pipeline) {
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255; // 0 ink … 1 paper
    // paper is not pure white; treat anything above ~0.9 as background
    const alpha = Math.max(0, Math.min(1, (0.92 - lum) / 0.62));
    out[i * 4] = INK.r;
    out[i * 4 + 1] = INK.g;
    out[i * 4 + 2] = INK.b;
    out[i * 4 + 3] = Math.round(alpha * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}

// Every cut carries its provenance as a PNG tEXt chunk (keyword impeccable:prompt),
// so a re-run never ships a raster without its origin.
const DERIVED =
  "Derived from web/public/illustrations/hero.png (the hand-drawn sticker supplied by the author) by illustrations/scripts/crop.mjs: luminance keyed to ink #1F3B3E on transparent";
function withProvenance(png, note) {
  const keyword = Buffer.from("impeccable:prompt\0", "latin1");
  const text = Buffer.from(`${DERIVED}; ${note}`, "latin1");
  const data = Buffer.concat([keyword, text]);
  const type = Buffer.from("tEXt", "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([type, data])) >>> 0);
  const chunk = Buffer.concat([len, type, data, crc]);
  // insert right after IHDR (8-byte signature + 25-byte IHDR chunk)
  const at = 8 + 25;
  // drop any existing provenance chunk first
  let out = png;
  let o = 8;
  while (o < out.length) {
    const l = out.readUInt32BE(o);
    const t = out.toString("ascii", o + 4, o + 8);
    if (t === "tEXt" && out.toString("latin1", o + 8, o + 8 + 18) === "impeccable:prompt\0") {
      out = Buffer.concat([out.subarray(0, o), out.subarray(o + 12 + l)]);
      continue;
    }
    o += 12 + l;
  }
  return Buffer.concat([out.subarray(0, at), chunk, out.subarray(at)]);
}
async function save(file, pipeline, note) {
  const buf = await pipeline.png().toBuffer();
  writeFileSync(file, withProvenance(buf, note));
}

const meta = await sharp(SRC).metadata();
console.log(`source ${meta.width}×${meta.height}`);

// sticker: the whole drawing, ink on transparent (popup, first run, web)
const sticker = await keyToInk(sharp(SRC));
// trim the empty paper around the drawing, keep a small margin
const stickerBuf = await sharp(await sticker.png().toBuffer())
  .trim({ threshold: 8 })
  .extend({ top: 24, bottom: 24, left: 24, right: 24, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const stickerMeta = await sharp(stickerBuf).metadata();
console.log(`sticker ${stickerMeta.width}×${stickerMeta.height}`);
const STICKER = "whole drawing trimmed to its ink bounds + 24px";
await save(join(WEB, "sticker.png"), sharp(stickerBuf).resize({ width: 1000 }), `${STICKER}, resized to 1000px wide`);
await save(join(WEB, "sticker-large.png"), sharp(stickerBuf), `${STICKER}, full size`);
await save(join(ICONS, "sticker.png"), sharp(stickerBuf).resize({ width: 1000 }), `${STICKER}, resized to 1000px wide`);

// ring: the emblem alone, masked to a circle (icons, and the site's small emblem)
const side = (RING.r + RING_PAD) * 2;
const ringBox = { left: RING.cx - RING.r - RING_PAD, top: RING.cy - RING.r - RING_PAD, width: side, height: side };
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${side}" height="${side}"><circle cx="${side / 2}" cy="${side / 2}" r="${RING.r + RING_PAD - 2}" fill="#fff"/></svg>`
);
const ringKeyed = await (await keyToInk(sharp(SRC).extract(ringBox))).png().toBuffer();
const iconBuf = await sharp(ringKeyed)
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();
const RINGNOTE = `ring crop at centre (${RING.cx},${RING.cy}) r${RING.r} + ${RING_PAD}px, masked to a circle`;
await save(join(WEB, "ring.png"), sharp(iconBuf), RINGNOTE);
await save(join(ICONS, "ring.png"), sharp(iconBuf), RINGNOTE);

// flow: the sweep of wind lines and curls to the right of the ring, without the lettering
const FLOW = { left: 680, top: 440, width: 490, height: 198 };
const flowKeyed = await (await keyToInk(sharp(SRC).extract(FLOW))).png().toBuffer();
await save(join(WEB, "flow.png"), sharp(flowKeyed), `sweep crop box left ${FLOW.left} top ${FLOW.top} width ${FLOW.width} height ${FLOW.height}`);

// toolbar icons sit on a cream sticker disc so they read on light and dark toolbars
const disc = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${side}" height="${side}"><circle cx="${side / 2}" cy="${side / 2}" r="${side / 2 - 1}" fill="${CREAM}"/></svg>`
);
const iconOnDisc = await sharp(disc).composite([{ input: iconBuf }]).png().toBuffer();
for (const size of [16, 32, 48, 128]) {
  const note = `${RINGNOTE} on a cream ${CREAM} disc, resized to ${size}×${size} (lanczos3)`;
  const px = sharp(iconOnDisc).resize(size, size, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    kernel: "lanczos3",
  });
  await save(join(ICONS, `icon${size}.png`), px.clone(), note);
  await save(join(WEB, `icon-${size}.png`), px.clone(), note);
}
await save(join(repo, "web", "public", "icon.png"), sharp(iconOnDisc).resize(32, 32), `${RINGNOTE} on a cream disc, resized to 32×32 (favicon)`);

// notification image: the whole drawing on a cream card
const card = sharp({ create: { width: 720, height: 480, channels: 4, background: CREAM } }).composite([
  {
    input: await sharp(stickerBuf).resize(660, 440, { fit: "inside" }).png().toBuffer(),
    gravity: "centre",
  },
]);
const CARDNOTE = `whole drawing resized to fit 660×440 and centred on a 720×480 cream ${CREAM} card`;
await save(join(ICONS, "notification.png"), card.clone(), CARDNOTE);
await save(join(WEB, "notification.png"), card.clone(), CARDNOTE);

console.log("wrote sticker.png, sticker-large.png, ring.png, flow.png, icon16/32/48/128.png, notification.png, web/public/icon.png");
