"use client";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** id of the element that labels the switch */
  labelledBy: string;
  describedBy?: string;
  className?: string;
};

/** A hand-drawn pill switch. The word beside it says the state, so colour is never the only signal. */
export function Toggle({ checked, onChange, labelledBy, describedBy, className }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className={[
        "inline-flex items-center gap-2 rounded-[var(--radius-pill)] p-0.5 pl-1 text-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "relative inline-block h-6 w-[42px] rounded-[var(--radius-pill)] border-[1.5px] border-ink transition-colors duration-200",
          checked ? "bg-clay-wash" : "bg-transparent",
        ].join(" ")}
      >
        <span
          className={[
            "absolute left-[2px] top-[2px] h-[17px] w-[17px] transition-[transform,background-color] duration-[220ms] motion-safe-only",
            "rounded-[62%_38%_55%_45%_/_45%_55%_40%_60%]",
            checked ? "translate-x-[18px] rotate-[12deg] bg-rust" : "",
          ].join(" ")}
          style={{
            transitionTimingFunction: "var(--ease-out-soft)",
            backgroundImage: checked ? "none" : "url(/illustrations/ring.png)",
            backgroundSize: "100% 100%",
          }}
        />
      </span>
      <span className={["min-w-[22px] text-[0.9375rem]", checked ? "font-medium text-ink" : "text-ink-soft"].join(" ")}>
        {checked ? "On" : "Off"}
      </span>
    </button>
  );
}
