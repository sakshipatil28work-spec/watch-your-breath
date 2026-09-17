// Pure scheduling logic. No Chrome APIs here so it can be reasoned about and tested.

import { intervalMinutes, type Settings } from "./settings.ts";

const MIN = 60_000;

export function parseTime(hhmm: string): { h: number; m: number } {
  const [h, m] = hhmm.split(":").map(Number);
  return { h, m };
}

type Quiet = Pick<Settings, "quietStart" | "quietEnd"> & { quietEnabled?: boolean };

export function quietHoursEnabled(s: Quiet): boolean {
  return s.quietEnabled !== false && s.quietStart !== s.quietEnd;
}

/** Minutes since local midnight for a Date. */
function minutesOfDay(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

function toMinutes(hhmm: string): number {
  const { h, m } = parseTime(hhmm);
  return h * 60 + m;
}

/** True when `at` falls inside quiet hours (handles ranges that cross midnight). */
export function isQuiet(at: Date, s: Quiet): boolean {
  if (!quietHoursEnabled(s)) return false;
  const now = minutesOfDay(at);
  const start = toMinutes(s.quietStart);
  const end = toMinutes(s.quietEnd);
  if (start < end) return now >= start && now < end;
  // crosses midnight, e.g. 22:00 → 07:00
  return now >= start || now < end;
}

/** The next moment quiet hours end, at or after `at`. Assumes isQuiet(at) is true. */
export function quietEndAfter(at: Date, s: Quiet): Date {
  const { h, m } = parseTime(s.quietEnd);
  const end = new Date(at);
  end.setHours(h, m, 0, 0);
  if (end.getTime() <= at.getTime()) end.setDate(end.getDate() + 1);
  return end;
}

/**
 * Compute when the next reminder should fire.
 * - base: now + interval
 * - randomize: the interval is stretched or shortened by up to 25 %, so a
 *   1-hour reminder lands somewhere between 45 and 75 minutes from now.
 * - quiet hours: a reminder that would land inside them moves to just after
 *   they end (plus a few random minutes when randomize is on).
 */
export function computeNextFire(now: Date, s: Settings, rand: () => number = Math.random): Date {
  const interval = intervalMinutes(s) * MIN;
  let delay = interval;
  if (s.randomize) {
    const factor = 0.75 + rand() * 0.5; // 0.75 … 1.25
    delay = Math.round(interval * factor);
  }
  let next = new Date(now.getTime() + delay);
  if (isQuiet(next, s)) {
    next = quietEndAfter(next, s);
    if (s.randomize) next = new Date(next.getTime() + Math.round(rand() * 15 * MIN));
  }
  // never sooner than one minute from now (Chrome's floor for packed extensions)
  if (next.getTime() - now.getTime() < MIN) next = new Date(now.getTime() + MIN);
  return next;
}

export function formatInterval(s: Settings): string {
  const m = intervalMinutes(s);
  if (m % 60 === 0) {
    const h = m / 60;
    return h === 1 ? "1 hour" : `${h} hours`;
  }
  if (m > 60) {
    const h = Math.floor(m / 60);
    const rest = m % 60;
    return `${h} h ${rest} min`;
  }
  return `${m} minutes`;
}

export function formatClock(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase();
}

export function formatHHMM(hhmm: string): string {
  const { h, m } = parseTime(hhmm);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return formatClock(d);
}
