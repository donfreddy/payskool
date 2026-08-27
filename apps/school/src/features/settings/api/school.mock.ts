import {
  fetchSchoolProfile,
  patchSchoolProfile,
  type FakeSchoolProfile,
} from "@/core/mocks/school-db";

/** Couche d'accès simulée de la fiche école (GET/PATCH /schools/:id). */

export function getSchool(_schoolId: string): Promise<FakeSchoolProfile | null> {
  return fetchSchoolProfile(_schoolId);
}

export function saveSchool(
  schoolId: string,
  patch: Partial<FakeSchoolProfile>,
): Promise<FakeSchoolProfile | null> {
  return Promise.resolve(patchSchoolProfile(schoolId, patch));
}