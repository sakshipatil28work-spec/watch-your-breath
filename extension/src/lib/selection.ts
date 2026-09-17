// Which reminder comes next. Pure: no Chrome APIs.
//
// A cycle is a shuffled list of every reminder id. We take from the front until
// it is empty, then reshuffle. The same reminder never shows twice in a row,
// even across the boundary between cycles.

import { REMINDER_IDS } from "./reminders.ts";

export interface CycleState {
  /** ids still to be shown in this cycle, in order */
  cycle: string[];
  /** id of the reminder shown most recently */
  lastReminderId: string | null;
}

export function shuffle<T>(items: readonly T[], rand: () => number = Math.random): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Returns the next reminder id and the state to store. */
export function pickNext(state: CycleState, rand: () => number = Math.random): { id: string; state: CycleState } {
  // drop anything the library no longer knows
  let cycle = state.cycle.filter((id) => REMINDER_IDS.includes(id));
  if (cycle.length === 0) {
    cycle = shuffle(REMINDER_IDS, rand);
    // never repeat the last one across the cycle boundary
    if (cycle.length > 1 && cycle[0] === state.lastReminderId) {
      const swapWith = 1 + Math.floor(rand() * (cycle.length - 1));
      [cycle[0], cycle[swapWith]] = [cycle[swapWith], cycle[0]];
    }
  }
  const [id, ...rest] = cycle;
  return { id, state: { cycle: rest, lastReminderId: id } };
}
