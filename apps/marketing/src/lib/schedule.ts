/**
 * The demo instalment and the reminder moments a school can switch on. The
 * moments mirror the product: one pre-due reminder, at 1, 3, 5 or 7
 * days (a single setting), and follow-ups at 1, 7 and 30 days after it.
 */

/** Instalment 2 of the demo pupil is due on Thursday 15 October 2026. */
export const DEMO_DUE_DATE = Date.UTC(2026, 9, 15);

const DAY = 24 * 60 * 60 * 1000;

export type MomentKind = "before" | "after";

export interface Moment {
  id: string;
  kind: MomentKind;
  days: number;
}

export const MOMENTS: readonly Moment[] = [
  { id: "b7", kind: "before", days: 7 },
  { id: "b5", kind: "before", days: 5 },
  { id: "b3", kind: "before", days: 3 },
  { id: "b1", kind: "before", days: 1 },
  { id: "a1", kind: "after", days: 1 },
  { id: "a7", kind: "after", days: 7 },
  { id: "a30", kind: "after", days: 30 },
];

/** Switched on by default, as in the product. */
export const DEFAULT_MOMENTS: readonly string[] = ["b3", "a1", "a7", "a30"];

export function momentTime(moment: Moment, due = DEMO_DUE_DATE): number {
  return due + (moment.kind === "before" ? -moment.days : moment.days) * DAY;
}

/** Chronological order, whatever order the moments were ticked in. */
export function sortMoments(ids: Iterable<string>): Moment[] {
  const wanted = new Set(ids);
  return MOMENTS.filter((moment) => wanted.has(moment.id)).sort(
    (a, b) => momentTime(a) - momentTime(b),
  );
}

/** "15 oct." in French, "15 Oct" in English; UTC so server and client agree. */
export function formatShortDate(locale: string, time: number): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(time);
}
