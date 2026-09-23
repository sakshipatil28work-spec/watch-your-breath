# Watch Your Breath for Apple devices

One app for iPhone, iPad and Mac, carrying the Safari extension. It is the same product as the browser extension: the twelve reminders with their drawings, the bell, the intervals, quiet hours, randomize, compact or expanded, and the same rules (no breathing instructions, no counts, no streaks).

```
apple/
├── project.yml        XcodeGen spec: the app and the Safari extension, for iOS and macOS
├── Shared/            used by both the app and the extension
│   ├── Settings.swift     the extension's settings schema, stored in the App Group
│   ├── Schedule.swift     timing and choosing, ported from schedule.ts and selection.ts
│   ├── Planner.swift      the run of reminders handed to the system
│   ├── ReminderCenter.swift  hands them over as local notifications
│   └── Reminder.swift     reads the reminder library
├── App/               SwiftUI: first run, home, settings, a tapped reminder
├── Extension/         SafariWebExtensionHandler.swift, the popup's link to the app
├── Resources/Fonts/   Eczar, Mukta, Cormorant Garamond (the extension's own, as TTF)
├── Tests/             the scheduling logic, checked against the extension's rules
└── scripts/           prepare.sh (on a Mac), plus the asset scripts
```

## How it works on Apple devices

Browsers wake the extension on an alarm; it shows one reminder, then sets the next alarm. iOS never runs an app's code at a set time, so the app plans ahead: it chooses, words and times a run of reminders (up to 60, at most four days out), and hands them to the system as local notifications. They arrive whether the app is open or not, with the drawing, the words and the bell. The run is topped up when the app opens, when iOS gives it a background refresh, and when the Safari extension wakes. A reminder already shown is cleared from Notification Center the next time the run is topped up.

If the app is left closed for a long time, the run can end: at 30-minute reminders, 60 of them last about two days, with quiet hours skipped. Opening the app, or iOS's background refresh, starts a fresh run.

Safari has no notifications API, so on Apple devices the Safari extension does not remind. It is the same popup as in Chrome, and its settings are the app's: the popup's background (`extension/src/background/safari.ts`) passes each change to the app through native messaging, and the app replans and answers with the next reminder time.

The reminder library stays in one place, `extension/src/lib/reminders.ts`. `prepare.sh` exports it as JSON for the app.

Notifications reach an Apple Watch paired with the iPhone automatically, with a tap instead of the bell.

## Building without a Mac

Every push that touches `apple/` or `extension/` runs the **Apple** workflow (`.github/workflows/apple.yml`) on GitHub's Mac runners. It:

1. builds the Safari extension and prepares the project,
2. runs the scheduling tests,
3. builds the app for the iPhone simulator,
4. opens it in the simulator and photographs four screens (first run, home, settings, a reminder).

The photographs are under **Actions → Apple → the run → Artifacts → screenshots**. You can also start a run by hand with **Run workflow**. GitHub gives private repositories a monthly allowance of Mac minutes; one run takes about 10–15.

The workflow builds the app unsigned. Installing it on a real iPhone, or sending it to the App Store, needs signing (see below). Signing can also run in GitHub Actions, using your certificates as repository secrets, once you have them.

## Building on a Mac

Requires Xcode 16 and Node 20+.

```bash
brew install xcodegen
npm install
bash apple/scripts/prepare.sh
open apple/WatchYourBreath.xcodeproj
```

Choose the **WatchYourBreath-iOS** or **WatchYourBreath-macOS** scheme and run. To test the Safari extension on a Mac, enable **Settings → Developer → Allow unsigned extensions** in Safari, then switch Watch Your Breath on under **Settings → Extensions**. On iPhone: **Settings → Apps → Safari → Extensions**.

Re-run `prepare.sh` after changing anything in `extension/` or `project.yml`. The Xcode project is generated, not committed.

## Publishing

1. Join the Apple Developer Program ($99 a year).
2. Put your team id in `project.yml` (`DEVELOPMENT_TEAM`).
3. In the developer portal, register the App Group `group.dev.sakshipatil.WatchYourBreath` and the two bundle ids, `dev.sakshipatil.WatchYourBreath` and `dev.sakshipatil.WatchYourBreath.Extension`. Automatic signing in Xcode does this for you.
4. In App Store Connect, create one app for both iOS and macOS (a universal purchase), then archive and upload each platform from Xcode.
5. The privacy label is "Data Not Collected": nothing leaves the device.

## Regenerating assets (any computer)

The app icon, the glyphs and the fonts are committed. Re-make them after the drawings change:

```bash
node apple/scripts/app-icon.mjs   # the ring on sand → App/Assets.xcassets/AppIcon.appiconset
node apple/scripts/assets.mjs     # glyphs, sticker, ring → App/Assets.xcassets
```

The fonts were converted from `extension/fonts` (WOFF2 → TTF; Eczar instanced at 600 and 700) with fontTools. Their licences are in `Resources/Fonts/LICENSES.md`.
