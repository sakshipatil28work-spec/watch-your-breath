// Site-wide constants and copy. One place to change the store link later.

export const SITE = {
  name: "Watch Your Breath",
  tagline: "A gentle reminder to notice the breath that’s already happening.",
  /** what the bell is, for the site */
  bell: "A single soft bell, once per reminder.",
  url: "https://watchyourbreath.vercel.app",
  /**
   * Chrome Web Store listing. Not published yet: leave null and the button
   * points at the packaged build instructions instead.
   */
  chromeStoreUrl: null as string | null,
  /**
   * The packaged builds, served by the site itself until the store listings
   * exist. Copied from extension/ by `npm run sync-downloads`.
   */
  downloads: {
    chrome: "/downloads/watch-your-breath-chrome.zip",
    firefox: "/downloads/watch-your-breath-firefox.zip",
  },
  /** Firefox Add-ons listing, once published. */
  firefoxAddonUrl: null as string | null,
  /** Where it runs. Safari would need its own build through Apple’s tools; not yet. */
  browsers: "Works in Chrome, Edge, Brave, Opera, Arc, Vivaldi and Firefox.",
} as const;

export const COPY = {
  phrase: "Watch your breath.",
  moment: "Just a moment.",
  /** the primary button, by the browser the visitor is in */
  addTo: {
    chrome: "Add to Chrome",
    edge: "Add to Edge",
    firefox: "Add to Firefox",
    other: "Get the extension",
  },
  philosophy: ["Nothing to fix.", "Nothing to achieve.", "Simply notice."],
  philosophyBody:
    "This isn’t a practice. There’s no technique, no timer, no score. The breath is already here. The reminder only points at it, then gets out of the way.",
  about: "Watch Your Breath is a small reminder to notice something that is already happening.",
} as const;
