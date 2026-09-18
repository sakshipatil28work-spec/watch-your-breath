"use client";

import { useSyncExternalStore } from "react";
import { ButtonLink } from "./Button";
import { SITE, COPY } from "@/lib/site";

export type Browser = "chrome" | "edge" | "firefox" | "other";

/** The visitor's browser, read once from the user agent. "other" also covers the server render. */
function detect(): Browser {
  const ua = navigator.userAgent;
  if (/firefox|fxios/i.test(ua)) return "firefox";
  if (/edg\//i.test(ua)) return "edge";
  if (/chrome|chromium|crios/i.test(ua)) return "chrome";
  return "other";
}
const subscribe = () => () => {};
export const useBrowser = () => useSyncExternalStore(subscribe, detect, () => "other" as Browser);

/**
 * The primary action, named for the browser the visitor is in: "Add to Firefox"
 * in Firefox, "Add to Edge" in Edge, "Add to Chrome" in Chrome and its
 * relatives, and "Get the extension" anywhere else (or before we know). Points
 * at that browser's store listing once it exists, at the install note until then.
 */
export function AddToBrowser({
  className,
  variant = "primary",
}: {
  className?: string;
  variant?: "primary" | "secondary";
}) {
  const browser = useBrowser();
  const store = browser === "firefox" ? SITE.firefoxAddonUrl : SITE.chromeStoreUrl;
  const href = store ?? "#install";
  return (
    <ButtonLink
      href={href}
      variant={variant}
      className={className}
      {...(store ? { target: "_blank", rel: "noopener" } : {})}
    >
      {COPY.addTo[browser]}
    </ButtonLink>
  );
}
