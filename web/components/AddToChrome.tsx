import { ButtonLink } from "./Button";
import { SITE, COPY } from "@/lib/site";

/** The primary action. Points at the store listing once it exists, at the install note until then. */
export function AddToChrome({ className }: { className?: string }) {
  const href = SITE.chromeStoreUrl ?? "#install";
  const external = Boolean(SITE.chromeStoreUrl);
  return (
    <ButtonLink
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
    >
      {COPY.addToChrome}
    </ButtonLink>
  );
}
