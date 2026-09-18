# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Two apps in one repo, per the brief:
- `/extension` — Chrome extension, Manifest V3, TypeScript, chrome.alarms + chrome.notifications + chrome.storage.local. No bundler-heavy setup; esbuild for TS → JS. Packaged as a zip for the Chrome Web Store.
- `/web` — Next.js (App Router), TypeScript, Tailwind CSS. Deployed on Vercel.
No backend, no auth, no database.

## Users

Meditators — people who already have a sitting practice and know what it is to rest attention on the breath — who spend long stretches of the day in a browser and lose that groundedness while working, reading, or scrolling. The job: be reminded, lightly and without instruction, to come back to the breath for a moment, then continue.

## Product Purpose

Watch Your Breath is a browser extension that periodically sends a small desktop notification reading "Watch your breath. / Just a moment." It creates brief moments of awareness during normal screen use. Success is the user thinking "Oh. My breath." and continuing with their day. The product should disappear after doing its job.

## Positioning

It is a reminder, not a practice. It never teaches breathing, never times an inhale or exhale, never counts, never scores, never tracks, never streaks. Every meditation and breathwork app in the category adds instruction and measurement; this product's mechanism is the refusal to add anything. "Nothing to fix. Nothing to achieve. Just notice."

## Operating Context

- Runs in the background via chrome.alarms; works with the popup closed and across browser restarts.
- Interrupts nothing: a native desktop notification only, never an in-page overlay, never a sound that alarms.
- Popup opens from the toolbar icon; settings are a second view inside the same popup; a one-screen first-run page opens on install.
- Quiet hours (default 10:00 PM – 7:00 AM) suppress reminders.
- Optional randomization jitters the reminder inside a window around the chosen interval so it feels organic.

## Capabilities and Constraints

Confirmed:
- A library of twelve reminders (copy + supporting copy + optional reflection + one illustration each, designed together, never recombined), shown in a shuffled cycle: every reminder before any repeats, never the same twice in a row. Illustrations are the author's twelve-panel sheet, cut per panel.
- The reminder arrives as a small illustrated card (illustration left, copy right, close at bottom right), in a Compact or Expanded layout (Expanded adds a chevron that reveals the reflection). The author's bell recording plays once per reminder; Sound on/off with a preview.
- Reminders ON/OFF; frequency: 30 min / 1 hour / 2 hours / custom minutes.
- Quiet hours start/end.
- Notification layout: Compact (default) / Expanded. Sound: on (default) / off.
- Randomize reminders toggle.
- Notification permission denied state with plain explanation and retry.
- Preferences persist in chrome.storage.local; no account.
- Landing page: hero, How it works (Set it / Forget it / Notice it), Philosophy, CTA. The primary button is named for the visitor's browser ("Add to Chrome", "Add to Edge", "Add to Firefox", else "Get the extension") and points to a placeholder constant until the store listings exist.

Hard rules (product law, not style):
1. Never tell the user how to breathe. 2. Never score breathing. 3. Never track breathing quality. 4. No streaks. 5. No achievements. 6. Nothing competitive. 7. Interactions extremely short. 8. Everything dismissable immediately. 9. No account. 10. Reminders can be turned off at any time.

Terminology: "reminder" (never "session", "exercise", "practice", "streak"). Primary message: "Watch your breath." Secondary: "Just a moment." Supporting: "Simply notice." / "Nothing to change." / "Pause. Notice. Continue." / "Come back to the breath." / "Be here for a moment." / "Nothing to achieve."

Banned copy: "Improve your breathing", "Reduce stress in 60 seconds", "Optimize", "Become more productive", "Complete your session".

Undecided: Chrome Web Store URL (not yet published). Firefox support (out of MVP scope).

## Brand Commitments

Name: Watch Your Breath. Tagline: "A gentle reminder to notice the breath you're already breathing."

Binding visual constraints volunteered by the user (recorded, not expanded here):
- The illustrations: the author's own hand-drawn sticker (web/public/illustrations/hero.png) and their twelve-panel reminder sheet (illustrations/source/reminders-sheet.png). Binding instruction (2026-09-17): use only the author's illustrations; no generated drawings. Every raster in the product is a crop of one of these two files.
- The bell: the author's recording, extension/assets/audio/reminder-bell.mp3. Use exactly this file; play once per reminder, never loop.
- Palette (author's values, 2026-09-17 update): warm sand #F3E8D2 background, deep teal-charcoal #243C3A primary ink, muted sage #87947A secondary, burnt clay #A85F43 accent, dull ochre #C0954A highlight. Colour stays sparing; the drawings are the author's own with their own accents. No gradients, no neon.
- Type direction: expressive serif / hand-lettered display (Eczar, Fraunces, Cormorant Garamond, DM Serif Display named as candidates) paired with a clean sans for UI (Mukta, Inter, Manrope named). Graceful fallbacks required.
- Governing metaphor: BREATH = FLOW. Air moving through space. No literal lungs as the dominant form; no cliché lotus everywhere.
- Personality: calm, human, quiet, slightly spiritual, playful, artistic, warm, tactile, minimal; Indian-inspired without stereotype. Anti-references: corporate wellness, generic meditation apps, SaaS dashboards, glassmorphism, gamification, clinical health visuals.
- Motion: slow, breathing-paced expansion → outward → curl → settle → return; never a spinner, bounce, or pulse; honors prefers-reduced-motion.

## Evidence on Hand

- One reference image (user-supplied in chat; not stored in repo). No logo files, no screenshots, no testimonials, no user counts, no press. Future work must not fabricate any of these.

## Product Principles

1. Do not overbuild. The magic is simplicity; every added control is a cost.
2. Remind, never instruct. The product points at the breath and steps away.
3. Interrupt nothing. A notification, not an overlay; a tap on the shoulder, not a task.
4. The user is already a meditator. Speak as to someone who knows, not someone being taught.
5. Disappear after doing the job.

## Accessibility & Inclusion

WCAG-aligned: keyboard navigation, visible focus, semantic HTML, labelled controls, ≥4.5:1 text contrast on cream, reduced-motion support, no information carried by colour alone. Popup must be a proper compact layout, not a shrunken desktop page.
