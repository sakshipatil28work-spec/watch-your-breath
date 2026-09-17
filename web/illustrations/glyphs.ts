// Small interface glyphs (settings, back, chevron, silent). Mirror of illustrations/src/glyphs.ts
// kept here so web/ deploys on its own (no workspace dependency). These are UI
// controls, not illustrations: the artwork itself is the hand-drawn hero image
// in web/public/illustrations/hero.png and the crops made from it.

const STROKE = `fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"`;

/** Hand-drawn gear for the settings button. */
export function gearSvg(): string {
  const teeth: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + 0.12;
    const r0 = 7.2;
    const r1 = 10.4 + (i % 2) * 0.5;
    teeth.push(
      `M${(12 + Math.cos(a) * r0).toFixed(1)} ${(12 + Math.sin(a) * r0).toFixed(1)} L${(12 + Math.cos(a) * r1).toFixed(1)} ${(12 + Math.sin(a) * r1).toFixed(1)}`
    );
  }
  return `<svg class="glyph glyph-gear" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g ${STROKE} stroke-width="1.8">
      <path d="M12 4.9 C15.7 4.7 19.2 8 19.1 11.9 C19 15.8 15.9 19.2 12.1 19.1 C8.2 19 4.9 15.7 5 12 C5.1 8.2 8.3 5.1 12 4.9 Z"/>
      <path d="M12 9.6 C13.4 9.5 14.5 10.7 14.4 12 C14.3 13.4 13.3 14.4 12 14.4 C10.6 14.4 9.6 13.3 9.6 12 C9.6 10.7 10.7 9.7 12 9.6 Z"/>
      <path d="${teeth.join(" ")}"/>
    </g>
  </svg>`;
}

/** Small hand-drawn arrow, pointing left. */
export function arrowLeftSvg(): string {
  return `<svg class="glyph glyph-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g ${STROKE} stroke-width="1.8"><path d="M19 12.2 C14.5 11.8 10 12.1 5.5 12"/><path d="M10.2 7.4 C8.6 9 7 10.6 5.4 12 C7 13.5 8.5 15.1 10 16.8"/></g>
  </svg>`;
}

/** Ink chevron used as the select's affordance (as a data URI background). */
export const chevronDataUri =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.2 6.2 C4.8 7.8 6.4 9.4 8 11 C9.6 9.3 11.2 7.7 12.8 6.1" fill="none" stroke="#1F3B3E" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  );

/** Small "no sound" mark for the silent style. */
export function silentSvg(): string {
  return `<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g ${STROKE} stroke-width="1.8"><path d="M4 9.6 C5.4 9.5 6.8 9.5 8.2 9.5 C10 8 11.8 6.4 13.6 4.9 C13.7 9.6 13.7 14.3 13.6 19 C11.8 17.5 10 16 8.2 14.5 C6.8 14.5 5.4 14.5 4 14.4 Z"/><path d="M17 9.5 C18.6 11.1 20.2 12.7 21.8 14.3"/><path d="M21.8 9.6 C20.2 11.2 18.6 12.8 17 14.4"/></g>
  </svg>`;
}

/** A small hand-drawn bell, for the sound toggle. */
export function bellSvg(): string {
  return `<svg class="glyph glyph-bell" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g ${STROKE} stroke-width="1.8">
      <path d="M12 3.2 C12.1 4 12 4.8 12 5.6"/>
      <path d="M6.6 16.8 C6.9 13.9 6.4 10.6 7.9 8.3 C9.6 5.6 14.3 5.5 16.1 8.2 C17.6 10.5 17.1 13.9 17.5 16.8 C18.2 17.4 19 18 19.4 18.8 C14.5 19 9.6 19 4.6 18.8 C5.1 18 5.9 17.4 6.6 16.8 Z"/>
      <path d="M10.2 20.6 C10.8 21.7 13.2 21.7 13.8 20.6"/>
    </g>
  </svg>`;
}

/** A small play triangle, drawn loosely. */
export function playSvg(): string {
  return `<svg class="glyph glyph-play" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7.4 5.2 C11.2 7.4 15 9.6 18.6 12 C15 14.4 11.2 16.6 7.4 18.8 C7.2 14.3 7.2 9.7 7.4 5.2 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  </svg>`;
}

/** A circular arrow, drawn loosely: "send one now". */
export function refreshSvg(): string {
  return `<svg class="glyph glyph-refresh" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g ${STROKE} stroke-width="1.8">
      <path d="M18.6 12.2 C18.4 15.8 15.6 18.6 12.1 18.6 C8.4 18.6 5.5 15.6 5.4 12 C5.3 8.4 8.3 5.5 11.9 5.4 C14.2 5.3 16.2 6.5 17.4 8.2"/>
      <path d="M17.8 4.6 C17.7 5.9 17.6 7.2 17.5 8.5 C16.2 8.5 14.9 8.4 13.6 8.3"/>
    </g>
  </svg>`;
}
