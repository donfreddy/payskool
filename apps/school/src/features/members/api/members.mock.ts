import type { FakeMember, MemberRole } from "@/core/mocks/fake-data";
import {
  addMember,
  fetchMembers,
  patchMember,
  removeMember,
} from "@/core/mocks/members-db";

/** Couche d'accès simulée du domaine Membres & équipe. */

export function listMembers(_schoolId: string): Promise<FakeMember[]> {
  return fetchMembers();
}

export function saveMember(
  _schoolId: string,
  memberId: string,
  patch: Partial<FakeMember>,
): Promise<FakeMember | null> {
  return Promise.resolve(patchMember(memberId, patch));
}

export interface InviteMemberDraft {
  name: string;
  email: string;
  phone: string;
  role: MemberRole;
}

export function inviteMember(
  _schoolId: string,
  draft: InviteMemberDraft,
): Promise<FakeMember> {
  return Promise.resolve(
    addMember({
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      role: draft.role,
      joinedAt: "2026-11-20",
    }),
  );
}

export function revokeMember(_schoolId: string, memberId: string): Promise<void> {
  removeMember(memberId);
  return Promise.resolve();
}