export type InstallmentStatus = 'PAID' | 'DUE' | 'UPCOMING';

export interface Student {
  id: string;
  name: string;
  grade: string;
}

export interface Installment {
  id: string;
  title: string;
  amount: number;
  status: InstallmentStatus;
  date: string;
  statusLabel: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  title: string;
  amount: number;
  date: string;
}

export interface School {
  id: string;
  name: string;
  academicYear: string;
}

export interface DashboardData {
  school: School;
  activeStudent: Student;
  students: Student[];
  totalRemaining: number;
  installments: Installment[];
  recentReceipts: Receipt[];
}
