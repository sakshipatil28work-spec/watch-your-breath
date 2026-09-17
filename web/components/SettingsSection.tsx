import type { ReactNode } from "react";

type Props = { title: string; hint?: string; children: ReactNode; id?: string; marked?: boolean };

/** A settings group: a display-face heading, an optional hint, and its rows. No box. `marked` adds the sage mark (quiet hours active). */
export function SettingsSection({ title, hint, children, id, marked = false }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section aria-labelledby={headingId} className="grid gap-2.5 mt-5 first:mt-0">
      <h3 id={headingId} className="font-display font-semibold text-[1.0625rem] leading-tight">
        {title}
        {marked && (
          <span
            aria-hidden="true"
            className="inline-block w-[9px] h-[9px] ml-2.5 align-[2px] bg-sage rounded-[55%_45%_50%_50%_/_48%_52%_48%_52%]"
          />
        )}
      </h3>
      {hint && <p className="text-[0.8125rem] leading-snug text-ink-soft -mt-1">{hint}</p>}
      {children}
    </section>
  );
}
