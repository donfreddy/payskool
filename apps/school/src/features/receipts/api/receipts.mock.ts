import type { AcademicYear } from "@/core/mocks/academic-years-db";
import type { FakeReceipt } from "@/core/mocks/fake-data";
import { fetchReceipts } from "@/core/mocks/students-db";

/**
 * Couche d'accès simulée du domaine Reçus — à remplacer par
 * GET /receipts et GET /receipts/:number de `apps/api`.
 * `year` filtre l’année académique (année passée = lecture seule).
 */
export function listReceipts(_schoolId: string, year?: AcademicYear): Promise<FakeReceipt[]> {
  return fetchReceipts(year);
}