import { CURRENT_ACADEMIC_YEAR } from "@/core/mocks/academic-years-db";
import { MOCK_NOW, type FakeReceipt, type FakeTx } from "@/core/mocks/fake-data";
import { addReceipt, getStudentsSync, prependTransaction } from "@/core/mocks/students-db";
import type { OnlineOperator, OnlinePayment } from "@/features/payments/types";
import { allocateFIFO } from "@/lib/fees";

/**
 * Registre des paiements en ligne reçus à l'école.
 * Simule la file d'événements webhook des PSP (Orange Money, MTN MoMo, Wave)
 * configurés dans Paramètres → Intégrations Paiement.
 *
 * Le webhook PSP EST la confirmation du règlement (fonds crédités sur le
 * compte marchand) : il ne transporte que référence PSP, opérateur, montant
 * et NUMÉRO du parent. À réception, le système rattache le paiement à la
 * fiche élève via `parentPhone` puis émet automatiquement le reçu et le
 * mouvement comptable — aucune confirmation manuelle côté école.
 */

interface SeedEntry {
  ref: string;
  studentKey: string;
  amount: number;
  operator: OnlineOperator;
  daysAgo: number;
  receiptNumber?: string;
}

const SEED: SeedEntry[] = [
  {
    ref: "W-8841-2026",
    studentKey: "std_15", // Marc K. Junior — le "paiement" du portail parent
    amount: 40000,
    operator: "WAVE",
    daysAgo: 0,
    receiptNumber: "#REC-8944",
  },
  {
    ref: "OM-22190-2026",
    studentKey: "std_02", // Junior Kengni — acompte sur Tranche 3
    amount: 25000,
    operator: "ORANGE_MONEY",
    daysAgo: 0,
    receiptNumber: "#REC-8939",
  },
  {
    ref: "MTN-55210-2026",
    studentKey: "std_12", // Aïcha — reste Tranche 2
    amount: 75000,
    operator: "MTN_MOMO",
    daysAgo: 1,
    receiptNumber: "#REC-8938",
  },
  {
    ref: "W-8764-2026",
    studentKey: "std_09", // Brice — déjà reçu hier
    amount: 60000,
    operator: "WAVE",
    daysAgo: 1,
    receiptNumber: "#REC-8936",
  },
];

function isoDaysAgo(days: number): string {
  const date = new Date(MOCK_NOW);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

let opSeq = 1;
let receiptSeq = 45;

function credit(studentId: string, amount: number, operator: OnlineOperator, createdAt: string, ref: string): OnlinePayment {
  const student = getStudentsSync().find((s) => s.id === studentId);
  const number = `#REC-89${receiptSeq++}`;
  const allocations = student
    ? allocateFIFO(student, amount).map((a) => ({
        ...a,
        label: student.feePlan.installments.find((i) => i.id === a.installmentId)?.label ?? "Tranche",
      }))
    : [];

  const receipt: FakeReceipt = {
    id: `rec_${number.slice(1)}`,
    number,
    studentId: student?.id ?? "inconnu",
    studentName: student ? `${student.firstName} ${student.lastName}` : "Élève à rattacher",
    classLevel: student?.classLevel ?? "—",
    matricule: student?.matricule ?? "—",
    academicYear: student?.academicYear ?? CURRENT_ACADEMIC_YEAR,
    amount,
    method: operator,
    allocations,
    cashier: "Portail parent (webhook)",
    createdAt,
  };
  addReceipt(receipt);

  const txn: FakeTx = {
    id: `tx_web_${ref}`,
    studentId: student?.id ?? "inconnu",
    studentName: receipt.studentName,
    classLevel: receipt.classLevel,
    amount,
    method: operator,
    receipt: number,
    date: createdAt,
  };
  prependTransaction(txn);

  return {
    id: `op_${opSeq++}`,
    ref,
    studentId: student?.id ?? "inconnu",
    firstName: student?.firstName ?? "À rattacher",
    lastName: student?.lastName ?? "",
    classLevel: student?.classLevel ?? "—",
    matricule: student?.matricule ?? "—",
    gender: student?.gender ?? "F",
    academicYear: student?.academicYear ?? CURRENT_ACADEMIC_YEAR,
    amount,
    operator,
    phone: student?.parentPhone ?? "",
    parentName: student?.parentName ?? "—",
    createdAt,
    status: "SETTLED",
    receiptId: receipt.id,
    receiptNumber: number,
  };
}

function buildSeed(): OnlinePayment[] {
  return SEED.map((e, i) => {
    const payment = credit(e.studentKey, e.amount, e.operator, isoDaysAgo(e.daysAgo), e.ref);
    if (!e.receiptNumber) return payment;
    return {
      ...payment,
      id: `op_seed_${i + 1}`,
      receiptNumber: e.receiptNumber,
      receiptId: `rec_${e.receiptNumber.slice(1)}`,
    };
  });
}

let queue: OnlinePayment[] = buildSeed();

function persist(updated: OnlinePayment[]): void {
  queue = updated;
}

export function getOnlinePaymentsSync(): OnlinePayment[] {
  return queue;
}

export function listOnlinePayments(): Promise<OnlinePayment[]> {
  return Promise.resolve(queue);
}

/** Déclenche l'arrivée "live" d'un paiement parent : webhook reçu → encaissé. */
export function simulateParentPayment(): OnlinePayment {
  const candidates = getStudentsSync().filter((s) =>
    s.feePlan.installments.some((i) => i.paid < i.amount),
  );
  const student = candidates[Math.floor(Math.random() * candidates.length)] ?? candidates[0]!;
  const due = student.feePlan.installments.find((i) => i.paid < i.amount)!;
  const operators: OnlineOperator[] = ["ORANGE_MONEY", "MTN_MOMO", "WAVE"];
  const operator = operators[Math.floor(Math.random() * operators.length)]!;
  const ref = `${operator === "ORANGE_MONEY" ? "OM" : operator === "MTN_MOMO" ? "MTN" : "W"}-${1001 + opSeq}-2026`;
  const amount = Math.min(due.amount - due.paid, 50000);
  const payment = credit(student.id, amount, operator, isoDaysAgo(0), ref);
  persist([payment, ...queue]);
  return payment;
}

/** Incident école uniquement : remboursement d'un paiement encaissé (jamais.
 *  de "confirmation" : le webhook PSP fait foi). */
export function refundOnlinePayment(paymentId: string): OnlinePayment | null {
  const updated = queue.map((p) =>
    p.id === paymentId && p.status === "SETTLED" ? { ...p, status: "REFUNDED" as const } : p,
  );
  persist(updated);
  return updated.find((p) => p.id === paymentId) ?? null;
}