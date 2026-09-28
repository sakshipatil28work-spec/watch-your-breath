import Image from "next/image";

type Shot = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  body: string;
};

/**
 * What you actually see, in three real screens. Every image here is a
 * screenshot of the built extension, not a drawing of one: the first-run page
 * and the popup captured from the running build, the reminder captured from a
 * Windows desktop as it arrived.
 */
const SHOTS: Shot[] = [
  {
    src: "/screenshots/first-run.png",
    width: 720,
    height: 921,
    alt: "The first-run screen: reminder frequency, notification style and reminder sound, above a Start reminders button.",
    title: "Set it once",
    body: "One screen when you install it: how often, how much the reminder says, and whether the bell plays.",
  },
  {
    src: "/screenshots/reminder.png",
    width: 444,
    height: 300,
    alt: "A Windows notification reading “Nothing to change. Simply notice.” with a drawing of a lotus on still water beneath it.",
    title: "A reminder arrives",
    body: "At the corner of your screen, over whatever you are doing. It leaves on its own after twelve seconds.",
  },
  {
    src: "/screenshots/popup.png",
    width: 640,
    height: 811,
    alt: "The extension popup: the hand-drawn sticker above rows for Reminders, Every, Notification and Sound.",
    title: "Change it whenever",
    body: "Click the sticker in your toolbar. Quiet hours, the bell and the rest live one tap deeper.",
  },
];

export function Walkthrough({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="walkthrough-title"
      className={["mx-auto max-w-[1200px] px-5 sm:px-8 py-12 lg:py-16", className].filter(Boolean).join(" ")}
    >
      <h2 id="walkthrough-title" className="font-display font-bold text-display-lg sm:text-display-xl text-balance">
        What you will see.
      </h2>
      <p className="mt-4 text-body-lg max-w-[46ch] text-pretty">
        Three screens, start to finish. That is the whole of it.
      </p>

      <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10 list-none p-0 m-0">
        {SHOTS.map((s) => (
          <li key={s.src} className="grid content-start gap-4">
            <span className="grid place-items-center rounded-[var(--radius-sticker-lg)] bg-clay px-5 py-6 h-[260px] lg:h-[300px]">
              <Image
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                sizes="(min-width: 640px) 33vw, 100vw"
                className="max-h-[212px] lg:max-h-[252px] w-auto object-contain rounded-[var(--radius-sticker-sm)] shadow-[0_2px_10px_rgba(36,60,58,0.14)]"
              />
            </span>
            <span className="grid gap-1.5">
              <span className="font-display font-semibold text-display-md">{s.title}</span>
              <span className="text-body-sm text-ink-soft max-w-[34ch] text-pretty">{s.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
