export type InstallmentStatus = 'PAID' | 'DUE' | 'OVERDUE' | 'UPCOMING';

export interface School {
  id: string;
  name: string;
  academicYear: string;
}

export interface Installment {
  id: string;
  title: string;
  amount: number;
  status: InstallmentStatus;
  date: string;
  dueDate?: string;
  statusLabel: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  title: string;
  amount: number;
  date: string;
  category?: 'Scolarité' | 'Cantine' | 'Tenue' | 'Autre';
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  grade: string;
  school: School;
  totalRemaining: number;
  installments: Installment[];
  recentReceipts: Receipt[];
}
