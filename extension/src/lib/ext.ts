// One handle for the extension API, whichever browser we are in.
// Firefox exposes `browser` (promise-based); Chrome exposes `chrome`, which
// returns promises in Manifest V3, and from Chrome 148 offers `browser` too.
// Everything else in the extension goes through `ext` so the code reads the
// same in both, and only this file knows the difference.

const g = globalThis as { browser?: typeof chrome; chrome?: typeof chrome };

export const ext: typeof chrome = g.browser ?? g.chrome!;

/** Firefox is the only browser that implements runtime.getBrowserInfo. */
export const isFirefox: boolean = typeof (ext.runtime as { getBrowserInfo?: unknown }).getBrowserInfo === "function";

/** Safari's user agent says Safari and none of the others (Chrome's says both). */
export const isSafari: boolean =
  typeof navigator !== "undefined" &&
  /Safari\//.test(navigator.userAgent) &&
  !/Chrom(e|ium)|Edg|OPR|Firefox/.test(navigator.userAgent);
