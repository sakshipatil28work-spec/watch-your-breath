import { ext } from "./ext.ts";
// The reminder library. Copy and illustration are designed together: each
// entry names the one illustration that carries its meaning. Never recombine.
// Illustrations live in assets/illustrations/<illustrationId>.png, cut from the
// author’s sheet by illustrations/scripts/reminders.mjs.

export type IllustrationId =
  | "breath-flow"
  | "still-water"
  | "returning-flow"
  | "floating-leaf"
  | "sun-and-air"
  | "seated-presence"
  | "moon-flow"
  | "single-flow-line"
  | "three-ripples"
  | "wind-and-leaf"
  | "organic-circle-person"
  | "human-and-flow";

/** How the illustration may move, gently, in the card. One grammar, four verbs. */
export type Motion = "flow" | "ripple" | "drift" | "breathe";

export interface Reminder {
  id: string;
  title: string;
  supporting: string;
  /** Optional longer reflection, shown only when the user expands the card. */
  reflection?: string;
  illustrationId: IllustrationId;
  motion: Motion;
  /** One line describing the drawing, for screen readers. */
  alt: string;
}

export const REMINDERS: readonly Reminder[] = [
  {
    id: "watch-your-breath",
    title: "Watch your breath.",
    supporting: "Just a moment.",
    reflection: "Nothing to do. Nothing to fix. Simply notice this moment.",
    illustrationId: "breath-flow",
    motion: "flow",
    alt: "Flowing lines of air with a small leaf.",
  },
  {
    id: "nothing-to-change",
    title: "Nothing to change.",
    supporting: "Simply notice.",
    reflection: "The breath is already moving on its own. There is nothing to improve.",
    illustrationId: "still-water",
    motion: "ripple",
    alt: "A quiet pond with small ripples, a lotus and the sun.",
  },
  {
    id: "come-back",
    title: "Come back to the breath.",
    supporting: "It was here all along.",
    reflection: "Wherever attention went, the breath kept going. Return, and continue.",
    illustrationId: "returning-flow",
    motion: "flow",
    alt: "A path winding back through hills toward trees and the sun.",
  },
  {
    id: "a-little-pause",
    title: "A little pause.",
    supporting: "That’s all.",
    reflection: "One breath is enough. Then carry on with what you were doing.",
    illustrationId: "floating-leaf",
    motion: "drift",
    alt: "A single leaf carried on a current of air.",
  },
  {
    id: "already-here",
    title: "Notice what is already here.",
    supporting: "Stay for a moment.",
    reflection: "The body is breathing, the light is on the desk. Nothing is missing.",
    illustrationId: "sun-and-air",
    motion: "breathe",
    alt: "A warm sun over hills with air flowing across.",
  },
  {
    id: "be-here",
    title: "Breathe. Be here.",
    supporting: "Nothing else.",
    reflection: "No posture to hold, no count to keep. Simply being here.",
    illustrationId: "seated-presence",
    motion: "breathe",
    alt: "A seated figure with soft lines flowing around them.",
  },
  {
    id: "no-hurry",
    title: "No need to hurry.",
    supporting: "Let this moment be.",
    reflection: "The next thing will wait for one slow breath.",
    illustrationId: "moon-flow",
    motion: "drift",
    alt: "A crescent moon above clouds with slow flowing air.",
  },
  {
    id: "just-this-breath",
    title: "Only this breath.",
    supporting: "Just this moment.",
    reflection: "Not the last one, not the next one. This one.",
    illustrationId: "single-flow-line",
    motion: "flow",
    alt: "One continuous flowing line with a small leaf.",
  },
  {
    id: "pause-notice-continue",
    title: "Pause. Notice. Continue.",
    supporting: "Back to your day.",
    reflection: "A moment of noticing, then the day goes on. That is the whole thing.",
    illustrationId: "three-ripples",
    motion: "ripple",
    alt: "A drop meeting water, three ripples widening.",
  },
  {
    id: "let-it-move",
    title: "Let the breath move.",
    supporting: "Don’t force it.",
    reflection: "The breath knows its own pace. Let it come and go as it does.",
    illustrationId: "wind-and-leaf",
    motion: "flow",
    alt: "Leaves carried gently by flowing air.",
  },
  {
    id: "be-here-a-moment",
    title: "Be here for a moment.",
    supporting: "Notice your breath.",
    reflection: "Nothing to reach for. Simply notice the breath that is already here.",
    illustrationId: "organic-circle-person",
    motion: "breathe",
    alt: "A seated figure inside an imperfect circle of leaves.",
  },
  {
    id: "already-with-you",
    title: "Your breath is already with you.",
    supporting: "Simply notice.",
    reflection: "It has been with you all day. It will be with you after this.",
    illustrationId: "human-and-flow",
    motion: "drift",
    alt: "A calm profile with hair and lines flowing into the air.",
  },
];

export const REMINDER_IDS = REMINDERS.map((r) => r.id);

export function getReminder(id: string | null | undefined): Reminder {
  return REMINDERS.find((r) => r.id === id) ?? REMINDERS[0];
}

export function illustrationUrl(r: Reminder, variant: "card" | "icon" = "card"): string {
  const file = variant === "icon" ? `${r.illustrationId}-icon.png` : `${r.illustrationId}.png`;
  return ext.runtime.getURL(`assets/illustrations/${file}`);
}
