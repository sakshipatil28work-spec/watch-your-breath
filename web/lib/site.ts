// Site-wide constants and copy. One place to change the store link later.

export const SITE = {
  name: "Watch Your Breath",
  tagline: "A gentle reminder to notice the breath you're already breathing.",
  /** what the bell is, for the site */
  bell: "A single soft bell, once per reminder.",
  url: "https://watchyourbreath.vercel.app",
  /**
   * Chrome Web Store listing. Not published yet: leave null and the button
   * points at the packaged build instructions instead.
   */
  chromeStoreUrl: null as string | null,
  /**
   * A downloadable packaged build (zip), once one is published somewhere.
   * Null until then: the install note then points at building from source.
   */
  packagedBuildUrl: null as string | null,
  /** Firefox Add-ons listing, once published. */
  firefoxAddonUrl: null as string | null,
  /** Where it runs. Safari would need its own build through Apple's tools; not yet. */
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
  howItWorks: "How it works",
  steps: [
    {
      number: "01",
      title: "Set it",
      body: "Choose how often you'd like to be reminded.",
    },
    {
      number: "02",
      title: "Forget it",
      body: "Go about your work, browsing, reading or creating.",
    },
    {
      number: "03",
      title: "Notice it",
      body: "A soft bell, a small drawing, a few words. Notice your breath for a moment. Then continue.",
    },
  ],
  philosophy: ["Nothing to fix.", "Nothing to achieve.", "Simply notice."],
  philosophyBody:
    "This isn't a practice. There's no technique, no timer, no score. The breath is already here. The reminder only points at it, then gets out of the way.",
  about: "Watch Your Breath is a small reminder to notice something that is already happening.",
} as const;
