import type { CashMethod } from "@/core/mocks/fake-data";

export type RegisterMethod = CashMethod;

export interface RegisterDraft {
  amount: string; // saisie libre, espaces autorisés
  method: RegisterMethod;
  chequeNumber: string;
  chequeBank: string;
}

export interface ReceiptAllocation {
  installmentId: string;
  label: string;
  amount: number;
}

export interface ReceiptRecord {
  id: string;
  number: string;
  studentId: string;
  studentName: string;
  classLevel: string;
  matricule: string;
  academicYear: string;
  amount: number;
  method: RegisterMethod;
  chequeNumber?: string;
  chequeBank?: string;
  allocations: ReceiptAllocation[];
  cashier: string;
  createdAt: string; // ISO
}