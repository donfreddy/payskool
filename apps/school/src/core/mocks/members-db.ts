import { FAKE_MEMBERS, type FakeMember } from "@/core/mocks/fake-data";

/**
 * "Base en mémoire" du domaine Membres & équipe.
 * Le futur backend (apps/api) remplacera ces fonctions sans changer les écrans
 * (GET/PATCH /schools/:id/members, POST /invitations).
 */

let members: FakeMember[] = FAKE_MEMBERS.map((m) => ({ ...m }));

const clone = <T,>(v: T): T => (typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

export function fetchMembers(): Promise<FakeMember[]> {
  return new Promise((resolve) => setTimeout(() => resolve(clone(members)), 240));
}

export function patchMember(memberId: string, patch: Partial<FakeMember>): FakeMember | null {
  const index = members.findIndex((m) => m.id === memberId);
  if (index < 0) return null;
  members[index] = { ...members[index]!, ...patch };
  return clone(members[index]);
}

let seq = FAKE_MEMBERS.length + 1;

export function addMember(draft: Omit<FakeMember, "id" | "status" | "lastActiveAt">): FakeMember {
  const entry: FakeMember = {
    ...draft,
    id: `mem_${String(seq++).padStart(2, "0")}`,
    status: "INVITED",
    lastActiveAt: "",
  };
  members.unshift(entry);
  return clone(entry);
}

export function removeMember(memberId: string): void {
  members = members.filter((m) => m.id !== memberId);
}