import type { AcademicYear } from "@/core/mocks/academic-years-db";
import type { FakeTx } from "@/core/mocks/fake-data";
import { fetchTransactionsHistory } from "@/core/mocks/students-db";

/**
 * Couche d'accès simulée du domaine Encaissements (journal).
 * À remplacer par GET /receipts de `apps/api` sans toucher aux écrans.
 * `year` filtre l’année académique (année passée = lecture seule).
 */
export function listTransactions(_schoolId: string, year?: AcademicYear): Promise<FakeTx[]> {
  return fetchTransactionsHistory(year);
}