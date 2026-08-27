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