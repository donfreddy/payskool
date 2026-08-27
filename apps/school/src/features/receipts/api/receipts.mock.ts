import type { FakeReceipt } from "@/core/mocks/fake-data";
import { fetchReceipts } from "@/core/mocks/students-db";

/**
 * Couche d'accès simulée du domaine Reçus — à remplacer par
 * GET /receipts et GET /receipts/:number de `apps/api`.
 */
export function listReceipts(_schoolId: string): Promise<FakeReceipt[]> {
  return fetchReceipts();
}