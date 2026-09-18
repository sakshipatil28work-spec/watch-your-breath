import Image from "next/image";
import { REMINDERS, illustrationSrc, type Reminder } from "@/lib/reminders";

export type NotificationLayout = "compact" | "expanded";

type Props = {
  reminder?: Reminder;
  layout?: NotificationLayout;
  /** Show the reflection open (expanded layout only). */
  open?: boolean;
  className?: string;
};

/**
 * A reminder as it reads: illustration on the left, the words on the right.
 * (It arrives as the system's own notification; this is its content in our
 * hand, not the operating system's chrome.)
 */
export function NotificationPreview({ reminder = REMINDERS[0], layout = "compact", open = false, className }: Props) {
  const showMore = layout === "expanded" && reminder.reflection;
  return (
    <div
      role="img"
      aria-label={`Reminder: ${reminder.title} ${reminder.supporting}`}
      className={[
        "relative grid grid-cols-[108px_minmax(0,1fr)] gap-3.5 items-center w-fit min-w-[300px] max-w-[392px] rounded-[var(--radius-sticker)] border-[1.5px] border-ink bg-cream px-3.5 pr-9 py-3.5 shadow-[0_0_0_4px_var(--color-paper)]",
        open ? "items-start" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="grid place-items-center w-[108px] h-[108px] rounded-[52%_48%_50%_50%_/_50%_50%_48%_52%] bg-paper overflow-hidden">
        <Image
          src={illustrationSrc(reminder)}
          alt=""
          width={320}
          height={320}
          className={["w-[94px] h-[94px] object-contain", `motion-${reminder.motion}`].join(" ")}
        />
      </span>
      <span className="grid gap-0.5 min-w-0">
        <span className="font-display font-bold text-[1.25rem] leading-[1.15] tracking-[-0.005em] text-balance">
          {reminder.title}
        </span>
        <span className="font-script italic text-[1.0625rem] leading-tight text-ink-soft">{reminder.supporting}</span>
        {showMore && (
          <>
            <span
              aria-hidden="true"
              className={["mt-1 w-4 h-4 text-ink-faint transition-transform", open ? "rotate-180" : ""].join(" ")}
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4">
                <path
                  d="M3.2 6.2 C4.8 7.8 6.4 9.4 8 11 C9.6 9.3 11.2 7.7 12.8 6.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {open && (
              <span className="mt-2 pt-2.5 border-t border-ink-hair grid gap-2.5 justify-items-start">
                <span className="text-[0.875rem] leading-relaxed max-w-[34ch]">{reminder.reflection}</span>
                <span className="text-[0.8125rem] font-medium border-[1.5px] border-ink rounded-[var(--radius-sticker-sm)] px-3 py-1">
                  Close
                </span>
              </span>
            )}
          </>
        )}
      </span>
      <span
        aria-hidden="true"
        className={["absolute right-2 bottom-2 grid place-items-center w-7 h-7 text-ink-faint", open ? "hidden" : ""].join(" ")}
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4">
          <path
            d="M3.4 3.6 C6.4 6.5 9.4 9.4 12.4 12.3 M12.6 3.4 C9.6 6.4 6.6 9.4 3.6 12.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
}
