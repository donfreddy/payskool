export const FAKE_USER = {
  id: "u_1",
  name: "Erick Kouam",
  email: "erickkouam@example.com",
  avatar: "/images/avatars/male-01.svg",
  role: "OWNER",
};

export const FAKE_SCHOOLS = [
  { id: "cs-sainte-marie", name: "CS Sainte-Marie (Douala - Akwa)", logo: "🏫" },
  { id: "lycee-saint-paul", name: "Lycée Saint-Paul (Yaoundé)", logo: "🏛️" },
  { id: "maternelle-bisounours", name: "Maternelle les Bisounours", logo: "🧸" },
];

export const FAKE_METRICS = {
  totalCollection: 45200000,
  collectionRate: 78,
  remainingAmount: 12800000,
  studentsUpToDate: 412,
  totalStudents: 520,
};

export const FAKE_RECENT_PAYMENTS = [
  {
    id: "txn_1",
    student: "Marc K. Junior",
    class: "6ème A",
    amount: 50000,
    method: "Orange Money",
    receipt: "#8921",
    status: "SUCCÈS",
    date: "2026-08-04T10:30:00Z",
  },
  {
    id: "txn_2",
    student: "Sonia Talla",
    class: "3ème B",
    amount: 35000,
    method: "MTN MoMo",
    receipt: "#8920",
    status: "SUCCÈS",
    date: "2026-08-04T10:15:00Z",
  },
  {
    id: "txn_3",
    student: "Erick Kouam",
    class: "Terminale C",
    amount: 100000,
    method: "Espèces Guichet",
    receipt: "#8919",
    status: "SUCCÈS",
    date: "2026-08-04T09:45:00Z",
  },
  {
    id: "txn_4",
    student: "Sarah Diop",
    class: "4ème C",
    amount: 40000,
    method: "Wave",
    receipt: "#8918",
    status: "SUCCÈS",
    date: "2026-08-04T09:10:00Z",
  },
];

export const FAKE_NOTIFICATIONS = {
  unreadCount: 3,
  notifications: [
    {
      id: "notif_1",
      content: "Nouveau paiement de 50.000 FCFA de Marc K. Junior",
      date: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      isRead: false,
      icon: "CreditCard" as const,
      url: "/cs-sainte-marie/dashboard",
    },
    {
      id: "notif_2",
      content: "Rappel : 5 élèves en retard de paiement pour la 6ème A",
      date: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      isRead: false,
      icon: "AlertTriangle" as const,
      url: "/cs-sainte-marie/dashboard",
    },
    {
      id: "notif_3",
      content: "Nouvel élève inscrit : Sarah Diop en 4ème C",
      date: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      isRead: false,
      icon: "UserPlus" as const,
      url: "/cs-sainte-marie/dashboard",
    },
    {
      id: "notif_4",
      content: "Reçu #8919 généré par Caissier A",
      date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      icon: "Receipt" as const,
      url: "/cs-sainte-marie/dashboard",
    },
    {
      id: "notif_5",
      content: "Export des données mensuel prêt",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      icon: "Download" as const,
      url: "/cs-sainte-marie/dashboard",
    },
  ],
};

export const FAKE_LIVE_FEED = [
  {
    id: "feed_1",
    message: "Nouveau paiement MoMo de 50.000 FCFA validé (Orange)",
    timeAgo: "Il y a 2 min",
  },
  {
    id: "feed_2",
    message: "Reçu de caisse #8919 imprimé par Caissier A",
    timeAgo: "Il y a 15 min",
  },
  {
    id: "feed_3",
    message: "Alerte impayé Tranche 2 envoyée à 14 parents via WhatsApp",
    timeAgo: "Il y a 1 heure",
  },
];

// ---------------------------------------------------------------------------
// Données "élèves / scolarité" — simulées pour la démo.
// Montants en FCFA (unités), `previous_balance` négatif = arriéré année passée.
// ---------------------------------------------------------------------------

/**
 * Horodatage de référence de la démo : mi-année scolaire 2026-2027.
 * Les statuts (à jour / en retard) sont dérivés par rapport à cette date.
 */
export const MOCK_NOW = new Date("2026-11-20T12:00:00Z");

export type FakeStudentStatus = "ENROLLED" | "TRANSFERRED" | "GRADUATED" | "EXPELLED";

export interface FakeInstallment {
  id: string;
  label: string; // ex: "Tranche 1 — Inscription"
  amount: number; // montant plein (FCFA)
  paid: number; // déjà réglé sur cette tranche
  dueDate: string; // ISO yyyy-mm-dd
}

export interface FakeFeePlan {
  id: string;
  label: string; // ex: "Scolarité 6ème A — 2026-2027"
  discountLabel?: string; // ex: "Bourse mérite 50 %"
  discountAmount?: number; // abattement total (FCFA) sur la grille
  installments: FakeInstallment[];
}

export interface FakeStudent {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: "M" | "F";
  classLevel: string;
  academicYear: string;
  status: FakeStudentStatus;
  previousBalance: number; // < 0 = arriéré reporté
  parentName: string;
  parentPhone: string;
  feePlan: FakeFeePlan;
}

/**
 * 14 élèves représentatifs : bonnes payeuses, retardataires, boursiers,
 * un élève transféré avec arriéré, etc. — pour nourrir liste, guichet et import.
 */
export const FAKE_STUDENTS: FakeStudent[] = [
  {
    id: "std_01",
    matricule: "STE-26-0001",
    firstName: "Aminata",
    lastName: "Koné",
    gender: "F",
    classLevel: "6ème A",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: -25000,
    parentName: "Mme Koné Awa",
    parentPhone: "+237 690 44 21 08",
    feePlan: {
      id: "fp_01",
      label: "Scolarité 6ème A — 2026-2027",
      discountLabel: "Bourse mérite 50 %",
      discountAmount: 125000,
      installments: [
        { id: "i_01a", label: "Tranche 1 — Inscription", amount: 100000, paid: 100000, dueDate: "2026-09-15" },
        { id: "i_01b", label: "Tranche 2 — 1er Trimestre", amount: 125000, paid: 0, dueDate: "2026-11-15" },
        { id: "i_01c", label: "Tranche 3 — 2ème Trimestre", amount: 125000, paid: 0, dueDate: "2027-02-15" },
      ],
    },
  },
  {
    id: "std_02",
    matricule: "STE-26-0002",
    firstName: "Junior",
    lastName: "Kengni",
    gender: "M",
    classLevel: "6ème A",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "M. Kengni Paul",
    parentPhone: "+237 677 30 15 62",
    feePlan: {
      id: "fp_02",
      label: "Scolarité 6ème A — 2026-2027",
      installments: [
        { id: "i_02a", label: "Tranche 1 — Inscription", amount: 100000, paid: 100000, dueDate: "2026-09-15" },
        { id: "i_02b", label: "Tranche 2 — 1er Trimestre", amount: 125000, paid: 125000, dueDate: "2026-11-15" },
        { id: "i_02c", label: "Tranche 3 — 2ème Trimestre", amount: 125000, paid: 25000, dueDate: "2027-02-15" },
      ],
    },
  },
  {
    id: "std_03",
    matricule: "STE-26-0003",
    firstName: "Sonia",
    lastName: "Talla",
    gender: "F",
    classLevel: "3ème B",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "M. Talla Maurice",
    parentPhone: "+237 696 12 88 40",
    feePlan: {
      id: "fp_03",
      label: "Scolarité 3ème B — 2026-2027",
      installments: [
        { id: "i_03a", label: "Tranche 1 — Inscription", amount: 95000, paid: 95000, dueDate: "2026-09-20" },
        { id: "i_03b", label: "Tranche 2 — 1er Trimestre", amount: 115000, paid: 60000, dueDate: "2026-11-20" },
        { id: "i_03c", label: "Tranche 3 — 2ème Trimestre", amount: 115000, paid: 0, dueDate: "2027-02-20" },
      ],
    },
  },
  {
    id: "std_04",
    matricule: "STE-26-0004",
    firstName: "Erick",
    lastName: "Kouam",
    gender: "M",
    classLevel: "Terminale C",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: -40000,
    parentName: "M. Kouam Martin",
    parentPhone: "+237 654 77 19 33",
    feePlan: {
      id: "fp_04",
      label: "Scolarité Terminale C — 2026-2027",
      installments: [
        { id: "i_04a", label: "Tranche 1 — Inscription", amount: 125000, paid: 100000, dueDate: "2026-09-10" },
        { id: "i_04b", label: "Tranche 2 — 1er Trimestre", amount: 150000, paid: 0, dueDate: "2026-11-10" },
        { id: "i_04c", label: "Tranche 3 — 2ème Trimestre", amount: 150000, paid: 0, dueDate: "2027-02-10" },
      ],
    },
  },
  {
    id: "std_05",
    matricule: "STE-26-0005",
    firstName: "Sarah",
    lastName: "Diop",
    gender: "F",
    classLevel: "4ème C",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "Mme Diop Fatou",
    parentPhone: "+221 77 502 16 84",
    feePlan: {
      id: "fp_05",
      label: "Scolarité 4ème C — 2026-2027",
      discountLabel: "Bourse partenariat 100 000 FCFA",
      discountAmount: 100000,
      installments: [
        { id: "i_05a", label: "Tranche 1 — Inscription", amount: 85000, paid: 85000, dueDate: "2026-09-18" },
        { id: "i_05b", label: "Tranche 2 — 1er Trimestre", amount: 105000, paid: 105000, dueDate: "2026-11-18" },
        { id: "i_05c", label: "Tranche 3 — 2ème Trimestre", amount: 105000, paid: 105000, dueDate: "2027-02-18" },
      ],
    },
  },
  {
    id: "std_06",
    matricule: "STE-26-0006",
    firstName: "Gaëlle",
    lastName: "Ngannou",
    gender: "F",
    classLevel: "6ème B",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: -30000,
    parentName: "M. Ngannou Élodie",
    parentPhone: "+237 699 45 60 12",
    feePlan: {
      id: "fp_06",
      label: "Scolarité 6ème B — 2026-2027",
      installments: [
        { id: "i_06a", label: "Tranche 1 — Inscription", amount: 100000, paid: 100000, dueDate: "2026-09-15" },
        { id: "i_06b", label: "Tranche 2 — 1er Trimestre", amount: 125000, paid: 0, dueDate: "2026-11-15" },
        { id: "i_06c", label: "Tranche 3 — 2ème Trimestre", amount: 125000, paid: 0, dueDate: "2027-02-15" },
      ],
    },
  },
  {
    id: "std_07",
    matricule: "STE-26-0007",
    firstName: "Christian",
    lastName: "Mbala",
    gender: "M",
    classLevel: "5ème A",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "Mme Mbala Rosine",
    parentPhone: "+237 683 27 46 90",
    feePlan: {
      id: "fp_07",
      label: "Scolarité 5ème A — 2026-2027",
      installments: [
        { id: "i_07a", label: "Tranche 1 — Inscription", amount: 90000, paid: 90000, dueDate: "2026-09-20" },
        { id: "i_07b", label: "Tranche 2 — 1er Trimestre", amount: 110000, paid: 70000, dueDate: "2026-11-20" },
        { id: "i_07c", label: "Tranche 3 — 2ème Trimestre", amount: 110000, paid: 0, dueDate: "2027-02-20" },
      ],
    },
  },
  {
    id: "std_08",
    matricule: "STE-26-0008",
    firstName: "Linda",
    lastName: "Assoumou",
    gender: "F",
    classLevel: "CM2",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "M. Assoumou Henri",
    parentPhone: "+237 651 09 32 77",
    feePlan: {
      id: "fp_08",
      label: "Scolarité CM2 — 2026-2027",
      installments: [
        { id: "i_08a", label: "Tranche 1 — Inscription", amount: 70000, paid: 70000, dueDate: "2026-09-22" },
        { id: "i_08b", label: "Tranche 2 — 1er Trimestre", amount: 80000, paid: 80000, dueDate: "2026-11-22" },
        { id: "i_08c", label: "Tranche 3 — 2ème Trimestre", amount: 80000, paid: 0, dueDate: "2027-02-22" },
      ],
    },
  },
  {
    id: "std_09",
    matricule: "STE-26-0009",
    firstName: "Brice",
    lastName: "Tadjou",
    gender: "M",
    classLevel: "2nde A",
    academicYear: "2026-2027",
    status: "TRANSFERRED",
    previousBalance: -50000,
    parentName: "M. Tadjou David",
    parentPhone: "+237 690 82 55 04",
    feePlan: {
      id: "fp_09",
      label: "Scolarité 2nde A — 2026-2027",
      installments: [
        { id: "i_09a", label: "Tranche 1 — Inscription", amount: 120000, paid: 0, dueDate: "2026-09-25" },
        { id: "i_09b", label: "Tranche 2 — 1er Trimestre", amount: 140000, paid: 0, dueDate: "2026-11-25" },
        { id: "i_09c", label: "Tranche 3 — 2ème Trimestre", amount: 140000, paid: 0, dueDate: "2027-02-25" },
      ],
    },
  },
  {
    id: "std_10",
    matricule: "STE-26-0010",
    firstName: "Marie",
    lastName: "Fotso",
    gender: "F",
    classLevel: "Terminale C",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "Mme Fotso Célestine",
    parentPhone: "+237 694 51 78 26",
    feePlan: {
      id: "fp_10",
      label: "Scolarité Terminale C — 2026-2027",
      installments: [
        { id: "i_10a", label: "Tranche 1 — Inscription", amount: 125000, paid: 125000, dueDate: "2026-09-10" },
        { id: "i_10b", label: "Tranche 2 — 1er Trimestre", amount: 150000, paid: 150000, dueDate: "2026-11-10" },
        { id: "i_10c", label: "Tranche 3 — 2ème Trimestre", amount: 150000, paid: 0, dueDate: "2027-02-10" },
      ],
    },
  },
  {
    id: "std_11",
    matricule: "STE-26-0011",
    firstName: "Junior",
    lastName: "Wandji",
    gender: "M",
    classLevel: "4ème C",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: -15000,
    parentName: "M. Wandji Sylvain",
    parentPhone: "+237 655 30 41 58",
    feePlan: {
      id: "fp_11",
      label: "Scolarité 4ème C — 2026-2027",
      installments: [
        { id: "i_11a", label: "Tranche 1 — Inscription", amount: 85000, paid: 40000, dueDate: "2026-09-18" },
        { id: "i_11b", label: "Tranche 2 — 1er Trimestre", amount: 105000, paid: 0, dueDate: "2026-11-18" },
        { id: "i_11c", label: "Tranche 3 — 2ème Trimestre", amount: 105000, paid: 0, dueDate: "2027-02-18" },
      ],
    },
  },
  {
    id: "std_12",
    matricule: "STE-26-0012",
    firstName: "Aïcha",
    lastName: "Eding",
    gender: "F",
    classLevel: "5ème A",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "Mme Eding Salimata",
    parentPhone: "+237 677 94 20 13",
    feePlan: {
      id: "fp_12",
      label: "Scolarité 5ème A — 2026-2027",
      installments: [
        { id: "i_12a", label: "Tranche 1 — Inscription", amount: 90000, paid: 90000, dueDate: "2026-09-20" },
        { id: "i_12b", label: "Tranche 2 — 1er Trimestre", amount: 110000, paid: 110000, dueDate: "2026-11-20" },
        { id: "i_12c", label: "Tranche 3 — 2ème Trimestre", amount: 110000, paid: 110000, dueDate: "2027-02-20" },
      ],
    },
  },
  {
    id: "std_13",
    matricule: "STE-26-0013",
    firstName: "Serge",
    lastName: "Mvondo",
    gender: "M",
    classLevel: "3ème B",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "M. Mvondo Gilbert",
    parentPhone: "+237 696 03 74 41",
    feePlan: {
      id: "fp_13",
      label: "Scolarité 3ème B — 2026-2027",
      installments: [
        { id: "i_13a", label: "Tranche 1 — Inscription", amount: 95000, paid: 95000, dueDate: "2026-09-20" },
        { id: "i_13b", label: "Tranche 2 — 1er Trimestre", amount: 115000, paid: 0, dueDate: "2026-11-20" },
        { id: "i_13c", label: "Tranche 3 — 2ème Trimestre", amount: 115000, paid: 0, dueDate: "2027-02-20" },
      ],
    },
  },
  {
    id: "std_14",
    matricule: "STE-26-0014",
    firstName: "Rufine",
    lastName: "Bella",
    gender: "F",
    classLevel: "6ème A",
    academicYear: "2026-2027",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "M. Bella Jonas",
    parentPhone: "+237 659 18 82 06",
    feePlan: {
      id: "fp_14",
      label: "Scolarité 6ème A — 2026-2027",
      discountLabel: "Fratrie -10 %",
      discountAmount: 35000,
      installments: [
        { id: "i_14a", label: "Tranche 1 — Inscription", amount: 100000, paid: 100000, dueDate: "2026-09-15" },
        { id: "i_14b", label: "Tranche 2 — 1er Trimestre", amount: 125000, paid: 125000, dueDate: "2026-11-15" },
        { id: "i_14c", label: "Tranche 3 — 2ème Trimestre", amount: 125000, paid: 0, dueDate: "2027-02-15" },
      ],
    },
  },
];

export type CashMethod = "CASH" | "CHEQUE";

export type TxMethod = CashMethod | "ORANGE_MONEY" | "MTN_MOMO" | "WAVE";

export interface FakeTx {
  id: string;
  studentId: string;
  studentName: string;
  classLevel: string;
  amount: number;
  method: TxMethod;
  receipt: string;
  date: string; // ISO
}

/** Transactions simulées pour l'activité "Caisse du jour". */
export const FAKE_CAISSE_TODAY = {
  opener: "A. Kamga (Caissier)",
  float: 150000,
  collected: 365000,
  txCount: 13,
  byMethod: { CASH: 285000, CHEQUE: 80000 },
};

export const FAKE_TODAY_TRANSACTIONS: FakeTx[] = [
  {
    id: "tx_c1",
    studentId: "std_03",
    studentName: "Sonia Talla",
    classLevel: "3ème B",
    amount: 60000,
    method: "CASH",
    receipt: "#8952",
    date: "2026-11-20T09:14:00Z",
  },
  {
    id: "tx_c2",
    studentId: "std_05",
    studentName: "Sarah Diop",
    classLevel: "4ème C",
    amount: 105000,
    method: "ORANGE_MONEY",
    receipt: "#8953",
    date: "2026-11-20T09:47:00Z",
  },
  {
    id: "tx_c3",
    studentId: "std_07",
    studentName: "Christian Mbala",
    classLevel: "5ème A",
    amount: 70000,
    method: "CASH",
    receipt: "#8954",
    date: "2026-11-20T10:05:00Z",
  },
  {
    id: "tx_c4",
    studentId: "std_10",
    studentName: "Marie Fotso",
    classLevel: "Terminale C",
    amount: 80000,
    method: "CHEQUE",
    receipt: "#8955",
    date: "2026-11-20T10:42:00Z",
  },
  {
    id: "tx_c5",
    studentId: "std_02",
    studentName: "Junior Kengni",
    classLevel: "6ème A",
    amount: 50000,
    method: "WAVE",
    receipt: "#8956",
    date: "2026-11-20T11:18:00Z",
  },
];

// ---------------------------------------------------------------------------
// Reçus (historique du registre) — générés de façon déterministe à partir des
// plans de paiement afin que la liste des reçus, le journal des encaissements
// et les soldes des élèves restent parfaitement cohérents.
// ---------------------------------------------------------------------------

export interface FakeReceiptAllocation {
  installmentId: string;
  label: string;
  amount: number;
}

export interface FakeReceipt {
  id: string;
  number: string; // "#8952"
  studentId: string;
  studentName: string;
  classLevel: string;
  matricule: string;
  amount: number;
  method: TxMethod;
  chequeNumber?: string;
  chequeBank?: string;
  allocations: FakeReceiptAllocation[];
  cashier: string;
  createdAt: string; // ISO
}

const CASHIER_NAMES = ["A. Kamga (Caissier)", "Erick Kouam"] as const;
const TX_METHOD_CYCLE: TxMethod[] = ["ORANGE_MONEY", "MTN_MOMO", "WAVE", "CASH", "CHEQUE"];

/** Ventilation FIFO locale (reprise au montant payé) pour étiqueter l'allocation. */
function fifoAlloc(plan: FakeFeePlan, amount: number): FakeReceiptAllocation[] {
  const out: FakeReceiptAllocation[] = [];
  let rest = amount;
  for (const i of plan.installments) {
    if (rest <= 0) break;
    const rem = Math.max(i.amount - i.paid, 0);
    if (rem <= 0) continue;
    const allocated = Math.min(rem, rest);
    out.push({ installmentId: i.id, label: i.label, amount: allocated });
    rest -= allocated;
  }
  return out;
}

function buildReceiptsSeed(): FakeReceipt[] {
  const now = MOCK_NOW;
  const out: FakeReceipt[] = [];
  let seq = 8888;

  FAKE_STUDENTS.forEach((s, si) => {
    s.feePlan.installments.forEach((inst, ii) => {
      if (inst.paid <= 0) return;
      const due = new Date(`${inst.dueDate}T00:00:00Z`);
      const paidAt = new Date(due.getTime() + (ii * 2 + 1) * 24 * 3600 * 1000);
      const method = TX_METHOD_CYCLE[(si + ii) % TX_METHOD_CYCLE.length]!;
      out.push({
        id: `rec_seed_${si}_${ii}`,
        number: `#${seq++}`,
        studentId: s.id,
        studentName: `${s.firstName} ${s.lastName}`,
        classLevel: s.classLevel,
        matricule: s.matricule,
        amount: inst.paid,
        method,
        ...(method === "CHEQUE"
          ? { chequeNumber: `AFC${2431 + si * 7 + ii}`, chequeBank: si % 2 ? "SCB Cameroun" : "Afriland First Bank" }
          : {}),
        allocations: [{ installmentId: inst.id, label: inst.label, amount: inst.paid }],
        cashier: CASHIER_NAMES[(si + ii) % 2]!,
        createdAt: (paidAt > now ? now : paidAt).toISOString(),
      });
    });
  });

  // La séquence de caisse du matin (journal en direct) est aussi archivée en reçus.
  FAKE_TODAY_TRANSACTIONS.forEach((t, ti) => {
    const student = FAKE_STUDENTS.find((s) => s.id === t.studentId);
    const allocations = student ? fifoAlloc(student.feePlan, t.amount) : [];
    out.push({
      id: `rec_day_${ti}`,
      number: t.receipt,
      studentId: t.studentId,
      studentName: t.studentName,
      classLevel: t.classLevel,
      matricule: student?.matricule ?? "—",
      amount: t.amount,
      method: t.method,
      allocations,
      cashier: "A. Kamga (Caissier)",
      createdAt: t.date,
    });
  });

  // Journal : plus récent en premier.
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const FAKE_RECEIPTS: FakeReceipt[] = buildReceiptsSeed();

// ---------------------------------------------------------------------------
// Grilles tarifaires — le contrat de scolarité de chaque classe : montants des
// tranches et leurs échéances. Données canoniques dont les échéanciers élèves
// de FAKE_STUDENTS sont des instances.
// ---------------------------------------------------------------------------

export interface FakeFeeStructureInstallment {
  label: string;
  amount: number;
  dueDate: string; // "yyyy-mm-dd"
}

export interface FakeFeeStructure {
  id: string;
  classLevel: string;
  total: number;
  installments: FakeFeeStructureInstallment[];
}

export const FAKE_FEE_STRUCTURES: FakeFeeStructure[] = [
  {
    id: "fs_cm2",
    classLevel: "CM2",
    total: 230000,
    installments: [
      { label: "Tranche 1 — Inscription", amount: 70000, dueDate: "2026-09-22" },
      { label: "Tranche 2 — 1er Trimestre", amount: 80000, dueDate: "2026-11-22" },
      { label: "Tranche 3 — 2ème Trimestre", amount: 80000, dueDate: "2027-02-22" },
    ],
  },
  {
    id: "fs_6a",
    classLevel: "6ème A",
    total: 350000,
    installments: [
      { label: "Tranche 1 — Inscription", amount: 100000, dueDate: "2026-09-15" },
      { label: "Tranche 2 — 1er Trimestre", amount: 125000, dueDate: "2026-11-15" },
      { label: "Tranche 3 — 2ème Trimestre", amount: 125000, dueDate: "2027-02-15" },
    ],
  },
  {
    id: "fs_6b",
    classLevel: "6ème B",
    total: 350000,
    installments: [
      { label: "Tranche 1 — Inscription", amount: 100000, dueDate: "2026-09-15" },
      { label: "Tranche 2 — 1er Trimestre", amount: 125000, dueDate: "2026-11-15" },
      { label: "Tranche 3 — 2ème Trimestre", amount: 125000, dueDate: "2027-02-15" },
    ],
  },
  {
    id: "fs_5a",
    classLevel: "5ème A",
    total: 310000,
    installments: [
      { label: "Tranche 1 — Inscription", amount: 90000, dueDate: "2026-09-20" },
      { label: "Tranche 2 — 1er Trimestre", amount: 110000, dueDate: "2026-11-20" },
      { label: "Tranche 3 — 2ème Trimestre", amount: 110000, dueDate: "2027-02-20" },
    ],
  },
  {
    id: "fs_4c",
    classLevel: "4ème C",
    total: 295000,
    installments: [
      { label: "Tranche 1 — Inscription", amount: 85000, dueDate: "2026-09-18" },
      { label: "Tranche 2 — 1er Trimestre", amount: 105000, dueDate: "2026-11-18" },
      { label: "Tranche 3 — 2ème Trimestre", amount: 105000, dueDate: "2027-02-18" },
    ],
  },
  {
    id: "fs_3b",
    classLevel: "3ème B",
    total: 325000,
    installments: [
      { label: "Tranche 1 — Inscription", amount: 95000, dueDate: "2026-09-20" },
      { label: "Tranche 2 — 1er Trimestre", amount: 115000, dueDate: "2026-11-20" },
      { label: "Tranche 3 — 2ème Trimestre", amount: 115000, dueDate: "2027-02-20" },
    ],
  },
  {
    id: "fs_2a",
    classLevel: "2nde A",
    total: 400000,
    installments: [
      { label: "Tranche 1 — Inscription", amount: 120000, dueDate: "2026-09-25" },
      { label: "Tranche 2 — 1er Trimestre", amount: 140000, dueDate: "2026-11-25" },
      { label: "Tranche 3 — 2ème Trimestre", amount: 140000, dueDate: "2027-02-25" },
    ],
  },
  {
    id: "fs_tle",
    classLevel: "Terminale C",
    total: 425000,
    installments: [
      { label: "Tranche 1 — Inscription", amount: 125000, dueDate: "2026-09-10" },
      { label: "Tranche 2 — 1er Trimestre", amount: 150000, dueDate: "2026-11-10" },
      { label: "Tranche 3 — 2ème Trimestre", amount: 150000, dueDate: "2027-02-10" },
    ],
  },
];

/** Statut d'une période d'échéance par rapport à la date de référence de la démo. */
export function installmentPeriod(dueDate: string, now: Date = MOCK_NOW): "open" | "past" | "upcoming" {
  const due = new Date(`${dueDate}T00:00:00`);
  const monthEnd = new Date(now);
  if (due < now) return "past";
  if (due.getTime() - now.getTime() <= 45 * 24 * 3600 * 1000) return "open";
  return "upcoming";
}

/** Types de bourses / réductions proposés dans la grille. */
export interface FakeDiscountType {
  id: string;
  label: string;
  kind: "percent" | "fixed";
  defaultPercent?: number;
  defaultAmount?: number;
  tone: "emerald" | "azure" | "violet" | "amber" | "slate";
}

export const FAKE_DISCOUNT_TYPES: FakeDiscountType[] = [
  { id: "bourse-merite", label: "Bourse mérite", kind: "percent", defaultPercent: 25, tone: "emerald" },
  { id: "bourse-region", label: "Bourse du conseil régional", kind: "percent", defaultPercent: 15, tone: "azure" },
  { id: "bourse-partenariat", label: "Bourse partenariat", kind: "fixed", defaultAmount: 100000, tone: "violet" },
  { id: "fratrie", label: "Remise fratrie", kind: "percent", defaultPercent: 10, tone: "amber" },
  { id: "remise-cash", label: "Remise paiement d'avance", kind: "fixed", defaultAmount: 25000, tone: "slate" },
];

// ---------------------------------------------------------------------------
// Relances & notifications — règles configurables + historique d'envoi généré
// de façon déterministe à partir des élèves pour rester cohérent avec le
// recouvrement (impayés) et la campagne de relance.
// ---------------------------------------------------------------------------

export type RelanceChannel = "WHATSAPP" | "SMS" | "VOICE";
export type NotificationStatus = "SENT" | "DELIVERED" | "READ" | "FAILED";

export interface FakeRelanceRule {
  id: string;
  name: string;
  /** Canal d'envoi de la règle. */
  channel: RelanceChannel;
  /** Nombre de jours après l'échéance impayée. */
  delayDays: number;
  enabled: boolean;
  description: string;
  /** Modèle de message : {parent} {élève} {montant} {échéance}. */
  template: string;
}

export interface FakeNotification {
  id: string;
  studentId: string;
  studentName: string;
  classLevel: string;
  matricule: string;
  parentName: string;
  parentPhone: string;
  ruleId: string;
  ruleName: string;
  channel: RelanceChannel;
  status: NotificationStatus;
  content: string;
  createdAt: string; // ISO
}

const RULE_TEMPLATE = `Bonjour {parent}, une échéance de {montant} reste en attente pour {élève} (échéance du {échéance}). Règlement possible sur app.payskool.africa. Merci.`;

export const FAKE_RELANCE_RULES: FakeRelanceRule[] = [
  {
    id: "rule_01",
    name: "Rappel WhatsApp à J+1",
    channel: "WHATSAPP",
    delayDays: 1,
    enabled: true,
    description: "Premier rappel courtois aux parents, le lendemain d'une échéance impayée.",
    template: RULE_TEMPLATE,
  },
  {
    id: "rule_02",
    name: "SMS du secrétariat à J+7",
    channel: "SMS",
    delayDays: 7,
    enabled: true,
    description: "Relance écrite par le secrétariat une semaine après l'échéance.",
    template: RULE_TEMPLATE,
  },
  {
    id: "rule_03",
    name: "Appel après 30 jours",
    channel: "VOICE",
    delayDays: 30,
    enabled: false,
    description: "Appel direct du secrétariat pour un rendez-vous de règlement sous 72 h.",
    template: RULE_TEMPLATE,
  },
];

function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function render(template: string, values: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(values)) {
    out = out.split(`{${key}}`).join(value);
  }
  return out;
}

const CHANNEL_CYCLE: RelanceChannel[] = ["WHATSAPP", "WHATSAPP", "SMS", "WHATSAPP", "VOICE", "SMS"];
const STATUS_CYCLE: NotificationStatus[] = ["READ", "DELIVERED", "DELIVERED", "READ", "SENT", "READ", "FAILED"];

function buildNotificationHistorySeed(): FakeNotification[] {
  const now = MOCK_NOW;
  const out: FakeNotification[] = [];
  const rules = [...FAKE_RELANCE_RULES];
  let seq = 0;

  FAKE_STUDENTS.slice(0, 14).forEach((s, si) => {
    // Un envoi par règle et par élève, échelonnés avant "aujourd'hui".
    const overdue = s.feePlan.installments.find((i) => i.paid < i.amount) ?? s.feePlan.installments[0]!;
    const dueDate = overdue.dueDate;
    const remaining = Math.max(
      s.feePlan.installments.reduce((sum, i) => sum + (i.amount - i.paid), 0),
      0,
    );
    const fmtRemaining = remaining.toLocaleString("fr-FR");

    rules.forEach((rule, ri) => {
      const createdAt = new Date(now.getTime() - (si * 37 + ri * 9 + 2) * 3600 * 1000);
      if (createdAt > now) return;
      const content = render(rule.template, {
        parent: s.parentName,
        élève: `${s.firstName} ${s.lastName}`,
        montant: `${fmtRemaining} FCFA`,
        échéance: shortDate(dueDate),
      });
      out.push({
        id: `notif_seed_${seq++}`,
        studentId: s.id,
        studentName: `${s.firstName} ${s.lastName}`,
        classLevel: s.classLevel,
        matricule: s.matricule,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        ruleId: rule.id,
        ruleName: rule.name,
        channel: CHANNEL_CYCLE[(si + ri) % CHANNEL_CYCLE.length]!,
        status: STATUS_CYCLE[(si + ri) % STATUS_CYCLE.length]!,
        content,
        createdAt: createdAt.toISOString(),
      });
    });
  });

  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const FAKE_NOTIFICATION_HISTORY: FakeNotification[] = buildNotificationHistorySeed();

// ---------------------------------------------------------------------------
// Membres & équipe — fiche de chaque collaborateur, cohérente avec la caisse
// (A. Kamga est l'un des caissiers listés sur les reçus).
// ---------------------------------------------------------------------------

export type MemberRole = "OWNER" | "SCHOOL_ADMIN" | "CASHIER" | "ACCOUNTANT" | "TEACHER";
export type MemberStatus = "ACTIVE" | "INVITED" | "SUSPENDED";

export interface FakeMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: MemberRole;
  status: MemberStatus;
  /** Date d'entrée dans l'équipe ou d'envoi de l'invitation ("yyyy-mm-dd"). */
  joinedAt: string;
  /** Dernière connexion (ISO) — vide si jamais connecté. */
  lastActiveAt: string;
}

export const FAKE_MEMBERS: FakeMember[] = [
  {
    id: "mem_01",
    name: "Erick Kouam",
    email: "erickkouam@example.com",
    phone: "+237 654 00 12 34",
    role: "OWNER",
    status: "ACTIVE",
    joinedAt: "2024-09-01",
    lastActiveAt: "2026-11-20T10:15:00Z",
  },
  {
    id: "mem_02",
    name: "Nadine Mbarga",
    email: "n.mbarga@cs-sainte-marie.cm",
    phone: "+237 691 42 87 10",
    role: "SCHOOL_ADMIN",
    status: "ACTIVE",
    joinedAt: "2025-08-15",
    lastActiveAt: "2026-11-20T08:47:00Z",
  },
  {
    id: "mem_03",
    name: "André Kamga",
    email: "a.kamga@cs-sainte-marie.cm",
    phone: "+237 677 88 22 41",
    role: "CASHIER",
    status: "ACTIVE",
    joinedAt: "2025-09-02",
    lastActiveAt: "2026-11-20T11:20:00Z",
  },
  {
    id: "mem_04",
    name: "Rosine Ngo Bassa",
    email: "r.ngo@cs-sainte-marie.cm",
    phone: "+237 699 15 60 27",
    role: "ACCOUNTANT",
    status: "ACTIVE",
    joinedAt: "2025-10-10",
    lastActiveAt: "2026-11-19T16:40:00Z",
  },
  {
    id: "mem_05",
    name: "Blaise Tchaptchet",
    email: "b.tchaptchet@cs-sainte-marie.cm",
    phone: "+237 673 04 19 88",
    role: "TEACHER",
    status: "ACTIVE",
    joinedAt: "2026-09-05",
    lastActiveAt: "2026-11-18T11:05:00Z",
  },
  {
    id: "mem_06",
    name: "Claire Ewang",
    email: "c.ewang@cs-sainte-marie.cm",
    phone: "+237 690 71 36 52",
    role: "CASHIER",
    status: "ACTIVE",
    joinedAt: "2026-09-02",
    lastActiveAt: "2026-11-17T14:22:00Z",
  },
  {
    id: "mem_07",
    name: "Marthe Ekollo",
    email: "m.ekollo@cs-sainte-marie.cm",
    phone: "+237 655 28 90 14",
    role: "SCHOOL_ADMIN",
    status: "SUSPENDED",
    joinedAt: "2025-12-01",
    lastActiveAt: "2026-11-10T09:33:00Z",
  },
  {
    id: "mem_08",
    name: "Samuel Onana",
    email: "s.onana@cs-sainte-marie.cm",
    phone: "+237 698 33 77 05",
    role: "CASHIER",
    status: "INVITED",
    joinedAt: "2026-11-18",
    lastActiveAt: "",
  },
];
