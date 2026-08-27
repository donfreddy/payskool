import type { FakeTx } from "@/core/mocks/fake-data";
import { fetchTransactionsHistory } from "@/core/mocks/students-db";

/**
 * Couche d'accès simulée du domaine Encaissements (journal).
 * À remplacer par GET /receipts de `apps/api` sans toucher aux écrans.
 */
export function listTransactions(_schoolId: string): Promise<FakeTx[]> {
  return fetchTransactionsHistory();
}