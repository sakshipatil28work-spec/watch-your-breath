import Image from "next/image";

const FADE_RIGHT =
  "linear-gradient(to right, transparent 0%, #000 22%, #000 100%), linear-gradient(to top, transparent 0%, #000 26%)";
const FADE_LEFT =
  "linear-gradient(to left, transparent 0%, #000 22%, #000 100%), linear-gradient(to top, transparent 0%, #000 26%)";

/**
 * The sweep of wind lines cut from the right of the drawing
 * (public/illustrations/flow.png). Its cut edges fade into the paper so the
 * line reads as passing through, carrying the emblem's flow between sections.
 */
export function Flow({ className, flip = false }: { className?: string; flip?: boolean }) {
  const mask = flip ? FADE_LEFT : FADE_RIGHT;
  return (
    <div className={["pointer-events-none select-none", className].filter(Boolean).join(" ")} aria-hidden="true">
      <Image
        src="/illustrations/flow.png"
        alt=""
        width={490}
        height={198}
        className={["w-full h-auto opacity-90", flip ? "-scale-x-100" : ""].join(" ")}
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
    </div>
  );
}
