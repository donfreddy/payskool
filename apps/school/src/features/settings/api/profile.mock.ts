import {
  fetchProfile,
  fetchSessions,
  patchProfile,
  revokeSession,
  type FakeUserProfile,
  type FakeUserSession,
  type PreferredLanguage,
} from "@/core/mocks/profile-db";

/** Couche d'accès simulée du profil connecté (GET/PATCH /profile, GET /sessions). */

export function getProfile(_schoolId: string): Promise<FakeUserProfile> {
  return fetchProfile();
}

export function saveProfile(
  _schoolId: string,
  patch: Partial<FakeUserProfile>,
): Promise<FakeUserProfile | null> {
  return Promise.resolve(patchProfile(patch));
}

export function listSessions(_schoolId: string): Promise<FakeUserSession[]> {
  return fetchSessions();
}

export function revokeSessionById(_schoolId: string, sessionId: string): Promise<void> {
  revokeSession(sessionId);
  return Promise.resolve();
}

export type { PreferredLanguage };