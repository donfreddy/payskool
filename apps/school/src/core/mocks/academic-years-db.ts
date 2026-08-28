/** Années académiques de la démo.
 * Source de vérité du sélecteur du header : les écrans consultent l’année
 * transmise en `?year=` (URLSearchParams) ; l’année en cours est amendable,
 * les années passées sont en lecture seule.
 */

export type AcademicYear = string;

export const CURRENT_ACADEMIC_YEAR = "2026-2027";

/** Années disponibles, de la plus récente à la plus ancienne. */
export const ACADEMIC_YEARS: AcademicYear[] = ["2026-2027", "2025-2026", "2024-2025"];

export function isPastAcademicYear(year: AcademicYear): boolean {
  return year !== CURRENT_ACADEMIC_YEAR && ACADEMIC_YEARS.includes(year);
}

export function isKnownAcademicYear(year: string): boolean {
  return ACADEMIC_YEARS.includes(year);
}

/** Renvoie l’année demandée si elle existe, sinon l’année en cours. */
export function resolveAcademicYear(raw: string | null | undefined): AcademicYear {
  return raw && isKnownAcademicYear(raw) ? raw : CURRENT_ACADEMIC_YEAR;
}

function shiftYear(year: AcademicYear, delta: number): AcademicYear {
  const [a, b] = year.split("-").map((p) => Number.parseInt(p, 10));
  if (a && b && b === a + 1) return `${a + delta}-${b + delta}`;
  return year;
}

/** Année précédente (2026-2027 → 2025-2026), année passée connue sinon elle-même. */
export function previousAcademicYear(year: AcademicYear): AcademicYear {
  const idx = ACADEMIC_YEARS.indexOf(year);
  if (idx >= 0 && idx < ACADEMIC_YEARS.length - 1) return ACADEMIC_YEARS[idx + 1]!;
  return shiftYear(year, -1);
}

/** Année suivante (2026-2027 → 2027-2028), hors catalogue si inconnue. */
export function nextAcademicYearFor(year: AcademicYear): AcademicYear {
  const idx = ACADEMIC_YEARS.indexOf(year);
  if (idx > 0) return ACADEMIC_YEARS[idx - 1]!;
  return shiftYear(year, 1);
}