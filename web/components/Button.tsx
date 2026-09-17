import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "quiet";

const base =
  "inline-flex items-center justify-center gap-2 font-ui font-medium leading-none transition-[transform,background-color,color] duration-150 ease-out motion-safe:[@media(hover:hover)]:hover:-translate-y-px active:scale-[0.97] disabled:opacity-50 disabled:cursor-default disabled:hover:translate-y-0 disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  primary:
    "bg-rust-deep text-cream border-[1.5px] border-rust-deep hover:bg-rust-deeper hover:border-rust-deeper rounded-[var(--radius-sticker-sm)] px-6 py-3.5 text-[1.0625rem]",
  secondary:
    "bg-transparent text-ink border-[1.5px] border-ink rounded-[var(--radius-sticker-sm)] px-6 py-3.5 text-[1.0625rem] hover:bg-paper",
  quiet:
    "bg-transparent text-ink px-1 py-1 underline decoration-[1.5px] underline-offset-[6px] decoration-ink-faint hover:decoration-rust text-[1.0625rem]",
};

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };
type LinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function Button({ variant = "primary", className, ...rest }: ButtonProps) {
  return <button className={[base, variants[variant], className].filter(Boolean).join(" ")} {...rest} />;
}

export function ButtonLink({ variant = "primary", className, ...rest }: LinkProps) {
  return <Link className={[base, variants[variant], className].filter(Boolean).join(" ")} {...rest} />;
}
