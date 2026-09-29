// One handle for the extension API, whichever browser we are in.
// Firefox exposes `browser` (promise-based); Chrome exposes `chrome`, which
// returns promises in Manifest V3, and from Chrome 148 offers `browser` too.
// Everything else in the extension goes through `ext` so the code reads the
// same in both, and only this file knows the difference.

const g = globalThis as { browser?: typeof chrome; chrome?: typeof chrome };

export const ext: typeof chrome = g.browser ?? g.chrome!;

/** Firefox is the only browser that implements runtime.getBrowserInfo. */
export const isFirefox: boolean = typeof (ext.runtime as { getBrowserInfo?: unknown }).getBrowserInfo === "function";

/**
 * macOS hands Chrome's notifications to its own notification centre, which
 * ignores the large image (deprecated since Chrome 59), the app icon mask and
 * button icons. We send it the plain form instead of options it never uses.
 * Cached: the answer cannot change while the browser is running.
 */
let osName: string | null = null;
export async function platformOs(): Promise<string> {
  if (osName === null) {
    try {
      osName = (await ext.runtime.getPlatformInfo()).os;
    } catch {
      osName = "unknown";
    }
  }
  return osName;
}

export async function isMac(): Promise<boolean> {
  return (await platformOs()) === "mac";
}
