import Image from "next/image";

type Props = {
  className?: string;
  /** Run the nine-second breath. */
  breathing?: boolean;
  /** Accessible name; empty string marks it decorative. */
  label?: string;
};

/**
 * The breath emblem: the ring cut from the hand-drawn illustration
 * (public/illustrations/ring.png, made by illustrations/scripts/crop.mjs).
 */
export function Emblem({ className, breathing = true, label = "" }: Props) {
  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      <Image
        src="/illustrations/ring.png"
        alt={label}
        width={388}
        height={388}
        className={["w-full h-auto", breathing ? "emblem-breath" : ""].join(" ")}
      />
    </div>
  );
}
