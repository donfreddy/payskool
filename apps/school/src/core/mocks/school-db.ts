/** Fiche d'identité d'une école — la démo en partage trois. */
export interface FakeSchoolProfile {
  id: string;
  name: string;
  logo: string;
  type: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  currency: "XAF";
  academicYear: string;
  foundedYear: number;
  principalName: string;
}

export const FAKE_SCHOOL_PROFILES: FakeSchoolProfile[] = [
  {
    id: "cs-sainte-marie",
    name: "CS Sainte-Marie",
    logo: "🏫",
    type: "Complexe scolaire primaire & secondaire",
    city: "Douala - Akwa",
    address: "Rue des Écoles, BP 1254 Douala",
    phone: "+237 233 42 18 60",
    email: "contact@cs-sainte-marie.cm",
    website: "cs-sainte-marie.cm",
    currency: "XAF",
    academicYear: "2026-2027",
    foundedYear: 1998,
    principalName: "Mme Awa Koné",
  },
  {
    id: "lycee-saint-paul",
    name: "Lycée Saint-Paul",
    logo: "🏛️",
    type: "Lycée d'enseignement général",
    city: "Yaoundé",
    address: "Avenue du Général-de-Gaulle, Yaoundé",
    phone: "+237 222 20 14 35",
    email: "contact@lycee-saint-paul.cm",
    website: "lycee-saint-paul.cm",
    currency: "XAF",
    academicYear: "2026-2027",
    foundedYear: 1985,
    principalName: "M. Paul Ngal",
  },
  {
    id: "maternelle-bisounours",
    name: "Maternelle les Bisounours",
    logo: "🧸",
    type: "École maternelle",
    city: "Douala - Bonanjo",
    address: "Boulevard de la République, Douala",
    phone: "+237 233 50 29 11",
    email: "contact@bisounours.cm",
    website: "bisounours.cm",
    currency: "XAF",
    academicYear: "2026-2027",
    foundedYear: 2016,
    principalName: "Mme Claire Nga",
  },
];

let schools: FakeSchoolProfile[] = FAKE_SCHOOL_PROFILES.map((s) => ({ ...s }));

const clone = <T,>(v: T): T => (typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

export function fetchSchoolProfile(schoolId: string): Promise<FakeSchoolProfile | null> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(clone(schools.find((s) => s.id === schoolId) ?? schools[0] ?? null)), 220),
  );
}

export function patchSchoolProfile(
  schoolId: string,
  patch: Partial<FakeSchoolProfile>,
): FakeSchoolProfile | null {
  const index = schools.findIndex((s) => s.id === schoolId);
  if (index < 0) return null;
  schools[index] = { ...schools[index]!, ...patch };
  return clone(schools[index]);
}