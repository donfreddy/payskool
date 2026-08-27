import { MOCK_NOW, type FakeStudent } from "@/core/mocks/fake-data";

/**
 * Statut de paiement dérivé d'un élève — source de vérité pour tous les écrans.
 * `OVERDUE` prend le dessus dès qu'une tranche échue n'est pas soldée.
 */
export type PaymentStatus = "PAID" | "AHEAD" | "PARTIAL" | "OVERDUE" | "UNPAID";

export interface StudentBalance {
  /** Total réellement dû après réduction, arriérés inclus. */
  totalDue: number;
  /** Déjà réglé (paiements + avances de l'année précédente). */
  paid: number;
  /** Reste à encaisser. */
  remaining: number;
  /** Part des tranches couverte, 0 → 1. */
  progress: number;
  status: PaymentStatus;
  arrears: number;
  advance: number;
  hasOverdue: boolean;
}

export function isInstallmentOverdue(
  dueDate: string,
  paid: number,
  amount: number,
  now: Date = MOCK_NOW,
): boolean {
  return paid < amount && new Date(`${dueDate}T00:00:00`) < now;
}

export function computeStudentBalance(student: FakeStudent, now: Date = MOCK_NOW): StudentBalance {
  const plan = student.feePlan;
  const gross = plan.installments.reduce((sum, i) => sum + i.amount, 0);
  const arrears = student.previousBalance < 0 ? -student.previousBalance : 0;
  const advance = student.previousBalance > 0 ? student.previousBalance : 0;
  const totalDue = Math.max(gross - (plan.discountAmount ?? 0) + arrears, 0);
  const paidGross = plan.installments.reduce((sum, i) => sum + i.paid, 0) + advance;
  const paid = Math.min(paidGross, totalDue);
  const remaining = totalDue - paid;

  const overdue = plan.installments.some((i) => isInstallmentOverdue(i.dueDate, i.paid, i.amount, now));

  let status: PaymentStatus;
  if (remaining <= 0) status = "PAID";
  else if (overdue && paid === 0) status = "UNPAID";
  else if (overdue) status = "OVERDUE";
  else if (paid > 0) status = paidGross >= totalDue ? "PAID" : "AHEAD";
  else status = "PARTIAL";

  return {
    totalDue,
    paid,
    remaining,
    progress: totalDue > 0 ? Math.min(paid / totalDue, 1) : 1,
    status,
    arrears,
    advance,
    hasOverdue: overdue,
  };
}

/**
 * Allocation FIFO : un encaissement se ventile tranche par tranche dans
 * l'ordre de l'échéancier (la plus ancienne d'abord).
 */
export function allocateFIFO(student: FakeStudent, amount: number): { installmentId: string; amount: number }[] {
  const allocations: { installmentId: string; amount: number }[] = [];
  let rest = amount;
  for (const i of student.feePlan.installments) {
    if (rest <= 0) break;
    const remainingOnInstallment = Math.max(i.amount - i.paid, 0);
    if (remainingOnInstallment <= 0) continue;
    const allocated = Math.min(remainingOnInstallment, rest);
    allocations.push({ installmentId: i.id, amount: allocated });
    rest -= allocated;
  }
  return allocations;
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PAID: "Payé",
  AHEAD: "À jour",
  PARTIAL: "Partiel",
  OVERDUE: "En retard",
  UNPAID: "Impayé",
};