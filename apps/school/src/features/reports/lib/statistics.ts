import {
  MOCK_NOW,
  type FakeReceipt,
  type FakeStudent,
  type TxMethod,
} from "@/core/mocks/fake-data";
import { computeStudentBalance } from "@/lib/fees";

// ---------------------------------------------------------------------------
// Recouvrement global & par mode de paiement
// ---------------------------------------------------------------------------

export interface MethodShare {
  method: TxMethod;
  amount: number;
  count: number;
}

export const METHOD_ORDER: TxMethod[] = ["CASH", "CHEQUE", "ORANGE_MONEY", "MTN_MOMO", "WAVE"];

/** Répartition des encaissements par mode, à partir du registre des reçus. */
export function methodShares(receipts: FakeReceipt[]): MethodShare[] {
  const acc = new Map<TxMethod, { amount: number; count: number }>();
  for (const r of receipts) {
    const cur = acc.get(r.method) ?? { amount: 0, count: 0 };
    acc.set(r.method, { amount: cur.amount + r.amount, count: cur.count + 1 });
  }
  return METHOD_ORDER.filter((m) => acc.has(m)).map((m) => {
    const agg = acc.get(m)!;
    return { method: m, amount: agg.amount, count: agg.count };
  });
}

export interface GlobalCollection {
  totalDue: number;
  collected: number;
  remaining: number;
  recovery: number; // 0 → 100
  uptoDate: number; // nb d'élèves sans retard
}

export function globalCollection(students: FakeStudent[]): GlobalCollection {
  const balances = students.map((s) => computeStudentBalance(s));
  const totalDue = balances.reduce((sum, b) => sum + b.totalDue, 0);
  const collected = balances.reduce((sum, b) => sum + b.paid, 0);
  return {
    totalDue,
    collected,
    remaining: Math.max(totalDue - collected, 0),
    recovery: totalDue > 0 ? Math.round((collected / totalDue) * 100) : 100,
    uptoDate: balances.filter((b) => !b.hasOverdue).length,
  };
}

// ---------------------------------------------------------------------------
// Impayés & relances
// ---------------------------------------------------------------------------

export interface OverdueTranche {
  label: string;
  dueDate: string; // "yyyy-mm-dd"
  amount: number;
  paid: number;
  unpaid: number;
  daysLate: number;
}

export interface OverdueStudent {
  student: FakeStudent;
  status: ReturnType<typeof computeStudentBalance>["status"];
  remaining: number; // reste total à encaisser
  arrears: number; // arriéré reporté depuis l'année précédente
  tranches: OverdueTranche[]; // tranches échues non soldées, ordre de l'échéancier
  oldest: OverdueTranche; // la plus ancienne tranche échue
  daysLate: number; // latence maximale (dérivée de la tranche la plus ancienne)
}

const DAY = 24 * 3600 * 1000;

function daysLate(dueDate: string, now: Date): number {
  const due = new Date(`${dueDate}T00:00:00`);
  return now > due ? Math.floor((now.getTime() - due.getTime()) / DAY) : 0;
}

/** Élèves en défaut de paiement (au moins une tranche échue non soldée). */
export function overdueStudents(students: FakeStudent[], now: Date = MOCK_NOW): OverdueStudent[] {
  const out: OverdueStudent[] = [];
  for (const student of students) {
    const balance = computeStudentBalance(student, now);
    if (!balance.hasOverdue) continue;

    const tranches: OverdueTranche[] = [];
    let maxLate = 0;
    for (const i of student.feePlan.installments) {
      const unpaid = i.amount - i.paid;
      if (unpaid > 0 && new Date(`${i.dueDate}T00:00:00`) < now) {
        const late = daysLate(i.dueDate, now);
        maxLate = Math.max(maxLate, late);
        tranches.push({
          label: i.label,
          dueDate: i.dueDate,
          amount: i.amount,
          paid: i.paid,
          unpaid,
          daysLate: late,
        });
      }
    }
    if (tranches.length === 0) continue;

    const oldest = tranches[0]!;
    out.push({
      student,
      status: balance.status,
      remaining: balance.remaining,
      arrears: balance.arrears,
      tranches,
      oldest,
      daysLate: maxLate,
    });
  }
  return out.sort((a, b) => b.daysLate - a.daysLate || b.remaining - a.remaining);
}

export interface OverdueBucket {
  key: "0-7" | "8-30" | "30+";
  label: string;
  count: number;
  amount: number;
}

/** Répartition de l'encours en défaut par tranche de latence (durée d'impayé max). */
export function overdueBuckets(overdue: OverdueStudent[]): OverdueBucket[] {
  const buckets: Record<OverdueBucket["key"], { count: number; amount: number }> = {
    "0-7": { count: 0, amount: 0 },
    "8-30": { count: 0, amount: 0 },
    "30+": { count: 0, amount: 0 },
  };
  for (const o of overdue) {
    const key = o.daysLate < 8 ? "0-7" : o.daysLate < 31 ? "8-30" : "30+";
    buckets[key].count += 1;
    buckets[key].amount += o.remaining;
  }
  return [
    { key: "0-7", label: "0 – 7 jours", ...buckets["0-7"] },
    { key: "8-30", label: "8 – 30 jours", ...buckets["8-30"] },
    { key: "30+", label: "Plus de 30 jours", ...buckets["30+"] },
  ];
}

/** Montant cumulé des tranches échues non soldées (hors arriéré reporté). */
export function sumUnpaidTranches(overdue: OverdueStudent[]): number {
  return overdue.reduce((sum, o) => sum + o.tranches.reduce((s, t) => s + t.unpaid, 0), 0);
}