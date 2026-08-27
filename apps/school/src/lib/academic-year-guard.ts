import { redirect } from "next/navigation";

import {
  isPastAcademicYear,
  resolveAcademicYear,
} from "@/core/mocks/academic-years-db";

/** Renvoie l’année demandée, en forçant l’année en cours si l’année
 *  d’URL est absente/inconnue (lecture seule) sur une page d’écriture. */
export function requireCurrentAcademicYear(raw: string | null | undefined, pathname: string): string {
  const year = resolveAcademicYear(raw);
  if (isPastAcademicYear(year)) redirect(pathname);
  return year;
}

/** Année à consulter (lecture seule directe, années passées autorisées). */
export function consultAcademicYear(raw: string | null | undefined): string {
  return resolveAcademicYear(raw);
}