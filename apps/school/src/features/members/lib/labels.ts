import { MOCK_NOW, type MemberRole, type MemberStatus } from "@/core/mocks/fake-data";
import { formatShortDate, formatTime } from "@/lib/format";

export const ROLE_LABELS: Record<MemberRole, string> = {
  OWNER: "Fondateur",
  SCHOOL_ADMIN: "Administration",
  CASHIER: "Caissier",
  ACCOUNTANT: "Comptable",
  TEACHER: "Enseignant",
};

export const ROLE_TONES: Record<MemberRole, string> = {
  OWNER: "bg-payskool-navy text-white",
  SCHOOL_ADMIN: "bg-violet-100 text-violet-700",
  CASHIER: "bg-payskool-orange/10 text-payskool-orange",
  ACCOUNTANT: "bg-amber-100 text-amber-700",
  TEACHER: "bg-cyan-100 text-cyan-700",
};

export const STATUS_LABELS: Record<MemberStatus, string> = {
  ACTIVE: "Actif",
  INVITED: "Invitation",
  SUSPENDED: "Suspendu",
};

export const STATUS_TONES: Record<MemberStatus, string> = {
  ACTIVE: "bg-payskool-emerald/10 text-payskool-emerald",
  INVITED: "bg-amber-100 text-amber-700",
  SUSPENDED: "bg-red-100 text-red-700",
};

const DAY = 24 * 3600 * 1000;

/** Libellé d'activité relatif à la date de référence de la démo (MOCK_NOW). */
export function lastActiveLabel(lastActiveAt: string): string {
  if (!lastActiveAt) return "Jamais connecté";
  const at = new Date(lastActiveAt);
  const now = MOCK_NOW;
  const days = Math.floor((now.getTime() - at.getTime()) / DAY);
  if (days <= 0) return `Aujourd'hui à ${formatTime(lastActiveAt)}`;
  if (days === 1) return `Hier à ${formatTime(lastActiveAt)}`;
  return `${formatShortDate(lastActiveAt.slice(0, 10))} · ${formatTime(lastActiveAt)}`;
}