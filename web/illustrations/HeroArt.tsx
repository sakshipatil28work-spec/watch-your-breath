import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";

export const HERO_PATH = join(process.cwd(), "public", "illustrations", "hero.png");

/** True when the hand-drawn hero has been placed in public/illustrations. Checked at build time. */
export function heroExists(): boolean {
  return existsSync(HERO_PATH);
}

/**
 * The hero: the hand-drawn illustration, keyed to ink-on-transparent by the
 * crop script so it sits on the cream page, breathing very slightly.
 */
export function HeroArt({ className }: { className?: string }) {
  if (!heroExists()) {
    return (
      <div
        className={[
          "aspect-[1163/616] grid place-items-center rounded-[var(--radius-sticker)] border-[1.5px] border-dashed border-ink-faint text-ink-soft text-center p-8",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <p className="max-w-[28ch]">
          Place the illustration at <code className="font-ui">web/public/illustrations/hero.png</code> and run{" "}
          <code className="font-ui">npm run crop</code>.
        </p>
      </div>
    );
  }
  return (
    <div className={["hero-breath motion-safe-only", className].filter(Boolean).join(" ")}>
      <Image
        src="/illustrations/sticker-large.png"
        alt="A hand-drawn ring of breath flowing out into wind lines, curls and leaves, with the words drawn in."
        width={1163}
        height={616}
        priority
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="w-full h-auto"
      />
    </div>
  );
}
