import type { FakeFeeStructure, FakeStudent } from "@/core/mocks/fake-data";
import {
  fetchFeeStructures,
  fetchStudents,
  patchFeeStructure,
  patchStudent,
} from "@/core/mocks/students-db";

/**
 * Couche d'accès simulée du domaine Grilles tarifaires & avantages.
 * À remplacer par les appels réels vers `apps/api`
 * (GET/PATCH /fee-structures, PATCH /students/:id) sans toucher aux écrans.
 */

export function listFeeStructures(_schoolId: string): Promise<FakeFeeStructure[]> {
  return fetchFeeStructures();
}

export function listStudentsForFees(_schoolId: string): Promise<FakeStudent[]> {
  return fetchStudents();
}

export function saveFeeStructure(
  structureId: string,
  installments: FakeFeeStructure["installments"],
): Promise<FakeFeeStructure | null> {
  patchFeeStructure(structureId, installments);
  return fetchFeeStructures().then((all) => all.find((s) => s.id === structureId) ?? null);
}

export interface DiscountPatch {
  label: string;
  amount: number;
}

export function applyDiscount(
  _schoolId: string,
  studentId: string,
  discount: DiscountPatch,
): Promise<void> {
  patchStudent(studentId, { feePlan: { discountLabel: discount.label, discountAmount: discount.amount } });
  return Promise.resolve();
}

export function removeDiscount(_schoolId: string, studentId: string): Promise<void> {
  patchStudent(studentId, { feePlan: { discountLabel: "", discountAmount: 0 } });
  return Promise.resolve();
}