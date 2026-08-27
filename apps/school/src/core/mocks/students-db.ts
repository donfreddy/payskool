import {
  FAKE_CAISSE_TODAY,
  FAKE_STUDENTS,
  FAKE_TODAY_TRANSACTIONS,
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
  seeded = true;
}

export function fetchStudents(): Promise<FakeStudent[]> {
  seed();
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

export function addStudent(student: FakeStudent): void {
  seed();
  students.unshift(student);
}

export function prependTransaction(txn: FakeTx): void {
  seed();
  txns = [txn, ...txns];
}

export function registerCaisse(collected: number, method: "CASH" | "CHEQUE"): void {
  seed();
  caisse.collected += collected;
  caisse.txCount += 1;
  caisse.byMethod[method] += collected;
}