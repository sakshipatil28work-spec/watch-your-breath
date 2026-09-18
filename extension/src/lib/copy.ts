// Every word the extension says, in one place.

export const COPY = {
  name: "Watch Your Breath",
  phrase: "Watch your breath.",
  moment: "Just a moment.",
  tagline: "A gentle reminder to notice the breath that’s already happening.",
  about: "Watch Your Breath is a small reminder to notice something that is already happening.",

  notification: {
    title: "Watch your breath.",
    body: "Just a moment.",
  },

  onboarding: {
    heading: "Watch your breath.",
    sub: "A small reminder to notice the breath that’s already happening.",
    frequency: "Reminder frequency",
    cta: "Start reminders",
    done: "You’re set.",
    doneSub: (interval: string) =>
      `Your first reminder comes in about ${interval}, with its own small drawing. Pin the icon to your toolbar if you’d like it close by.`,
    close: "Close this tab",
  },

  home: {
    reminders: "Reminders",
    every: "Every",
    custom: "Custom",
    minutes: "minutes",
    settings: "Settings",
    off: "Reminders are off. Switch them on when you’re ready.",
    quiet: (until: string) => `Quiet hours until ${until}. Reminders pick up after.`,
    next: (at: string) => `Next reminder around ${at}.`,
    scheduling: "Setting the next reminder…",
    active: "Just a moment.",
    customRange: "Between 5 minutes and 12 hours.",
  },

  settings: {
    title: "Settings",
    back: "Back",
    reminders: "Reminders",
    frequency: "Frequency",
    randomize: "Randomize reminders",
    randomizeHint: "Lets each reminder drift a little, so it never lands on the same predictable minute.",
    quiet: "Quiet hours",
    quietHint: "No reminders between these times.",
    start: "Start",
    end: "End",
    layout: "Notification",
    compact: "Compact",
    expanded: "Expanded",
    preview: "Send one now",
    previewHint: "Shows it right away, so you can see how one arrives.",
    previewSent: "Sent. It will close on its own.",
    sound: "Reminder sound",
    playBell: "Play bell",
    bellHint: "A single soft bell. It plays once with each reminder.",
    bellFailed: "Couldn’t play the bell. Check that your sound is on, then try again.",
    about: "About",
    version: (v: string) => `Version ${v}`,
  },

  denied: {
    body: "Chrome is set to block notifications from this extension, so reminders cannot be shown. To allow them, open Chrome’s notification settings and switch Watch Your Breath on.",
    open: "Open Chrome settings",
  },

  freq: {
    30: "30 minutes",
    60: "1 hour",
    120: "2 hours",
    custom: "Custom",
  } as Record<string, string>,
} as const;
