import Image from "next/image";
import { HeroArt, heroExists } from "@/illustrations/HeroArt";
import { Flow } from "@/illustrations/Flow";
import { Emblem } from "@/illustrations/Emblem";
import { AddToBrowser } from "@/components/AddToBrowser";
import { InstallNote } from "@/components/InstallNote";
import { ButtonLink } from "@/components/Button";
import { PopupDemo } from "@/components/PopupDemo";
import { NotificationPreview } from "@/components/NotificationPreview";
import { COPY, SITE } from "@/lib/site";
import { REMINDERS, illustrationSrc } from "@/lib/reminders";

// the twelve sit a touch askew, like stickers on a sheet; never more than a degree and a half
const TILTS = [-1.4, 1.1, -0.7, 1.5, 0.9, -1.2, 1.3, -0.6, -1.5, 0.8, 1.2, -1.0];

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
          <a
            href="#how-it-works"
            className="hidden sm:inline text-[0.9375rem] whitespace-nowrap underline-offset-[6px] decoration-[1.5px] decoration-rust hover:underline"
          >
            {COPY.howItWorks}
          </a>
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
          className="mx-auto max-w-[1200px] px-5 sm:px-8 pt-6 sm:pt-10 pb-20 lg:pb-28"
        >
          <HeroArt className="reveal w-full max-w-[1100px] mx-auto lg:-ml-6" />
          <p
            aria-hidden="true"
            className="reveal sm:hidden font-script italic text-[1.6rem] leading-none text-ink-soft text-right -mt-1 pr-1"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Just a moment.
          </p>
          <div className="mt-6 sm:mt-2 lg:-mt-6 max-w-[34rem] lg:ml-auto lg:mr-[3%]">
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
            <div className="reveal mt-7 flex flex-wrap items-center gap-4" style={{ "--i": 3 } as React.CSSProperties}>
              <AddToBrowser />
              <ButtonLink href="#how-it-works" variant="quiet">
                {COPY.howItWorks}
              </ButtonLink>
            </div>
            <p className="reveal mt-6 text-[0.9375rem] text-ink-soft" style={{ "--i": 4 } as React.CSSProperties}>
              Free. No account. Nothing leaves your browser.
            </p>
          </div>
        </section>

        {/* ---------- how it works ---------- */}
        <section id="how-it-works" aria-labelledby="how-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 pt-4 pb-16 lg:pb-24 scroll-mt-10">
          <Flow className="w-[62%] sm:w-[44%] lg:w-[36%] -mt-10 lg:-mt-16 mb-10 lg:mb-14" />
          <h2 id="how-title" className="font-display font-bold text-[2.25rem] sm:text-[3rem] leading-none tracking-[-0.01em]">
            How it works.
          </h2>
          <ol className="mt-12 lg:mt-16 grid gap-12 md:grid-cols-3 md:gap-10 list-none p-0 m-0">
            {COPY.steps.map((step) => (
              <li key={step.number} className="grid content-start gap-3">
                <span
                  className="font-display font-semibold text-[3.5rem] sm:text-[4.5rem] leading-[0.9] text-ochre tabular-nums"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <h3 className="font-display font-bold text-[1.75rem] leading-none uppercase tracking-[0.01em] mt-3">
                  {step.title}
                </h3>
                <p className="max-w-[30ch] text-[1.0625rem] leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- in your toolbar ---------- */}
        <section aria-labelledby="toolbar-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20 items-start">
            <div className="max-w-[34rem]">
              <h2 id="toolbar-title" className="font-display font-bold text-[2.25rem] sm:text-[3rem] leading-none tracking-[-0.01em] text-balance">
                A small sticker in your toolbar.
              </h2>
              <p className="mt-6 text-[1.0625rem] leading-relaxed max-w-[44ch]">
                Click the icon, turn reminders on, choose how often. That is the whole interface. Quiet hours, the card
                layout and the bell live one tap deeper, and nothing is counted, scored or streaked. Try it here; it works.
              </p>
              <div className="mt-10">
                <p className="font-display font-semibold text-[1.125rem] leading-tight">How a reminder arrives</p>
                <p className="mt-1 text-[0.9375rem] text-ink-soft max-w-[40ch]">
                  A soft bell, then a small card at the corner of your browser. It leaves on its own, or the moment you
                  close it.
                </p>
                <NotificationPreview reminder={REMINDERS[1]} className="mt-4" />
              </div>
            </div>
            <div className="flex justify-center lg:justify-end lg:pt-2">
              <div className="p-6 sm:p-10 bg-clay rounded-[var(--radius-sticker)]">
                <PopupDemo />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- the twelve reminders ---------- */}
        <section aria-labelledby="twelve-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16 lg:py-24">
          <h2 id="twelve-title" className="font-display font-bold text-[2.25rem] sm:text-[3rem] leading-none tracking-[-0.01em] text-balance">
            A different small thought each time.
          </h2>
          <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-relaxed">
            Twelve reminders, each drawn with its own words. They take turns, never the same one twice in a row, and every
            one is shown before any repeats.
          </p>
          <ol className="mt-12 grid gap-x-8 gap-y-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 list-none p-0 m-0">
            {REMINDERS.map((r, i) => (
              <li key={r.id} className="grid content-start justify-items-center text-center gap-3">
                <span
                  className="tilt grid place-items-end w-full h-[150px] md:h-[170px]"
                  style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as React.CSSProperties}
                >
                  <Image
                    src={illustrationSrc(r)}
                    alt={r.alt}
                    width={320}
                    height={280}
                    className="w-full max-w-[200px] max-h-full h-auto object-contain object-bottom justify-self-center"
                  />
                </span>
                <span className="font-display font-bold text-[1.25rem] leading-[1.15] text-balance mt-1">{r.title}</span>
                <span className="font-script italic text-[1.0625rem] leading-tight text-ink-soft -mt-2">{r.supporting}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- philosophy ---------- */}
        <section aria-labelledby="phil-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 py-20 lg:py-32 relative">
          <h2 id="phil-title" className="sr-only">
            What this is, and is not
          </h2>
          <Flow className="w-[58%] sm:w-[40%] lg:w-[30%] ml-auto -mt-8 lg:-mt-14 mb-8 lg:mb-10" flip />
          <div className="grid gap-3 sm:gap-2 font-display font-bold leading-[1.05] tracking-[-0.015em] text-[2.2rem] min-[420px]:text-[2.6rem] sm:text-[4rem] lg:text-[5.5rem]">
            <p className="sm:pl-0">{COPY.philosophy[0]}</p>
            <p className="sm:pl-[12%] lg:pl-[16%] text-rust">{COPY.philosophy[1]}</p>
            <p className="sm:pl-[24%] lg:pl-[32%]">{COPY.philosophy[2]}</p>
          </div>
          <p className="mt-10 lg:mt-14 max-w-[44ch] text-[1.0625rem] sm:text-[1.125rem] leading-relaxed sm:ml-[24%] lg:ml-[32%]">
            {COPY.philosophyBody}
          </p>
        </section>

        {/* ---------- close ---------- */}
        <section aria-labelledby="close-title" className="mx-auto max-w-[1200px] px-5 sm:px-8 pt-6 pb-16 lg:pb-24">
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
            <div className="flex flex-wrap items-center gap-4">
              <AddToBrowser />
              <ButtonLink href="#how-it-works" variant="quiet">
                {COPY.howItWorks}
              </ButtonLink>
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
