import Image from "next/image";
import { HeroArt, heroExists } from "@/illustrations/HeroArt";
import { Emblem } from "@/illustrations/Emblem";
import { AddToBrowser } from "@/components/AddToBrowser";
import { InstallNote } from "@/components/InstallNote";
import { PopupDemo } from "@/components/PopupDemo";
import { Walkthrough } from "@/components/Walkthrough";
import { COPY, SITE } from "@/lib/site";


/* The philosophy triad: one setting, stepped through three sizes of the scale. */
// 480px, not 420: at 420 the line "Nothing to achieve." needs 426px at
// display-xl and only has 380, so it wrapped and broke the stair.
const PHIL = "font-display font-bold text-display-lg min-[480px]:text-display-xl lg:text-display-2xl";

export default function Home() {
  const heroIsRaster = heroExists();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-cream focus:px-3 focus:py-2 focus:border-[1.5px] focus:border-ink"
      >
        Skip to content
      </a>

      <header className="mx-auto max-w-[1200px] px-5 sm:px-8 pt-5 sm:pt-7 flex items-center justify-between gap-4">
        <a
          href="#main"
          className="flex items-center gap-2.5 font-display font-semibold text-display-sm leading-none whitespace-nowrap"
        >
          <Image src="/illustrations/icon-48.png" alt="" width={48} height={48} className="w-7 h-7" />
          <span>Watch Your Breath</span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-5 sm:gap-7">
          <AddToBrowser
            variant="secondary"
            className="px-3.5 sm:px-4 py-2.5 text-body-sm whitespace-nowrap"
          />
        </nav>
      </header>

      <main id="main">
        {/* ---------- hero ---------- */}
        <section
          aria-labelledby="hero-title"
          className="mx-auto max-w-[1200px] px-5 sm:px-8 pt-6 sm:pt-8 lg:pt-10 pb-10 lg:pb-14 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-10"
        >
          <HeroArt className="reveal w-full max-w-[640px] mx-auto lg:max-w-none lg:mx-0" />
          <p
            aria-hidden="true"
            className="reveal sm:hidden font-display font-medium text-display-lg text-ink-soft text-right -mt-3 pr-1"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Just a moment.
          </p>
          <div className="max-w-[34rem] lg:justify-self-start">
            <h1
              id="hero-title"
              className={
                heroIsRaster
                  ? "sr-only"
                  : "font-display font-bold text-display-xl uppercase mb-5"
              }
            >
              Watch your breath.
            </h1>
            <p
              className="reveal font-display font-semibold text-display-md sm:text-display-lg text-balance"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {SITE.tagline}
            </p>
            <div className="reveal mt-6 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ "--i": 3 } as React.CSSProperties}>
              <AddToBrowser />
            </div>
          </div>
        </section>

        {/* ---------- in your toolbar: the popup beside the words, the way in beneath them ---------- */}
        <section aria-labelledby="toolbar-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 py-12 lg:py-16">
          {/* The heading sits above both columns, so the words and the desk start
              on one line; the desk then stretches to the words' last line, and
              the two halves begin and end together instead of one floating. */}
          <h2
            id="toolbar-title"
            className="font-display font-bold text-display-lg sm:text-display-xl text-balance max-w-[20ch]"
          >
            A small sticker in your toolbar.
          </h2>
          <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
            <div className="max-w-[36rem] lg:max-w-none">
              <p className="text-body-lg max-w-[48ch] text-pretty">
                Click the icon, turn reminders on, choose how often. That is the whole interface. Quiet hours, the notification
                layout and the bell live one tap deeper, and nothing is counted, scored or streaked. Free, with no account, and nothing leaves your browser.
              </p>
              <InstallNote className="mt-10" />
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="grid place-items-center p-6 sm:p-8 lg:p-10 bg-clay rounded-[var(--radius-sticker-lg)]">
                <PopupDemo />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- what you will see: three real screens ---------- */}
        <Walkthrough />

        {/* ---------- philosophy ---------- */}
        <section aria-labelledby="phil-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 py-12 lg:py-16 relative">
          <h2 id="phil-title" className="sr-only">
            What this is, and is not
          </h2>
          {/* Three lines leaning right, then the prose back at the left margin
              it shares with the first line. The lean is small on purpose: a wide
              step leaves a dead triangle under it, and putting the prose inside
              that triangle tangles it with the type above. */}
          <div className="grid gap-2 sm:gap-1">
            <p className={PHIL}>{COPY.philosophy[0]}</p>
            <p className={`sm:pl-[6%] lg:pl-[10%] text-rust ${PHIL}`}>{COPY.philosophy[1]}</p>
            <p className={`sm:pl-[12%] lg:pl-[20%] ${PHIL}`}>{COPY.philosophy[2]}</p>
          </div>
          <p className="mt-8 lg:mt-10 max-w-[46ch] text-body-lg text-pretty">{COPY.philosophyBody}</p>
        </section>

        {/* ---------- close ---------- */}
        <section aria-labelledby="close-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 pt-4 pb-10 lg:pb-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex items-center gap-6 sm:gap-10">
              <Emblem className="w-[120px] sm:w-[170px] shrink-0" label="" />
              <div>
                <h2 id="close-title" className="font-display font-bold text-display-lg sm:text-display-xl">
                  Watch your breath.
                </h2>
                <p className="font-display font-medium text-display-md sm:text-display-lg text-ink-soft mt-2">Just a moment.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <AddToBrowser />
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1200px] px-5 sm:px-8 pb-10 pt-6 flex flex-wrap items-center justify-between gap-4 text-body-sm text-ink-soft">
        <p>{COPY.about}</p>
        <p>Not a practice. Simply a reminder.</p>
      </footer>
    </>
  );
}
