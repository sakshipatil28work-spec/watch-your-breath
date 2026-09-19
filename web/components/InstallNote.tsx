"use client";

import { useState } from "react";
import { ButtonLink } from "./Button";
import { SITE } from "@/lib/site";
import { useBrowser, type Browser } from "./AddToBrowser";

type Guide = {
  title: string;
  download: { label: string; href: string } | null;
  steps: React.ReactNode[];
  after: string;
};

/**
 * A browser-internal address. Web pages are not allowed to open chrome://
 * or about: addresses, so a link would do nothing; clicking this copies the
 * address instead, ready to paste into the address bar.
 */
function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard refused: the address is still selectable */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      title="Copy the address"
      className="inline-flex items-baseline gap-1.5 font-ui text-[0.95em] bg-cream px-1.5 py-0.5 rounded-[var(--radius-sticker-sm)] border border-ink-hair whitespace-nowrap cursor-copy transition-[background-color,transform] duration-150 [@media(hover:hover)]:hover:bg-paper active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
    >
      <code>{children}</code>
      <span aria-live="polite" className={["text-[0.8em] text-ink-soft", copied ? "" : "sr-only"].join(" ")}>
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}

/** Hand-install steps for each browser; the extension is not in any store yet. */
function guideFor(browser: Browser): Guide {
  const chromeLike = (name: string, page: string): Guide => ({
    title: `Not in the ${name} store yet. Two minutes to set up:`,
    download: { label: `Download for ${name}`, href: SITE.downloads.chrome },
    steps: [
      <>Unzip the file you downloaded.</>,
      <>
        Paste <Code>{page}</Code> into the address bar (click it to copy) and switch on{" "}
        <strong className="font-medium">Developer mode</strong> (top right).
      </>,
      <>
        Click <strong className="font-medium">Load unpacked</strong> and choose the unzipped folder.
      </>,
    ],
    after: "The first-run screen opens on its own.",
  });
  switch (browser) {
    case "chrome":
      return chromeLike("Chrome", "chrome://extensions");
    case "edge":
      return chromeLike("Edge", "edge://extensions");
    case "firefox":
      return {
        title: "Not on Firefox Add-ons yet. One minute to try it:",
        download: { label: "Download for Firefox", href: SITE.downloads.firefox },
        steps: [
          <>
            Paste <Code>about:debugging#/runtime/this-firefox</Code> into the address bar (click it to copy).
          </>,
          <>
            Click <strong className="font-medium">Load Temporary Add-on</strong> and choose the file you downloaded.
          </>,
        ],
        after: "The first-run screen opens on its own. Firefox forgets temporary add-ons when it closes, so this is for trying it out; the store listing will make it stay.",
      };
    default:
      return {
        title: "Not in the stores yet.",
        download: null,
        steps: [],
        after: `${SITE.browsers} Open this page in one of them and the steps appear here.`,
      };
  }
}

/**
 * The install card the primary button leads to. It names the visitor’s browser,
 * offers that browser’s packaged build, and lights up briefly when arrived at
 * by link (see #install:target in globals.css), so the click is seen to land.
 */
export function InstallNote() {
  const browser = useBrowser();
  const g = guideFor(browser);
  return (
    <div
      id="install"
      className="install-note mt-16 lg:mt-20 scroll-mt-6 max-w-[62ch] bg-paper border-[1.5px] border-ink-hair rounded-[var(--radius-sticker)] px-6 py-6 sm:px-8 sm:py-7"
    >
      <h3 className="font-display font-semibold text-[1.375rem] leading-tight text-balance">{g.title}</h3>
      {g.download && (
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <ButtonLink href={g.download.href} download className="px-5 py-3 text-[1rem]">
            {g.download.label}
          </ButtonLink>
          <span className="text-[0.875rem] text-ink-soft whitespace-nowrap">zip, about 2 MB</span>
        </div>
      )}
      {g.steps.length > 0 && (
        <ol className="mt-5 grid gap-2.5 text-[1rem] leading-relaxed list-none p-0 m-0 text-pretty">
          {g.steps.map((s, i) => (
            <li key={i} className="grid grid-cols-[1.75rem_1fr] gap-1 items-baseline">
              <span className="font-display font-semibold text-ochre tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft text-pretty">{g.after}</p>
    </div>
  );
}
