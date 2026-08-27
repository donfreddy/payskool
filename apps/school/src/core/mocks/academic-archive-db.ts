import type { AcademicYear } from "@/core/mocks/academic-years-db";
import {
  type FakeReceipt,
  type FakeStudent,
  type TxMethod,
} from "@/core/mocks/fake-data";

/** Archives en lecture seule des années passées : élèves et reçus clos.
 * Les années passées ne sont jamais modifiées par la démo — uniquement consultées.
 */

export interface AcademicArchiveYear {
  students: FakeStudent[];
  receipts: FakeReceipt[];
}

const CASHIER_NAMES = ["A. Kamga (Caissier)", "Erick Kouam"] as const;
const TX_METHOD_CYCLE: TxMethod[] = ["ORANGE_MONEY", "MTN_MOMO", "WAVE", "CASH", "CHEQUE"];

const Y25: FakeStudent[] = [
  {
    id: "arc_25_01",
    matricule: "STE-25-0041",
    firstName: "Sarah",
    lastName: "Talla",
    gender: "F",
    classLevel: "5ème A",
    academicYear: "2025-2026",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "M. Talla Simon",
    parentPhone: "+237 690 11 22 33",
    feePlan: {
      id: "fp_25_01",
      label: "Scolarité 5ème A — 2025-2026",
      installments: [
        { id: "i25_01a", label: "Tranche 1 — Inscription", amount: 90_000, paid: 90_000, dueDate: "2025-09-15" },
        { id: "i25_01b", label: "Tranche 2 — 1er Trimestre", amount: 110_000, paid: 110_000, dueDate: "2025-11-15" },
      ],
    },
  },
  {
    id: "arc_25_02",
    matricule: "STE-25-0058",
    firstName: "Eric",
    lastName: "Ngo'o",
    gender: "M",
    classLevel: "1ère C",
    academicYear: "2025-2026",
    status: "ENROLLED",
    previousBalance: 0,
    parentName: "M. Ngo'o Jean",
    parentPhone: "+237 677 88 99 00",
    feePlan: {
      id: "fp_25_02",
      label: "Scolarité 1ère C — 2025-2026",
      installments: [
        { id: "i25_02a", label: "Tranche 1 — Inscription", amount: 120_000, paid: 120_000, dueDate: "2025-09-15" },
        { id: "i25_02b", label: "Tranche 2 — 1er Trimestre", amount: 150_000, paid: 150_000, dueDate: "2025-11-15" },
      ],
    },
  },
  {
    id: "arc_25_03",
    matricule: "STE-25-0072",
    firstName: "Fatou",
    lastName: "Diop",
    gender: "F",
    classLevel: "3ème B",
    academicYear: "2025-2026",
    status: "ENROLLED",
    previousBalance: -60_000,
    parentName: "Mme Diop Awa",
    parentPhone: "+237 698 45 56 67",
    feePlan: {
      id: "fp_25_03",
      label: "Scolarité 3ème B — 2025-2026",
      installments: [
        { id: "i25_03a", label: "Tranche 1 — Inscription", amount: 100_000, paid: 100_000, dueDate: "2025-09-15" },
        { id: "i25_03b", label: "Tranche 2 — 1er Trimestre", amount: 120_000, paid: 60_000, dueDate: "2025-11-15" },
      ],
    },
  },
  {
    id: "arc_25_04",
    matricule: "STE-25-0019",
    firstName: "Michel",
    lastName: "Awono",
    gender: "M",
    classLevel: "Tle D",
    academicYear: "2025-2026",
    status: "GRADUATED",
    previousBalance: 0,
    parentName: "M. Awono Paul",
    parentPhone: "+237 691 23 34 45",
    feePlan: {
      id: "fp_25_04",
      label: "Scolarité Tle D — 2025-2026",
      installments: [
        { id: "i25_04a", label: "Tranche 1 — Inscription", amount: 130_000, paid: 130_000, dueDate: "2025-09-15" },
        { id: "i25_04b", label: "Tranche 2 — 1er Trimestre", amount: 160_000, paid: 160_000, dueDate: "2025-11-15" },
      ],
    },
  },
];

const Y24: FakeStudent[] = [
  {
    id: "arc_24_01",
    matricule: "STE-24-0103",
    firstName: "Célestin",
    lastName: "MBida",
    gender: "M",
    classLevel: "4ème A",
    academicYear: "2024-2025",
    status: "GRADUATED",
    previousBalance: 0,
    parentName: "M. MBida Charles",
    parentPhone: "+237 695 11 22 33",
    feePlan: {
      id: "fp_24_01",
      label: "Scolarité 4ème A — 2024-2025",
      installments: [
        { id: "i24_01a", label: "Tranche 1 — Inscription", amount: 85_000, paid: 85_000, dueDate: "2024-09-15" },
        { id: "i24_01b", label: "Tranche 2 — 1er Trimestre", amount: 105_000, paid: 105_000, dueDate: "2024-11-15" },
      ],
    },
  },
  {
    id: "arc_24_02",
    matricule: "STE-24-0117",
    firstName: "Raïssa",
    lastName: "Ekani",
    gender: "F",
    classLevel: "6ème C",
    academicYear: "2024-2025",
    status: "GRADUATED",
    previousBalance: 0,
    parentName: "Mme Ekani Rose",
    parentPhone: "+237 699 44 55 66",
    feePlan: {
      id: "fp_24_02",
      label: "Scolarité 6ème C — 2024-2025",
      installments: [
        { id: "i24_02a", label: "Tranche 1 — Inscription", amount: 80_000, paid: 80_000, dueDate: "2024-09-15" },
        { id: "i24_02b", label: "Tranche 2 — 1er Trimestre", amount: 100_000, paid: 100_000, dueDate: "2024-11-15" },
      ],
    },
  },
  {
    id: "arc_24_03",
    matricule: "STE-24-0130",
    firstName: "Roger",
    lastName: "Koum",
    gender: "M",
    classLevel: "2nde A",
    academicYear: "2024-2025",
    status: "GRADUATED",
    previousBalance: -40_000,
    parentName: "M. Koum Serge",
    parentPhone: "+237 677 66 77 88",
    feePlan: {
      id: "fp_24_03",
      label: "Scolarité 2nde A — 2024-2025",
      installments: [
        { id: "i24_03a", label: "Tranche 1 — Inscription", amount: 100_000, paid: 100_000, dueDate: "2024-09-15" },
        { id: "i24_03b", label: "Tranche 2 — 1er Trimestre", amount: 125_000, paid: 85_000, dueDate: "2024-11-15" },
      ],
    },
  },
];

const YEAR_END: Record<AcademicYear, number> = {
  "2024-2025": new Date("2025-06-30T00:00:00Z").getTime(),
  "2025-2026": new Date("2026-06-30T00:00:00Z").getTime(),
  "2026-2027": new Date("2027-06-30T00:00:00Z").getTime(),
};

function buildArchiveReceipts(year: AcademicYear, students: FakeStudent[], startSeq: number): FakeReceipt[] {
  const yearEnd = YEAR_END[year] ?? Date.now();

  const out: FakeReceipt[] = [];
  let seq = startSeq;

  students.forEach((s, si) => {
    s.feePlan.installments.forEach((inst, ii) => {
      if (inst.paid <= 0) return;
      const due = new Date(`${inst.dueDate}T00:00:00Z`).getTime();
      const paidAt = Math.min(Math.floor(due + (ii * 2 + 1) * 24 * 3600 * 1000), yearEnd);
      const method = TX_METHOD_CYCLE[(si + ii) % TX_METHOD_CYCLE.length]!;
      out.push({
        id: `arc_rec_${s.id}_${ii}`,
        number: `#${seq++}`,
        studentId: s.id,
        studentName: `${s.firstName} ${s.lastName}`,
        classLevel: s.classLevel,
        matricule: s.matricule,
        academicYear: year,
        amount: inst.paid,
        method,
        ...(method === "CHEQUE"
          ? { chequeNumber: `AFC${4211 + si * 7 + ii}`, chequeBank: si % 2 ? "SCB Cameroun" : "Afriland First Bank" }
          : {}),
        allocations: [{ installmentId: inst.id, label: inst.label, amount: inst.paid }],
        cashier: CASHIER_NAMES[(si + ii) % 2]!,
        createdAt: new Date(paidAt).toISOString(),
      });
    });
  });

  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const ACADEMIC_ARCHIVE: Record<AcademicYear, AcademicArchiveYear> = {
  "2024-2025": {
    students: Y24,
    receipts: buildArchiveReceipts("2024-2025", Y24, 6100),
  },
  "2025-2026": {
    students: Y25,
    receipts: buildArchiveReceipts("2025-2026", Y25, 7300),
  },
  "2026-2027": { students: [], receipts: [] },
};

export function getArchiveYear(year: AcademicYear): AcademicArchiveYear | undefined {
  return ACADEMIC_ARCHIVE[year];
}