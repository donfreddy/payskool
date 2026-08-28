import { CheckCircle2, CircleDollarSign, AlertTriangle, GraduationCap } from "lucide-react";

import type { FakeStudent } from "@/core/mocks/fake-data";
import { computeStudentBalance, type PaymentStatus } from "@/lib/fees";

const accents: Record<PaymentStatus, string> = {
  PAID: "text-payskool-emerald",
  AHEAD: "text-cyan-700",
  PARTIAL: "text-blue-700",
  OVERDUE: "text-payskool-orange",
  UNPAID: "text-muted-foreground",
};

export function computeSummary(students: FakeStudent[]) {
  const counts: Record<PaymentStatus, number> = { PAID: 0, AHEAD: 0, PARTIAL: 0, OVERDUE: 0, UNPAID: 0 };
  for (const s of students) {
    counts[computeStudentBalance(s).status] += 1;
  }
  return counts;
}

export function SummaryStrip({ students, year }: { students: FakeStudent[]; year: string }) {
  const counts = computeSummary(students);
  const rows = [
    { key: "PAID" as const, label: "Payés", value: counts.PAID, icon: CheckCircle2 },
    { key: "AHEAD" as const, label: "À jour", value: counts.AHEAD, icon: CircleDollarSign },
    { key: "OVERDUE" as const, label: "En retard", value: counts.OVERDUE + counts.UNPAID, icon: AlertTriangle },
    { key: "PARTIAL" as const, label: "Partiels", value: counts.PARTIAL, icon: GraduationCap },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground">Total effectif</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          {students.length}
          <span className="ml-1.5 text-sm font-medium text-muted-foreground">élèves</span>
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Année {year}</p>
      </div>
      {rows.map(({ key, label, value, icon: Icon }) => (
        <div key={key} className="rounded-xl border border-border bg-card p-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Icon className={`size-3.5 ${accents[key]}`} /> {label}
          </p>
          <p className={`mt-1 text-2xl font-bold tracking-tight ${accents[key]}`}>{value}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {students.length > 0 ? Math.round((value / students.length) * 100) : 0} % de l’effectif
          </p>
        </div>
      ))}
    </section>
  );
}