# Watch Your Breath

A gentle reminder to notice the breath that's already happening.

A browser extension (Manifest V3; Chrome, Edge, Brave, Opera, Arc, Vivaldi and Firefox) that, at an interval you choose, rings a soft bell and shows a small illustrated card with a different short reminder each time ("Watch your breath. / Just a moment.", "Nothing to change. / Just notice.", ...), and a one-page site that introduces it. No account, no backend, no tracking. It never tells you how to breathe.

```
watch-your-breath/
├── illustrations/   the asset pipeline: cuts every image from one hand-drawn illustration
├── extension/       Browser extension, Manifest V3, TypeScript, esbuild
└── web/             Next.js + Tailwind landing page, deployable on Vercel
```

## First-time setup

Requires Node 20+.

```bash
npm install
```

Two hand-drawn sources, both supplied by the author, feed every image:

- `web/public/illustrations/hero.png`: the sticker. `npm run crop` cuts the emblem, toolbar icons, favicon and flow line from it (`illustrations/scripts/crop.mjs`).
- `illustrations/source/reminders-sheet.png`: the twelve-panel reminder sheet. `node illustrations/scripts/reminders.mjs` cuts one illustration per reminder into `extension/assets/illustrations/` and `web/public/illustrations/reminders/`.

Crop boxes live at the top of each script; re-run after any change to a source image. Every cut carries its provenance as a PNG text chunk.

The bell is the author's recording at `extension/assets/audio/reminder-bell.mp3` (a copy in `web/public/audio/` for the site's preview).

## Extension

```bash
npm run build:extension      # → extension/dist
npm run package:extension    # → extension/watch-your-breath-<version>.zip
```

Load it in Chrome (or Edge, Brave, Opera, Arc, Vivaldi): open `chrome://extensions`, switch on **Developer mode**, click **Load unpacked**, choose `extension/dist`. The first-run screen opens on install.

For Firefox, build the Firefox flavour and load it as a temporary add-on:

```bash
npm run build:firefox -w extension
```

Open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on**, choose `extension/dist-firefox/manifest.json`. (Firefox 142 or newer.)

Store packages, both from the same source: `npm run package:all -w extension` writes `extension/watch-your-breath-<version>.zip` (Chrome Web Store, Edge Add-ons) and `extension/watch-your-breath-<version>-firefox.zip` (Firefox Add-ons). The Firefox build passes `addons-linter` with no errors.

How the two differ, all in `extension/src/lib/ext.ts` and `extension/scripts/build.mjs`: the code calls the extension API through `ext` (`browser` where it exists, promise-based; otherwise `chrome`). Firefox gets an event page instead of a service worker, no `offscreen` permission (its background page plays the bell itself), an add-on id, and no `focused: false` on the card window (Firefox cannot open a window unfocused, so the card opens and focus is handed straight back). Safari is not covered: it needs its own wrapper built with Apple's tools on a Mac.

Preview the popup in a normal browser tab (chrome.* APIs are stubbed):

```bash
node extension/scripts/preview.mjs
# http://localhost:4180/popup.html?state=on|off|quiet|active|custom|denied
# http://localhost:4180/onboarding.html
# http://localhost:4180/card.html?id=nothing-to-change&layout=expanded&preview=1
```

How it works: `chrome.alarms` schedules one-shot alarms. On each one the service worker picks the next reminder (a shuffled cycle: every reminder before any repeats, never the same twice in a row), opens the card as a small popup window at the bottom right of the browser (when the browser is the app in front; otherwise the reminder goes out as a system notification, since a new unfocused browser window would sit behind the app in use), and schedules the next alarm. The card plays the bell once, leaves on its own after a few seconds (or the moment it is closed), and in the Expanded layout offers a chevron that reveals a short reflection. If a window cannot be opened, the same reminder goes out as a system notification with the illustration as its icon and the bell plays through an offscreen document. Preferences persist in the browser's local extension storage. Quiet hours push a reminder to after they end. "Randomize" stretches or shortens each interval by up to 25 %. Everything lives in `extension/src`:

- `background/index.ts` scheduling, choosing, showing
- `lib/reminders.ts` the twelve reminders (copy + illustration, designed together)
- `lib/selection.ts` the cycle logic; `lib/schedule.ts` timing (quiet hours, randomization); `lib/audio.ts` `playReminderSound()`
- `lib/settings.ts` the settings schema and storage
- `card/` the reminder card; `offscreen/` the bell fallback
- `popup/` the popup (home and settings) and the first-run page

## Web

```bash
npm run dev:web      # http://localhost:3000
npm run build:web
```

Deploy on Vercel with **Root Directory** set to `web` (Framework: Next.js; no other settings needed, the site has no workspace dependencies). The primary button names the visitor's browser (Add to Chrome / Edge / Firefox, or Get the extension) and reads `chromeStoreUrl` / `firefoxAddonUrl` in `web/lib/site.ts`; until a listing exists it leads to the install card, which offers that browser's packaged zip from `web/public/downloads/` (refreshed by `npm run package:extension` at the root, which builds both zips and copies them in) with the load-unpacked steps.

## Design

Warm sand `#F3E8D2` ground, deep teal-charcoal `#243C3A` for the drawings and all text, burnt clay `#A85F43` as the one action colour (deepened to `#8C4D36` on button fills for contrast), dull ochre `#C0954A` for the step numerals and the bell when sound is on, muted sage `#87947A` for quiet hours only. Eczar for display, Mukta for interface text, Cormorant Garamond italic for "Just a moment." Fonts are self-hosted in the extension (`extension/fonts`, OFL) and loaded through `next/font` on the web. Motion is one slow nine-second breath on the drawing, disabled under `prefers-reduced-motion`.

Product rules the code keeps: no breathing instructions, no counts, no scores, no streaks, no achievements, dismissable instantly, reminders can be turned off at any time.
