import Image from "next/image";
import { REMINDERS, illustrationSrc, type Reminder } from "@/lib/reminders";

export type NotificationLayout = "compact" | "expanded";

type Props = {
  reminder?: Reminder;
  layout?: NotificationLayout;
  /** The name the system shows above the reminder: the browser that delivered it. */
  appName?: string;
  className?: string;
};

/**
 * A reminder as it actually arrives: the system's own notification at the
 * corner of the screen. The frame is the operating system's (drawn here in its
 * dark style, as on Windows); ours is what sits inside it: the drawing large
 * on a sand panel, the round icon, the words. Mirrors what the extension
 * creates in extension/src/background/index.ts.
 */
export function NotificationPreview({ reminder = REMINDERS[0], layout = "compact", appName = "Google Chrome", className }: Props) {
  const message = layout === "expanded" && reminder.reflection ? `${reminder.supporting}\n${reminder.reflection}` : reminder.supporting;
  return (
    <div
      role="img"
      aria-label={`A system notification from ${appName}: ${reminder.title} ${message.replace("\n", " ")}`}
      className={["w-full max-w-[364px] overflow-hidden rounded-[6px] bg-[#1f1f1f] text-[#f2f2f2] shadow-[0_8px_24px_rgba(36,60,58,0.22)]", className]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={illustrationSrc(reminder, "wide")}
        alt=""
        width={728}
        height={364}
        className="block w-full h-auto"
      />
      <div className="px-4 pt-3 pb-4 font-[system-ui,'Segoe_UI',sans-serif]">
        <div className="flex items-center justify-between text-[0.8125rem] text-[#dcdcdc]">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="grid h-4 w-4 place-items-center rounded-[3px] bg-[#f2f2f2]">
              <span className="h-2.5 w-2.5 rounded-full bg-[conic-gradient(#ea4335_0_33%,#fbbc05_0_66%,#34a853_0)] ring-[2px] ring-[#4285f4] ring-inset" />
            </span>
            {appName}
          </span>
          <span aria-hidden="true" className="text-[#bdbdbd]">
            ×
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <Image
            src={illustrationSrc(reminder, "icon")}
            alt=""
            width={192}
            height={192}
            className="h-[72px] w-[72px] shrink-0 rounded-full"
          />
          <span className="grid gap-0.5 min-w-0">
            <span className="text-[1.0625rem] font-semibold leading-tight">{reminder.title}</span>
            <span className="text-[1rem] leading-snug text-[#c9c9c9] whitespace-pre-line">{message}</span>
          </span>
        </div>
        <span aria-hidden="true" className="mt-4 block rounded-[4px] bg-[#2f2f2f] py-2 text-center text-[0.9375rem] text-[#f2f2f2]">
          Close
        </span>
      </div>
    </div>
  );
}

/**
 * The small preview inside the popup's settings: the next reminder worded as
 * its notification will be. Mirrors .notice-preview in extension popup.css.
 */
export function NoticePreview({ reminder = REMINDERS[0], layout = "compact" }: { reminder?: Reminder; layout?: NotificationLayout }) {
  const message = layout === "expanded" && reminder.reflection ? `${reminder.supporting}\n${reminder.reflection}` : reminder.supporting;
  return (
    <div
      role="img"
      aria-label={`${reminder.title} ${message.replace("\n", " ")}`}
      className="mt-1.5 grid grid-cols-[48px_minmax(0,1fr)] items-start gap-3 rounded-[var(--radius-sticker)] border border-ink-hair bg-paper px-3 py-2.5"
    >
      <Image src={illustrationSrc(reminder, "icon")} alt="" width={192} height={192} className="h-12 w-12 rounded-[var(--radius-sticker-sm)]" />
      <span className="grid">
        <span className="font-display font-semibold text-[15px] leading-[1.25]">{reminder.title}</span>
        <span className="mt-0.5 text-[13px] leading-[1.4] text-ink-soft whitespace-pre-line">{message}</span>
      </span>
    </div>
  );
}
