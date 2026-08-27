import { FAKE_USER, MOCK_NOW, type MemberRole } from "@/core/mocks/fake-data";

/** Préférences & sécurité du profil de l'utilisateur connecté (démo). */
export type PreferredLanguage = "fr" | "en";

export interface FakeUserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: MemberRole;
  joinedAt: string;
  lastActiveAt: string;
  language: PreferredLanguage;
  twoFactorEnabled: boolean;
}

export interface FakeUserSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  current: boolean;
  lastActiveAt: string;
}

let profile: FakeUserProfile = {
  id: FAKE_USER.id,
  name: FAKE_USER.name,
  email: FAKE_USER.email,
  phone: "+237 654 00 12 34",
  role: "OWNER",
  joinedAt: "2024-09-01",
  lastActiveAt: MOCK_NOW.toISOString(),
  language: "fr",
  twoFactorEnabled: true,
};

let sessions: FakeUserSession[] = [
  {
    id: "ses_01",
    device: "MacBook Pro · Chrome 126",
    location: "Douala (Akwa)",
    ip: "41.202.128.41",
    current: true,
    lastActiveAt: MOCK_NOW.toISOString(),
  },
  {
    id: "ses_02",
    device: "iPhone 14 · Application",
    location: "Douala (Bonapriso)",
    ip: "102.245.20.17",
    current: false,
    lastActiveAt: new Date(MOCK_NOW.getTime() - 26 * 3600 * 1000).toISOString(),
  },
  {
    id: "ses_03",
    device: "PC de la caisse · Firefox 128",
    location: "Douala (Akwa)",
    ip: "41.202.120.09",
    current: false,
    lastActiveAt: new Date(MOCK_NOW.getTime() - 2.5 * 24 * 3600 * 1000).toISOString(),
  },
];

const clone = <T,>(v: T): T => (typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

export function fetchProfile(): Promise<FakeUserProfile> {
  return new Promise((resolve) => setTimeout(() => resolve(clone(profile)), 200));
}

export function patchProfile(patch: Partial<FakeUserProfile>): FakeUserProfile | null {
  profile = { ...profile, ...patch };
  return clone(profile);
}

export function fetchSessions(): Promise<FakeUserSession[]> {
  return new Promise((resolve) => setTimeout(() => resolve(clone(sessions)), 200));
}

export function revokeSession(sessionId: string): void {
  sessions = sessions.filter((s) => s.id !== sessionId);
}