import {
  isPastAcademicYear,
  resolveAcademicYear,
  type AcademicYear,
} from "@/core/mocks/academic-years-db";

/** Année à consulter (lecture seule directe, années passées autorisées). */
export function consultAcademicYear(raw: string | null | undefined): AcademicYear {
  return resolveAcademicYear(raw);
}

/** Vrai quand l’année consultée est une année passée : lecture seule. */
export function isReadOnlyAcademicYear(year: AcademicYear): boolean {
  return isPastAcademicYear(year);
}