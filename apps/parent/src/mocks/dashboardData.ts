import type { DashboardData } from '../types/models';

export const mockDashboardData: DashboardData = {
  school: {
    id: 'sch_1',
    name: 'CS Sainte-Marie',
    academicYear: '2026-2027'
  },
  activeStudent: {
    id: 'stu_1',
    name: 'Marc K. Jr',
    grade: '6ème A'
  },
  students: [
    {
      id: 'stu_1',
      name: 'Marc K. Jr',
      grade: '6ème A'
    },
    {
      id: 'stu_2',
      name: 'Sarah K.',
      grade: 'CM2'
    }
  ],
  totalRemaining: 75000,
  installments: [
    {
      id: 'inst_1',
      title: 'Tranche 1 - Inscription & Rentrée',
      amount: 50000,
      status: 'PAID',
      date: '15 Sept 2026',
      statusLabel: 'PAYÉ'
    },
    {
      id: 'inst_2',
      title: 'Tranche 2 - Deuxième Versement',
      amount: 40000,
      status: 'DUE',
      date: '15 DEC',
      statusLabel: 'À PAYER AVANT LE 15 DEC'
    },
    {
      id: 'inst_3',
      title: 'Tranche 3 - Troisième Versement',
      amount: 35000,
      status: 'UPCOMING',
      date: '15 MARS 2027',
      statusLabel: 'À VENIR'
    }
  ],
  recentReceipts: [
    {
      id: 'rec_1',
      receiptNumber: '#8921',
      title: 'Tranche 1',
      amount: 50000,
      date: '15/09/2026'
    }
  ]
};
