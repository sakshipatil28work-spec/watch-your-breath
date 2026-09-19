import Image from "next/image";
import { HeroArt, heroExists } from "@/illustrations/HeroArt";
import { Emblem } from "@/illustrations/Emblem";
import { AddToBrowser } from "@/components/AddToBrowser";
import { InstallNote } from "@/components/InstallNote";
import { PopupDemo } from "@/components/PopupDemo";
import { COPY, SITE } from "@/lib/site";


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
          className="flex items-center gap-2.5 font-display font-semibold text-[1rem] sm:text-[1.125rem] leading-none whitespace-nowrap"
        >
          <Image src="/illustrations/icon-48.png" alt="" width={48} height={48} className="w-7 h-7" />
          <span>Watch Your Breath</span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-5 sm:gap-7">
          <AddToBrowser
            variant="secondary"
            className="px-3.5 sm:px-4 py-2.5 text-[0.875rem] sm:text-[0.9375rem] whitespace-nowrap"
          />
        </nav>
      </header>

      <main id="main">
        {/* ---------- hero ---------- */}
        <section
          aria-labelledby="hero-title"
          className="mx-auto max-w-[1200px] px-5 sm:px-8 pt-6 sm:pt-10 pb-14 lg:pb-20"
        >
          <HeroArt className="reveal w-full max-w-[1100px] mx-auto lg:-ml-6" />
          <p
            aria-hidden="true"
            className="reveal sm:hidden font-script italic text-[1.6rem] leading-none text-ink-soft text-right -mt-1 pr-1"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Just a moment.
          </p>
          <div className="mt-6 sm:mt-4 lg:mt-5 max-w-[34rem] lg:ml-auto lg:mr-[3%]">
            <h1
              id="hero-title"
              className={
                heroIsRaster
                  ? "sr-only"
                  : "font-display font-bold text-[2.75rem] sm:text-[3.5rem] leading-[1.02] tracking-[-0.01em] uppercase mb-5"
              }
            >
              Watch your breath.
            </h1>
            <p
              className="reveal font-display font-semibold text-[1.75rem] sm:text-[2.25rem] leading-[1.15] tracking-[-0.005em] text-balance"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              {SITE.tagline}
            </p>
            <div className="reveal mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ "--i": 3 } as React.CSSProperties}>
              <AddToBrowser />
            </div>
          </div>
        </section>

        {/* ---------- in your toolbar ---------- */}
        <section aria-labelledby="toolbar-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 py-14 lg:py-18">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20 items-start">
            <div className="max-w-[34rem]">
              <h2 id="toolbar-title" className="font-display font-bold text-[2.25rem] sm:text-[3rem] leading-[1.08] tracking-[-0.01em] text-balance">
                A small sticker in your toolbar.
              </h2>
              <p className="mt-5 text-[1.125rem] sm:text-[1.25rem] leading-[1.5] max-w-[46ch] text-pretty">
                Click the icon, turn reminders on, choose how often. That is the whole interface. Quiet hours, the notification
                layout and the bell live one tap deeper, and nothing is counted, scored or streaked. Free, with no account, and nothing leaves your browser.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end lg:pt-2">
              <div className="p-6 sm:p-10 bg-clay rounded-[var(--radius-sticker-lg)]">
                <PopupDemo />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- philosophy ---------- */}
        <section aria-labelledby="phil-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16 lg:py-24 relative">
          <h2 id="phil-title" className="sr-only">
            What this is, and is not
          </h2>
          <div className="grid gap-3 sm:gap-2 font-display font-bold leading-[1.05] tracking-[-0.015em] text-[2.2rem] min-[420px]:text-[2.6rem] sm:text-[4rem] lg:text-[5.5rem]">
            <p className="sm:pl-0">{COPY.philosophy[0]}</p>
            <p className="sm:pl-[12%] lg:pl-[16%] text-rust">{COPY.philosophy[1]}</p>
            <p className="sm:pl-[24%] lg:pl-[32%]">{COPY.philosophy[2]}</p>
          </div>
          <p className="mt-10 lg:mt-14 max-w-[46ch] text-[1.125rem] sm:text-[1.25rem] leading-[1.5] sm:ml-[24%] lg:ml-[32%] text-pretty">
            {COPY.philosophyBody}
          </p>
        </section>

        {/* ---------- close ---------- */}
        <section aria-labelledby="close-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 pt-6 pb-14 lg:pb-18">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex items-center gap-6 sm:gap-10">
              <Emblem className="w-[140px] sm:w-[200px] shrink-0" label="" />
              <div>
                <h2 id="close-title" className="font-display font-bold text-[2rem] sm:text-[2.75rem] leading-none tracking-[-0.01em]">
                  Watch your breath.
                </h2>
                <p className="font-script italic text-[1.5rem] sm:text-[1.75rem] leading-tight text-ink-soft mt-2">Just a moment.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <AddToBrowser />
            </div>
          </div>

          <InstallNote />
        </section>
      </main>

      <footer className="mx-auto max-w-[1200px] px-5 sm:px-8 pb-10 pt-6 flex flex-wrap items-center justify-between gap-4 text-[0.9rem] text-ink-soft">
        <p>{COPY.about}</p>
        <p>Not a practice. Simply a reminder.</p>
      </footer>
    </>
  );
}
