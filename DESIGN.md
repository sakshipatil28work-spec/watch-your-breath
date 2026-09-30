---
name: Watch Your Breath
description: A gentle reminder to notice the breath that's already happening.
colors:
  cream: "#f3e8d2"
  paper: "#f9f2e4"
  ink: "#243c3a"
  ink-soft: "rgba(36, 60, 58, 0.72)"
  ink-faint: "rgba(36, 60, 58, 0.34)"
  ink-hair: "rgba(36, 60, 58, 0.18)"
  ink-shade: "rgba(36, 60, 58, 0.14)"
  rust: "#a85f43"
  rust-deep: "#8c4d36"
  rust-deeper: "#7a4230"
  ochre: "#c0954a"
  clay: "#e4c4a6"
  clay-wash: "rgba(168, 95, 67, 0.18)"
  sage: "#87947a"
typography:
  display:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.2rem, 6vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  display-steps:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "2.2rem | 2.6rem | 4rem | 5.5rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  numeral:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "3.5rem | 4.5rem"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "normal"
  headline:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "2rem | 2.25rem | 2.75rem | 3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline-popup:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "27px | 34px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.005em"
  tagline:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "1.75rem | 2.25rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  step-title:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.01em"
  card-title:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "1.25rem | 21px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "1.125rem | 1.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  title-popup:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "17px | 22px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "normal"
  accent:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "1.375rem | 2rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  accent-supporting:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "0.9375rem | 17px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
  accent-popup:
    fontFamily: "Eczar, Georgia, 'Times New Roman', serif"
    fontSize: "17px | 18px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Mukta, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.0625rem | 1.125rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  body-small:
    fontFamily: "Mukta, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem | 0.9rem | 0.9375rem | 1rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "Mukta, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.75rem | 0.78rem | 0.8125rem | 0.84rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label-popup:
    fontFamily: "Mukta, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "12px | 12.5px | 13px | 13.5px | 14px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
rounded:
  sticker: "18px 22px 16px 24px / 22px 16px 24px 18px"
  card: "16px 20px 14px 22px / 20px 14px 22px 16px"
  sticker-sm: "9px 11px 8px 12px / 11px 8px 12px 9px"
  pill: "14px 16px 13px 15px / 15px 13px 16px 14px"
  circle: "52% 48% 50% 50% / 50% 50% 48% 52%"
  knob: "62% 38% 55% 45% / 45% 55% 40% 60%"
  mark: "55% 45% 50% 50% / 48% 52% 48% 52%"
  mark-sm: "50% 45% 55% 50%"
  round: "50%"
  focus: "4px"
spacing:
  hair: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  card-pad: "14px"
  row: "18px"
  sticker-pad: "22px"
  lg: "32px"
  section: "64px"
  section-lg: "96px"
components:
  button-primary:
    backgroundColor: "{colors.rust-deep}"
    textColor: "{colors.cream}"
    typography: "{typography.body}"
    rounded: "{rounded.sticker-sm}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.rust-deeper}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sticker-sm}"
    padding: "14px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.paper}"
  button-secondary-small:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label-popup}"
    rounded: "{rounded.sticker-sm}"
    padding: "5px 12px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "4px"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.round}"
    width: "30px"
    height: "30px"
  button-dismiss:
    backgroundColor: "transparent"
    textColor: "{colors.ink-faint}"
    rounded: "{rounded.round}"
    width: "28px"
    height: "28px"
  control-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label-popup}"
    padding: "3px 0 2px"
  toggle-track:
    backgroundColor: "transparent"
    rounded: "{rounded.pill}"
    width: "42px"
    height: "24px"
  toggle-track-on:
    backgroundColor: "{colors.clay-wash}"
  toggle-knob-on:
    backgroundColor: "{colors.rust}"
    rounded: "{rounded.knob}"
    size: "17px"
  radio-dot:
    backgroundColor: "{colors.rust}"
    rounded: "{rounded.knob}"
    size: "9px"
  quiet-mark:
    backgroundColor: "{colors.sage}"
    rounded: "{rounded.mark}"
    size: "9px"
  bell-on:
    textColor: "{colors.ochre}"
    size: "18px"
  desk:
    backgroundColor: "{colors.clay}"
    rounded: "{rounded.sticker}"
    padding: "24px"
  sticker:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sticker}"
    padding: "22px 22px 20px"
    width: "320px"
  reminder-card:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "14px 40px 14px 14px"
    width: "448px"
  reminder-art:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.circle}"
    size: "112px"
---

# Design System: Watch Your Breath

## Overview

**Creative North Star: "The Sticker Brought to Life"**

The whole world is one hand-drawn body of work: deep teal ink on warm sand, wind lines and leaves carrying two phrases through space. Every visual on the site and in the Chrome extension is a cut from the author's drawings (the hero sticker in `web/public/illustrations/hero.png`, cropped by `illustrations/scripts/crop.mjs`, and the twelve-panel reminder sheet, cut by `illustrations/scripts/reminders.mjs`), or ink type set next to it, or one of the small hand-drawn UI glyphs (gear, back arrow, chevron, silent, bell, play, and the card's ×). Nothing else is drawn. The illustration is the page structure: the emblem is the origin, and the sweep of wind lines from its right side is the only thing that separates sections.

Around the ink sit a few earthy tones from the author's swatch sheet, used sparingly: burnt clay (rust) for the one thing that asks for a click, ochre for the three step numerals and the bell when sound is on, clay for the desk a sticker rests on, and sage for quiet hours alone. The drawings themselves stay pure ink. Density is low and warm. The site is a single column of sand with no cards, no rules and no panels; sections part by voids and by the flow line passing through. The extension has two stickers: the popup (320px, emblem and a handful of rows) and the reminder card (448px, one of twelve illustrations in a paper circle beside its own words). Controls are drawn in ink, not boxed: a written line under a value, a pill switch whose knob is the drawn ring, a radio whose mark is the drawn ring.

Motion is a single slow breath. Every drawing moves on the same nine-second clock, each illustration in its own way (flow, ripple, drift, breathe); nothing pulses, bounces or spins, and reduced-motion turns it all off. Sound is one bell, the author's recording, played once. Rejected outright by the build: centered-hero-plus-cards layouts, gradients, glassmorphism, dashboards, generated or stock drawings.

**Key Characteristics:**
- One ink (#243c3a) on warm sand (#f3e8d2) for every drawing and all text; tone within ink comes from alpha (72 / 34 / 18 percent), never from grey.
- Burnt clay is the action family: rust (#a85f43) on knobs, dots and one philosophy line; rust-deep (#8c4d36) as the button fill; rust-deeper (#7a4230) on hover.
- Ochre (#c0954a) on the step numerals and the bell when on; clay (#e4c4a6) as the desk; sage (#87947a) only when quiet hours are on.
- Eczar bold for everything spoken, Eczar 500 for the supporting line under every title, Mukta for everything operated. Two families, no italic.
- Twelve reminders, each an illustration designed with its own words and its own motion; never recombined.
- Organic corners: every radius is an eight-value elliptical shape so no two corners match.
- Flat sand; the only lift is the sticker's 4px paper edge and, on the popup alone, a soft ink drop.
- One nine-second breath, `cubic-bezier(0.45, 0, 0.55, 1)`, on every illustration; a 520ms rise as a card arrives.

## Colors

Ink on warm sand, with four earthy tones each holding one job: burnt clay asks, ochre highlights, clay carries, sage quiets.

### Primary
- **Ink** (`{colors.ink}`): every drawing, all text, every border (1.5px), the secondary button outline, focus outlines, the chevron drawn into selects. There is no second dark.
- **Ink Soft** (`{colors.ink-soft}`): secondary copy, every Eczar 500 supporting line, status lines, hints, off-state toggle words, resting icon buttons.
- **Ink Faint** (`{colors.ink-faint}`): the resting underline under quiet links, the card's × and chevron at rest, the bell when sound is off, thin scrollbars.
- **Ink Hair** (`{colors.ink-hair}`): hairlines only: above a card's reflection, around the popup's notice box.
- **Ink Shade** (`{colors.ink-shade}`): the soft drop beneath the popup sticker, nowhere else.

### Secondary
- **Rust / Burnt Clay** (`{colors.rust}`): the accent that marks a chosen state: the toggle knob when on, the chosen radio dot, the hover colour of quiet-link underlines and written-line controls, the nav link's underline, and the middle line of the philosophy ("Nothing to achieve.").
- **Rust Deep** (`{colors.rust-deep}`): the primary button fill and border, 5.7:1 against sand text.
- **Rust Deeper** (`{colors.rust-deeper}`): primary button hover.
- **Clay** (`{colors.clay}`): the desk a sticker sits on: the html background behind the popup and first-run page, the pad around the popup replica on the site, and the strip behind the settings card preview.
- **Clay Wash** (`{colors.clay-wash}`): the toggle track when on, and text selection.

### Tertiary
- **Ochre** (`{colors.ochre}`): the 01 / 02 / 03 step numerals, and the bell glyph when sound is on. Nothing else.
- **Sage** (`{colors.sage}`): the quiet-hours mark (an organic 9px dot beside the group title), the 2px line under the quiet-hours time inputs while quiet is active, and the "Quiet now" word.

### Neutral
- **Warm Sand** (`{colors.cream}`): the page ground on the site, the sticker's and the card's own paper, and the text on rust-deep buttons.
- **Paper** (`{colors.paper}`): the die-cut edge around a sticker or card (a 4px spread ring), the circle behind a reminder illustration, the secondary button's hover fill, the toggle's hover halo.

### Named Rules
**The One Ink Rule.** Ink is the only colour of the drawings and of text (thinned by alpha for hierarchy, never swapped for grey), and burnt clay is the one colour that asks for a click. An illustration is never recoloured, tinted or placed on anything but sand or paper.

**The Quiet Sage Rule.** Sage means "quiet hours are on right now" and nothing else. Never use it as decoration, a second accent, or a success colour.

**The One Job Rule.** Each earthy tone holds one job: the rust family for actions and chosen states (plus the one philosophy line), ochre for the numerals and the bell, clay for the desk, sage for quiet. A tone that takes a second job breaks the sheet.

## Typography

**Display Font:** Eczar (with Georgia, Times New Roman, serif)
**Body Font:** Mukta (with system-ui, Segoe UI, sans-serif)

Two families, each with one job. Eczar's heavy Devanagari-rooted serifs carry the sticker's hand-lettered voice into HTML and own every heading and every quiet accent line; Mukta, from the same family, runs the controls and the prose without changing accent.

**No third family, and no italic.** Eczar ships upright weights only, so a browser asked for italic would slant the face synthetically and distort it. The accent lines ("Just a moment.") are therefore Eczar 500 upright in ink-soft, one step down from the title above them. Cormorant Garamond, which carried those lines until the two-family pass, is gone from both builds.

Weights present: Eczar 500 / 600 / 700 (the site also loads 800, unused), Mukta 400 / 500 / 600 (the site also loads 300, unused).

### The scale
One nine-step scale, shared by the site and the extension. Every step carries its own line height, so leading can never drift from size; nothing in either build sits outside it.

| Step | Size | Line height | Carries |
| --- | --- | --- | --- |
| `display-2xl` | 5.5rem / 88px | 1.05 | the philosophy triad at lg, and nothing else |
| `display-xl` | 3rem / 48px | 1.08 | section headings at sm and up |
| `display-lg` | 2rem / 32px | 1.15 | the tagline, the closing title, the first-run phrase |
| `display-md` | 1.375rem / 22px | 1.25 | card titles, the install note, the settings title |
| `display-sm` | 1.125rem / 18px | 1.3 | the header name, small headings, popup accent lines |
| `body-lg` | 1.25rem / 20px | 1.5 | the lede under a section heading |
| `body` | 1.0625rem / 17px | 1.55 | prose, and a reminder's supporting line on the card |
| `body-sm` | 0.9375rem / 15px | 1.5 | secondary text, row labels and controls |
| `caption` | 0.8125rem / 13px | 1.45 | hints, status lines and time labels |

In Tailwind these are `--text-*` theme tokens (`text-display-xl`, `text-body-sm`); in the popup they are the CSS variables `--text-display-lg` down to `--text-caption`. The extension reaches six of the nine; the site uses all nine.

The philosophy triad steps through three of them rather than inventing sizes: `display-lg`, `display-xl` from 480px, `display-2xl` at lg, the middle line in rust. The lean is small on purpose — 6% / 12% at sm, 10% / 20% at lg. A wider step leaves a dead triangle under the first line, and prose placed inside that triangle tangles with the type above it, so the supporting paragraph sits below the block at the same left margin as the first line. `display-2xl` is 88px rather than 72 so the longest line carries its column instead of floating in it; 480px is the lowest breakpoint at which "Nothing to achieve." still sets on one line, and none of the three ever wraps.

Numerals in the install note are Eczar 600, tabular, in ochre.

The way in (the block under "A small sticker in your toolbar") is not a panel: it sits on the sand like everything else, and gets its order from a statement in `display-md`, a `body-sm` line under it, the one rust button with its weight in `caption` beneath, then the ochre ladder on a `2.25rem` numeral column with `1rem` between rungs. Its right edge meets the clay desk across one `5rem` gutter. The heading sits above both columns rather than inside the left one, so the words and the desk start on the same line; the desk stretches to the words' last line with the popup centred on it, and the two halves begin and end together. Arriving by link washes it in clay-wash for 1.6s, bled 18px past the text on a shadow so nothing has to become a box for the arrival to be seen.

### Named Rules
**The Two Voices Rule.** A title is Eczar bold; the line beneath it is Eczar 500 in ink-soft, one step down the scale. "Watch your breath." / "Just a moment." is the first pair; every reminder repeats the pairing with its own words. The lighter weight is never lent to anything that is not a supporting line.

**The No Uppercase Label Rule.** Small text is sentence case with normal tracking. No uppercase labels anywhere.

## Layout

The site is one column, `max-width: 1200px`, padded 20px (sm: 32px), with sections separated by vertical voids of 64–96px (`py-16` / `lg:py-24`, philosophy `py-20` / `lg:py-32`) and by the flow crop, which is placed at the top of a section, pulled up into the previous one with a negative margin (-40px / -64px), and masked so its cut edges fade into the sand. The flow sits left before "How it works" and is mirrored right before the philosophy. There are no horizontal rules and no bordered sections.

The hero is the illustration at full width (max 1100px, nudged -24px left at lg) with the tagline block, 34rem wide, hung off its lower right (`lg:ml-auto lg:mr-[3%]`), overlapping the drawing's baseline by 24px at lg. Below sm the drawing's "Just a moment." is repeated as script text, right aligned, because the crop's phrase becomes too small to read.

Steps run as a three-column grid at md (gap 40px) and stack with 48px gaps below. The toolbar section is a two-column grid at lg (`1fr / 1.1fr`, gap 80px): copy and the reminder card ("How a reminder arrives") on the left, the working popup replica on the right, sat on a clay desk with the sticker radius (24px padding, 40px at sm). The twelve reminders run as a 2 / 3 / 4-column grid (sm / md / lg; gaps 32px across, 48px down); each illustration sits bottom-aligned in a fixed-height box (150px, 170px at md, art capped at 200px wide) with its title and supporting line centred beneath. The close section pairs the emblem (140–200px) with the two phrases and repeats the two calls to action.

The popup is a fixed 320px body with 10px of clay desk around a sticker padded 22px (bottom 20px), the gear at top right. Rows are a 12px grid of flex rows, each 28px minimum, label left and control right: Reminders / Every / (Custom) / Notification / Sound. The settings view groups rows under Eczar titles with 22px between groups (Reminders, Notification, Sound, Quiet hours, Optional, About); the Notification group holds the real card in an iframe scaled to 0.56 on a clay strip. The first-run page centres the same sticker at `min(100%, 420px)` with 32px padding on the same clay, its radios laid in a row.

The reminder card is 448px (never wider than the viewport minus 20px) on a 10px sand margin: a `112px | 1fr` grid with a 14px gap, `14px 40px 14px 14px` padding, minimum height 116px, contents vertically centred; the right padding leaves room for the × at bottom right (8px in). Expanded, the art top-aligns, the chevron sits at the copy's left edge, and the reflection block opens beneath a hairline.

Rhythm inside components is a 2 / 4 / 8 / 12 / 14 / 18 / 22px scale; between site sections it is 64 / 96px. Breakpoints used: 420px (display size step), sm 640px, md 768px, lg 1024px.

## Elevation & Depth

Flat sand. The site has no shadows anywhere; depth is the drawing itself and the tonal step from sand to the clay desk to the paper die-cut edge. Two lifts exist. The popup sticker has a 4px paper spread that reads as the die-cut edge and a soft ink drop beneath it. The reminder card, on the site and in the extension, has the paper edge only: no drop, because it appears on top of whatever the user is doing and must not look like it is hovering.

### Shadow Vocabulary
- **Sticker lift** (`box-shadow: 0 0 0 4px #f9f2e4, 0 3px 10px rgba(36, 60, 58, 0.14)`): the popup sticker, the first-run sticker, and the popup replica on the site. The drop colour is `{colors.ink-shade}`.
- **Card edge** (`box-shadow: 0 0 0 4px #f9f2e4`): the reminder card; paper edge, no drop.
- **Toggle halo** (`box-shadow: 0 0 0 3px #f9f2e4`): hover on the toggle track in the popup; a paper ring, not a shadow.

### Named Rules
**The Paper Edge Rule.** A sticker is lifted by its die-cut paper edge, never by a shadow alone. Only the popup adds a drop; the card, the toast and every control stay flat.

## Shapes

Corners are organic: each radius token is an eight-value elliptical shape so no two corners of a box are the same. The popup sticker, the clay desk and the site's card mirror use `{rounded.sticker}`; the extension's reminder card uses its own slightly tighter `{rounded.card}`; buttons, the notice box, the card preview strip and the inline code chip use `{rounded.sticker-sm}`; the toggle track uses `{rounded.pill}`. The paper circle behind a reminder illustration is `{rounded.circle}`, a hand-cut circle rather than a true one. Dots and knobs use blob shapes: `{rounded.knob}` for the toggle knob and the chosen radio dot, `{rounded.mark}` for the sage quiet mark beside a group title, `{rounded.mark-sm}` for the sage dot before a quiet status line. The only true circles are the 28–30px icon-button hit areas (`{rounded.round}`). Focus outlines are a plain 4px radius, 2px ink, offset 3–4px.

Borders are always 1.5px: ink on the sticker, the card, the secondary button, the toggle track; rust-deep on the primary button (matching its fill). Inputs and selects have no box at all, only a 1.5px ink line beneath the value (rust on hover, 2px sage when quiet is active). Thinner lines are ink-hair at 1px: above a card's reflection and around the popup's notice box.

Every raster edge is a mask, not a shape: the flow crop fades out along its cut edges with a linear-gradient mask (22% in from the cut side, 26% up from the bottom) so the drawing reads as passing through the paper rather than being placed on it. Reminder illustrations are shown whole, 96px inside their 112px paper circle on the card (82px in a 96px circle on the site), or up to 200px wide bottom-aligned in the grid. The native time-picker indicator is filtered toward ink (`sepia(1) hue-rotate(130deg) saturate(0.6) brightness(0.55)` at 50% opacity) so the browser's icon does not break the ink-only rule for drawn marks.

The UI glyphs (gear, back arrow, chevron, silent, bell, play in `illustrations/src/glyphs.ts`, plus the × inlined in the card) are hand-drawn strokes at 1.7–1.8px, `currentColor`, round caps and joins, on a 24-unit grid (chevron and × on 16), rendered at 16–20px (chevron 14px, bell 18px).

## Components

### Buttons
Burnt-clay stamps on sand for the one action; ink outlines for the rest.
- **Shape:** organic small corners (`{rounded.sticker-sm}`), 1.5px border on both filled and outline variants.
- **Primary:** rust-deep fill and border, sand text, Mukta 500 at 1.0625rem, `14px 24px` on the site; 14px type and `8px 16px` in the popup (15px and `11px 18px` on first run; 13px and `6px 12px` for the small "Send one now" / Preview buttons). Hover deepens to rust-deeper.
- **Secondary:** transparent, ink text, 1.5px ink border, same padding; hover fills with paper. The header "Add to Chrome / Edge / Firefox" button (named for the visitor's browser) is this variant at 0.875–0.9375rem with `10px 14–16px`; the card's Close is this variant at 13.5px with `5px 12px`.
- **Quiet (site only):** bare ink text, 1.5px underline at 6px offset in ink-faint, turning rust on hover. The nav link's underline is rust and appears on hover.
- **Hover / Focus:** lift 1px (`translateY(-1px)`, 150–160ms ease-out, motion-safe only), back to 0 on press; focus is the global 2px ink outline offset 4px. Disabled is 50% opacity, no lift.
- **Icon buttons:** 30px round hit area in the popup (gear top right, back arrow), 28px for the card's ×, no border, glyph in ink-soft (× and chevron in ink-faint), ink on hover; the gear rotates 22deg on hover over 400ms with `cubic-bezier(0.2, 0.8, 0.3, 1)`; the card's chevron (26 × 22px, `{rounded.sticker-sm}`) rotates 180deg when expanded over 320ms. The Preview button carries the play glyph.

### Inputs / Fields
A written line, not a box.
- **Style:** transparent, no border except a 1.5px ink line beneath (`.control-line` / `.select` / `.input`), `3px 0 2px` padding, inherits Mukta, value right-aligned. Selects carry the ink chevron as a 14px background at the right edge and read right-to-left so the value hugs the line's end. Number inputs are 64px wide with spinners removed; time inputs are 104px, left-aligned, tabular numerals, with the native picker icon filtered to ink at 50%.
- **Hover:** the line turns rust (160ms).
- **Focus:** the global ink outline.
- **Quiet active:** the time inputs' line becomes 2px sage and the group title gains a 9px sage blob.

### Toggle
A hand-drawn pill whose knob is the drawn ring itself.
- **Track:** 42 × 24px, 1.5px ink border, `{rounded.pill}`, transparent; on, it fills with clay-wash (220ms).
- **Knob:** 17px, the `ring.png` crop as background; on, it slides 18px, rotates 12deg and fills solid rust (260ms, `cubic-bezier(0.2, 0.8, 0.3, 1)`).
- **Word:** "Off" in ink-soft / "On" in ink 500 beside the track, so the state is never colour alone.
- **Sound variant:** the 18px bell glyph sits before the track in a 28px round button of its own, ink-faint when off and ochre when on (200ms), and ochre on hover. It is not part of the switch: pressing it rings the bell once and sways it (760ms), whatever the switch says.
- **Hover:** a 3px paper halo around the track (popup).

### Radio
The ring crop at 18px as the mark; chosen, a 9px rust blob scales in over 180–200ms. Label in Mukta 400 beside it, 10px gap; the notification-layout radios carry a one-line description in ink-soft, and first-run lays its radios in a row. Focus outlines the mark.

### Sticker (popup / first-run frame)
The one container in the extension's toolbar surface. Sand ground, 1.5px ink edge, `{rounded.sticker}`, the sticker lift shadow, `22px 22px 20px` padding, 320px wide, minimum height 200px, on a clay desk. On the site, the same frame holds the working popup replica on a clay pad. When reminders are off the emblem inside rests at 40–42% opacity with its breath paused. The settings view's notice box (1px ink-hair border, `{rounded.sticker-sm}`, `10px 12px`) is the only bordered box inside it.

### Reminder Card (signature)
How a reminder arrives: one of twelve drawings beside its own words, on a sand sticker with a paper edge.
- **Frame:** 448px, sand ground, 1.5px ink border, `{rounded.card}` (the site mirror uses `{rounded.sticker}`), 4px paper edge, `14px 40px 14px 14px` padding, `112px | 1fr` grid with a 14px gap.
- **Art:** a 112px paper circle (`{rounded.circle}`, 96px on the site) holding the illustration at 96px (82px on the site), `object-fit: contain`, transform-origin `50% 55%`.
- **Copy:** Eczar 700 title at 21px (1.25rem on the site), Eczar 500 supporting at 17px (1.0625rem) in ink-soft, 2px apart, vertically centred.
- **Dismiss:** a 28px × at bottom right (8px in), ink-faint, ink on hover, 16px glyph. Hidden when expanded.
- **Expanded:** a 26 × 22px chevron button at the copy's left (4px below), rotating 180deg when open; then an 8px gap, a 1px ink-hair rule, 10px, a Mukta 14px reflection at line-height 1.5 and max 34ch, and a small secondary Close button; the art top-aligns.
- **Arrival:** 520ms fade from 0 with a 6px rise, `cubic-bezier(0.2, 0.8, 0.3, 1)`, once.
- **Motion:** the illustration moves on the nine-second clock in the way its entry names: `flow` (translateX 2.5px + scaleX 1.02 at 45%, easing back through 65%), `ripple` (scale 1.03), `drift` (translate 2px, -2px and rotate -1.2deg), `breathe` (scale 1.025 at 42%, 1.02 at 62%). Reduced motion removes arrival and breath and the control transitions.
- **Preview:** in settings the real card renders in an iframe at 0.56 scale on a clay strip (`{rounded.sticker-sm}`, `6px 0 2px`).

### What You Will See (site)
Three screenshots of the built extension - the first-run page, a reminder as it arrived on a Windows desktop, and the popup - each centred on a clay panel with the large sticker radius, capped to one height (212px, 252px at lg) so the three align whatever their shape, with an Eczar 600 `display-md` title and a `body-sm` ink-soft line beneath. A `caption` ink-faint line may follow it for a caveat the screenshot cannot show: the reminder card carries one, because Chrome on macOS hands notifications to the system and the large drawing does not survive the handover. Three columns at sm and up, one column below.

The twelve-illustration grid and the numbered "How it works" steps that preceded it were removed from the site; the twelve still drive the extension.

### Navigation
A single header row: the 28px icon crop plus the name in Eczar 600 (1rem / 1.125rem) on the left; a quiet text link (hidden below sm, rust underline on hover) and a secondary button on the right. No bar, no border, no background.

### Breath Emblem and Flow (signature)
The emblem is `ring.png` (the ring cut from the illustration) or `sticker.png` (the full sticker crop in the popup). It breathes on the nine-second clock: `scale(1) → scale(1.025) translateX(1.5px)` at 42% → `scale(1.02)` at 62% → back, `cubic-bezier(0.45, 0, 0.55, 1)`, infinite, transform-origin at the ring (25% 51% on the hero and sticker crops, 50% 50% on the ring alone). The hero uses a smaller amplitude (1.012, 2px). When a reminder has just fired in the popup, two copies of the ring settle outward once (`scale(1) → 1.7`, opacity 0.35 → 0, 3.2s, second delayed 0.7s). The flow crop carries the emblem's wind lines between site sections, masked at its cut edges. The crops are never tinted; they are ink.

### Reminder Card (in the page)
The reminder as we draw it ourselves, so the illustration looks the same in every browser. 360px wide (never wider than the viewport less 40px), fixed 20px from the bottom right corner, on sand with a 1.5px ink border and the organic sticker radius: the 728 x 364 illustration full-bleed across the top, then the title in Eczar 700 at `display-md` (1.25, -0.005em, balanced) and the supporting line in Eczar 500 at `body` (1.25, ink-soft) beneath it. Those two are the Two Voices pair and the only Eczar on the card; the reflection under them is prose, so it is Mukta 400 at `body-sm` (1.5, ink-soft), and the card's base family is Mukta for that reason. Both supporting and reflection are `text-wrap: pretty`. Both faces travel into the page with the illustration, and the card sets its own font smoothing, because a shadow root with `all: initial` inherits neither from the page nor from us. A 28px round dismiss in ink-faint sits top right of the words, and the words carry 44px of right padding so nothing runs under it. It rises 10px over 420ms on the way in and falls 6px over 320ms on the way out, both `cubic-bezier(0.23, 1, 0.32, 1)`; reduced motion removes both and it simply appears.

It lives in a shadow root with `all: initial`, so no page's stylesheet can reach it and nothing of it escapes. The illustration and Eczar travel into the page as data URLs rather than as web-accessible files, which keeps any site from probing for them to learn the extension is installed; inside the page Eczar is registered as "WYB Eczar" so it cannot collide with a face the page already calls Eczar.

One reminder arrives by one channel, never two. When the browser is the window in front and the page will take it, the card is drawn and no system notification is created. Otherwise the system notification is what arrives, because that is the only thing that can reach someone who is looking at another application. The card is off until switched on, and switching it on is what asks for access to the pages you visit.

### Sound
One bell, the author's recording (`extension/assets/audio/reminder-bell.mp3`), played once per reminder and never looped. It can be heard on demand in two places: the bell glyph on the popup's Sound row, and the play glyph in settings. Both ring whether or not reminders are set to make a sound, because a bell that is pressed should sound; hearing it is how the switch beside it gets decided. The bell glyph in ochre is its only visual; sound is never the only channel a reminder arrives on.

## Do's and Don'ts

### Do:
- **Do** cut every image from the author's drawings (`hero.png` via `crop.mjs`, the twelve-panel sheet via `reminders.mjs`); every crop carries its provenance chunk and stays pure ink.
- **Do** keep each reminder's illustration, title, supporting line, reflection and motion together as designed in `lib/reminders.ts`; a new reminder is a new drawing with its own words, never a recombination.
- **Do** use the hand-drawn UI glyphs (gear, back arrow, chevron, silent, bell, play, ×) as the only vector marks, in `currentColor` at 1.7–1.8px stroke.
- **Do** put burnt clay on the one thing that asks for a click (rust-deep button, rust on-knob and chosen dot, rust hover line) and leave everything else ink.
- **Do** keep every border at 1.5px and every radius one of the organic tokens; a symmetric radius is a foreign object here.
- **Do** run all motion on the nine-second clock (`cubic-bezier(0.45, 0, 0.55, 1)`; flow, ripple, drift or breathe as the reminder names) and turn it off under `prefers-reduced-motion` with transitions removed too.
- **Do** show sage only when quiet hours are active now, and always pair it with the word ("Quiet hours now." / "Quiet now").
- **Do** set controls as written lines under a value and keep the state word beside every toggle.
- **Do** part site sections with a sand void and the flow crop; let the illustration overlap the text block rather than sit above it.

### Don't:
- **Don't** instruct breathing, or show counts, timers, scores, streaks, achievements or sessions in any surface; the copy is "reminder", and each reminder says its own two lines.
- **Don't** pulse, bounce, spin or loop anything faster than the nine-second breath; the settling rings and the card's arrival run once, and the bell is never looped.
- **Don't** add cards, panels, horizontal rules or bordered sections on the site; the sticker frame belongs to the popup, the reminder card and their site mirrors only.
- **Don't** recolour or tint a drawing, place one on anything but sand or paper, set text in ochre or clay, or use sage as decoration. Masks that fade a crop into sand are the only gradients.
- **Don't** give an earthy tone a second job: no ochre outside the numerals and the bell, no rust on non-actions beyond the one philosophy line, no clay as a card fill.
- **Don't** generate, trace or import any drawing, icon set, lotus, lung or breath diagram; if it is not a cut from the author's sheets or one of the UI glyphs it does not exist.
- **Don't** set a supporting line in anything but Eczar 500 ink-soft, or lend that weight to body copy, labels or buttons. Never ask for Eczar italic: the face has none, and the browser will fake it.
- **Don't** add uppercase tracked labels, kickers or eyebrows above headings, or number the reminders.
- **Don't** put a drop shadow on anything but the popup sticker; the card gets its paper edge only.
- **Don't** make sound the only way a reminder arrives.
