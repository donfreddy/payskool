import { getArchiveYear } from "@/core/mocks/academic-archive-db";
import { CURRENT_ACADEMIC_YEAR, type AcademicYear } from "@/core/mocks/academic-years-db";
import {
  FAKE_CAISSE_TODAY,
  FAKE_FEE_STRUCTURES,
  FAKE_RECEIPTS,
  FAKE_STUDENTS,
  FAKE_TODAY_TRANSACTIONS,
  type FakeFeePlan,
  type FakeFeeStructure,
  type FakeReceipt,
  type FakeStudent,
  type FakeTx,
} from "@/core/mocks/fake-data";

/**
 * "Base en mémoire" de la démo — le futur backend (apps/api via @payskool/api-client)
 * remplacera ces fonctions sans changer les écrans. Rien ici n'est du domaine métier :
 * c'est uniquement un stockage de transit pour la démo.
 */

let seeded = false;
const students: FakeStudent[] = [];
let txns: FakeTx[] = [];
let receipts: FakeReceipt[] = [];
let feeStructures: FakeFeeStructure[] = [];
let caisse = { ...FAKE_CAISSE_TODAY };

export interface DailyCaisse {
  opener: string;
  float: number;
  collected: number;
  txCount: number;
  byMethod: { CASH: number; CHEQUE: number };
}

function seed() {
  if (seeded) return;
  students.push(...FAKE_STUDENTS.map((s) => structuredClone(s)));
  txns = FAKE_TODAY_TRANSACTIONS.map((t) => structuredClone(t));
  receipts = FAKE_RECEIPTS.map((r) => structuredClone(r));
  feeStructures = FAKE_FEE_STRUCTURES.map((s) => structuredClone(s));
  seeded = true;
}

export function fetchStudents(year: AcademicYear = CURRENT_ACADEMIC_YEAR): Promise<FakeStudent[]> {
  seed();
  const archive = getArchiveYear(year);
  if (year !== CURRENT_ACADEMIC_YEAR) {
    return new Promise((resolve) => setTimeout(() => resolve(archive?.students.map((s) => structuredClone(s)) ?? []), 380));
  }
  return new Promise((resolve) => setTimeout(() => resolve(students.slice()), 380));
}

export function fetchTodayTransactions(): Promise<FakeTx[]> {
  seed();
  return new Promise((resolve) => setTimeout(() => resolve(txns.slice()), 260));
}

export function fetchDailyCaisse(): Promise<DailyCaisse> {
  seed();
  return new Promise((resolve) => setTimeout(() => resolve({ ...caisse }), 220));
}

export function getStudentsSync(): FakeStudent[] {
  seed();
  return students;
}

export function getTransactionsSync(): FakeTx[] {
  seed();
  return txns;
}

export function fetchReceipts(year: AcademicYear = CURRENT_ACADEMIC_YEAR): Promise<FakeReceipt[]> {
  seed();
  const archive = getArchiveYear(year);
  if (year !== CURRENT_ACADEMIC_YEAR) {
    return new Promise((resolve) => setTimeout(() => resolve(archive?.receipts.map((r) => structuredClone(r)) ?? []), 300));
  }
  return new Promise((resolve) => setTimeout(() => resolve(receipts.filter((r) => r.academicYear === year).slice()), 300));
}

export function getReceiptsSync(): FakeReceipt[] {
  seed();
  return receipts;
}

export function fetchTransactionsHistory(year: AcademicYear = CURRENT_ACADEMIC_YEAR): Promise<FakeTx[]> {
  seed();
  return fetchReceipts(year).then((rs) =>
    rs.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      studentName: r.studentName,
      classLevel: r.classLevel,
      amount: r.amount,
      method: r.method,
      receipt: r.number,
      date: r.createdAt,
    })),
  );
}

export function addStudent(student: FakeStudent): void {
  seed();
  students.unshift(student);
}

export function patchStudent(studentId: string, patch: Partial<Omit<FakeStudent, "feePlan">> & { feePlan?: Partial<FakeFeePlan> }): void {
  seed();
  const index = students.findIndex((s) => s.id === studentId);
  if (index >= 0) {
    const current = students[index]!;
    students[index] = {
      ...current,
      ...patch,
      feePlan: patch.feePlan ? { ...current.feePlan, ...patch.feePlan } : current.feePlan,
    };
  }
}

export function fetchFeeStructures(): Promise<FakeFeeStructure[]> {
  seed();
  return new Promise((resolve) => setTimeout(() => resolve(feeStructures.slice()), 260));
}

export function patchFeeStructure(
  structureId: string,
  installments: FakeFeeStructure["installments"],
): void {
  seed();
  const index = feeStructures.findIndex((s) => s.id === structureId);
  if (index >= 0) {
    const structure = feeStructures[index]!;
    feeStructures[index] = {
      ...structure,
      total: installments.reduce((sum, i) => sum + i.amount, 0),
      installments: installments.map((i) => ({ ...i })),
    };
  }
}

export function prependTransaction(txn: FakeTx): void {
  seed();
  txns = [txn, ...txns];
}

export function addReceipt(receipt: FakeReceipt): void {
  seed();
  receipts = [receipt, ...receipts];
}

export function registerCaisse(collected: number, method: "CASH" | "CHEQUE"): void {
  seed();
  caisse.collected += collected;
  caisse.txCount += 1;
  caisse.byMethod[method] += collected;
}