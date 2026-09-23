#!/usr/bin/env bash
# Gets the Apple project ready to open in Xcode. Runs on a Mac (it needs
# afconvert, which ships with macOS, and XcodeGen); CI runs it too.
#
#   apple/scripts/prepare.sh
#   open apple/WatchYourBreath.xcodeproj
#
# 1. builds the web extension for Safari        → extension/dist-safari/
# 2. exports the twelve reminders               → apple/Generated/reminders.json
# 3. converts the bell for notifications        → apple/Generated/reminder-bell.caf
#    (a notification's sound must be CAF, AIFF or WAV, under 30 seconds)
# 4. generates the Xcode project from project.yml → apple/WatchYourBreath.xcodeproj
set -euo pipefail

repo="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$repo"

[ -d node_modules ] || npm ci
npm run build:safari -w extension
node apple/scripts/export-reminders.mjs

mkdir -p apple/Generated
afconvert -f caff -d LEI16 extension/assets/audio/reminder-bell.mp3 apple/Generated/reminder-bell.caf
afinfo apple/Generated/reminder-bell.caf | grep -E "duration|format" || true

if ! command -v xcodegen >/dev/null; then
  echo "XcodeGen is missing. Install it with: brew install xcodegen" >&2
  exit 1
fi
xcodegen generate --spec apple/project.yml
echo "Ready: open apple/WatchYourBreath.xcodeproj"
