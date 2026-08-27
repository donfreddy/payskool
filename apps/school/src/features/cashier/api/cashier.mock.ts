import type { FakeStudent, FakeTx } from "@/core/mocks/fake-data";
import type { DailyCaisse } from "@/core/mocks/students-db";
import {
  addReceipt,
  fetchDailyCaisse,
  fetchStudents,
  fetchTodayTransactions,
  prependTransaction,
} from "@/core/mocks/students-db";
import type { ReceiptRecord } from "@/features/cashier/types";

/**
 * Couche d'accès simulée du domaine Caisse.
 * Les signatures imitent de futurs appels API (Promises) — il suffira de
 * remplacer le corps par des fetch vers `apps/api` sans toucher aux écrans.
 */

export function listStudents(_schoolId: string): Promise<FakeStudent[]> {
  return fetchStudents();
}

export function getDailyCaisse(_schoolId: string): Promise<DailyCaisse> {
  return fetchDailyCaisse();
}

export function getTodayTransactions(_schoolId: string): Promise<FakeTx[]> {
  return fetchTodayTransactions();
}

export function persistTransaction(tx: FakeTx): void {
  prependTransaction(tx);
}

export function persistReceipt(rec: ReceiptRecord): void {
  addReceipt(rec);
}