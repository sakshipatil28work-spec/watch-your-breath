"use client";

import { chevronDataUri } from "@/illustrations/glyphs";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<"select">, "className"> & { className?: string };

/** A native select drawn as a written line with an ink chevron. */
export function Select({ className, children, ...rest }: Props) {
  return (
    <select
      className={["control-line cursor-pointer pr-6 text-right min-w-[8rem]", className].filter(Boolean).join(" ")}
      style={{
        backgroundImage: `url("${chevronDataUri}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 2px center",
        backgroundSize: "14px 14px",
        direction: "rtl",
        textAlignLast: "right",
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
