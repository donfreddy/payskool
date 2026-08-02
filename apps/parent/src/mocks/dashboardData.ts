import type { Student } from '../types/models';

export const parentProfile = {
  name: 'KOUASSI Ambroise',
  phone: '+225 07 00 00 00 00',
};

export const students: Student[] = [
  {
    id: 'stu_1',
    name: 'Marc K. Jr',
    initials: 'MK',
    grade: '6ème A',
    school: {
      id: 'sch_1',
      name: 'CS Sainte-Marie',
      academicYear: '2026-2027'
    },
    totalRemaining: 75000,
    installments: [
      {
        id: 'inst_1',
        title: 'Tranche 1 - Inscription & Rentrée',
        amount: 50000,
        status: 'PAID',
        date: '15 Sept 2026',
        dueDate: '15 Sept 2026',
        statusLabel: 'PAYÉ'
      },
      {
        id: 'inst_2',
        title: 'Tranche 2 - Deuxième Versement',
        amount: 40000,
        status: 'OVERDUE',
        date: '15 Nov 2026',
        dueDate: '15 Nov 2026',
        statusLabel: 'EN RETARD'
      },
      {
        id: 'inst_3',
        title: 'Tranche 3 - Troisième Versement',
        amount: 35000,
        status: 'UPCOMING',
        date: '15 MARS 2027',
        dueDate: '15 Mars 2027',
        statusLabel: 'À VENIR'
      }
    ],
    recentReceipts: [
      {
        id: 'rec_1',
        receiptNumber: '#8921',
        title: 'Tranche 1',
        amount: 50000,
        date: '15/09/2026',
        category: 'Scolarité'
      },
      {
        id: 'rec_2',
        receiptNumber: '#8850',
        title: 'Frais de cantine (Trimestre 1)',
        amount: 15000,
        date: '02/09/2026',
        category: 'Cantine'
      },
      {
        id: 'rec_3',
        receiptNumber: '#8801',
        title: 'Tenue de sport',
        amount: 8500,
        date: '28/08/2026',
        category: 'Tenue'
      }
    ]
  },
  {
    id: 'stu_2',
    name: 'Sarah K.',
    initials: 'SK',
    grade: 'CM2',
    school: {
      id: 'sch_1',
      name: 'CS Sainte-Marie',
      academicYear: '2026-2027'
    },
    totalRemaining: 45000,
    installments: [
      {
        id: 'inst_s1',
        title: 'Tranche 1 - Inscription',
        amount: 40000,
        status: 'PAID',
        date: '10 Sept 2026',
        statusLabel: 'PAYÉ'
      },
      {
        id: 'inst_s2',
        title: 'Tranche 2',
        amount: 45000,
        status: 'DUE',
        date: '15 DEC',
        statusLabel: 'À PAYER AVANT LE 15 DEC'
      }
    ],
    recentReceipts: [
      {
        id: 'rec_s1',
        receiptNumber: '#8890',
        title: 'Tranche 1',
        amount: 40000,
        date: '10/09/2026',
        category: 'Scolarité'
      }
    ]
  },
  {
    id: 'stu_3',
    name: 'Leo K.',
    initials: 'LK',
    grade: 'Petite Section',
    school: {
      id: 'sch_2',
      name: 'Maternelle Les Papillons',
      academicYear: '2026-2027'
    },
    totalRemaining: 0,
    installments: [
      {
        id: 'inst_l1',
        title: 'Totalité Scolarité',
        amount: 150000,
        status: 'PAID',
        date: '01 Sept 2026',
        statusLabel: 'PAYÉ'
      }
    ],
    recentReceipts: [
      {
        id: 'rec_l1',
        receiptNumber: '#9012',
        title: 'Scolarité Totale',
        amount: 150000,
        date: '01/09/2026',
        category: 'Scolarité'
      }
    ]
  }
];
