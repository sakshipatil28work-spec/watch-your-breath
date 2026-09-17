// The popup's drawing is the hand-drawn sticker itself (icons/sticker.png,
// keyed to ink-on-transparent by illustrations/scripts/crop.mjs). Glyphs are UI.
export { gearSvg, arrowLeftSvg, silentSvg, bellSvg, playSvg, refreshSvg, chevronDataUri } from "@wyb/illustrations";

/** The sticker as an image, with two settling rings (around the drawn ring) for the just-reminded state. */
export function emblemHtml(opts: { label?: string; rings?: boolean } = {}): string {
  const alt = opts.label ?? "";
  const rings = opts.rings ? `<span class="emblem-ring emblem-ring-a" aria-hidden="true"></span><span class="emblem-ring emblem-ring-b" aria-hidden="true"></span>` : "";
  return `${rings}<img class="emblem-img" src="icons/sticker.png" alt="${alt}" width="1000" height="530" decoding="async" />`;
}
