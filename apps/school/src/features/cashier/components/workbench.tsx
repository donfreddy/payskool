import { Badge } from "@payskool/ui/components/ui/badge";
import { cn } from "@payskool/ui/utils";
import { ArrowRight, MousePointerClick } from "lucide-react";

import { StudentAvatar } from "@/components/shared/student-avatar";
import { previousAcademicYear } from "@/core/mocks/academic-years-db";
import type { FakeStudent } from "@/core/mocks/fake-data";
import { RegisterForm, type RegisterFormProps } from "@/features/cashier/components/register-form";
import { TrancheStrip } from "@/features/cashier/components/tranche-strip";
import { computeStudentBalance } from "@/lib/fees";
import { formatCFA, formatFullDate } from "@/lib/format";

function getNextDue(student: FakeStudent): { id: string; amount: number } {
  for (const i of student.feePlan.installments) {
    const remaining = i.amount - i.paid;
    if (remaining > 0) return { id: i.id, amount: remaining };
  }
  return { id: "", amount: 0 };
}

export function Workbench({
  student,
  draft,
  onChangeDraft,
  onConfirm,
}: {
  student: FakeStudent | null;
  draft: RegisterFormProps["draft"];
  onChangeDraft: RegisterFormProps["onChange"];
  onConfirm: RegisterFormProps["onConfirm"];
}) {
  if (!student) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
          <MousePointerClick className="size-5 text-muted-foreground" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-foreground">Guichet prêt</h2>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Sélectionnez un élève dans la liste pour consulter son solde et encaisser son règlement.
        </p>
        <p className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowRight className="size-3.5 text-payskool-emerald" /> Cherchez par nom, matricule ou classe
        </p>
      </section>
    );
  }

  const balance = computeStudentBalance(student);
  const due = getNextDue(student);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="bg-payskool-navy px-5 py-4 text-white">
        <div className="flex flex-wrap items-center gap-3">
          <StudentAvatar firstName={student.firstName} lastName={student.lastName} gender={student.gender} className="border border-white/20" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-bold tracking-tight">
                {student.firstName} {student.lastName}
              </h2>
              <Badge variant="outline" className="rounded-md border-white/20 bg-white/10 text-[10px] text-white/80">
                {student.matricule}
              </Badge>
            </div>
            <p className="text-sm text-white/70">
              {student.classLevel} · {student.feePlan.label}
              {student.feePlan.discountLabel && (
                <span className="ml-2 rounded bg-payskool-emerald/30 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                  {student.feePlan.discountLabel}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-white/50">Solde à encaisser</p>
            <p className={cn("font-mono text-3xl font-bold tracking-tight", balance.remaining === 0 ? "text-emerald-300" : "text-white")}>
              {formatCFA(balance.remaining)}
            </p>
          </div>
          <div className="text-right text-xs text-white/60">
            <p>
              Dû : <span className="font-semibold text-white">{formatCFA(balance.totalDue)}</span>
            </p>
            <p>
              Réglé : <span className="font-semibold text-white">{formatCFA(balance.paid)}</span>
            </p>
            {balance.arrears > 0 && (
              <p className="mt-0.5 text-payskool-orange">dont arriéré {formatCFA(balance.arrears)}</p>
            )}
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-payskool-emerald"
            style={{ width: `${Math.round(balance.progress * 100)}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-white/60">{Math.round(balance.progress * 100)} % de l’échéancier couvert</p>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Échéancier {student.academicYear}</h3>
            <span className="text-[11px] text-muted-foreground">{student.feePlan.installments.length} tranches</span>
          </div>
          <div className="space-y-2">
            {student.feePlan.installments.map((inst, i) => (
              <TrancheStrip key={inst.id} installment={inst} index={i} isDue={inst.id === due.id} />
            ))}
          </div>
          {student.previousBalance < 0 && (
            <p className="mt-3 rounded-lg bg-payskool-orange/10 px-3 py-2 text-xs font-medium text-payskool-orange">
              Arriéré reporté de {previousAcademicYear(student.academicYear)} : {formatCFA(-student.previousBalance)} — intégré au solde dû.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Encaissement</h3>
          <RegisterForm
            draft={draft}
            onChange={onChangeDraft}
            remaining={balance.remaining}
            nextDue={due.amount}
            onConfirm={onConfirm}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/30 px-5 py-3 text-[11px] text-muted-foreground">
        <span>
          Responsable légal : <span className="font-medium text-foreground">{student.parentName}</span> ·{" "}
          {student.parentPhone}
        </span>
        <span>Inscrit le {formatFullDate("2026-09-01")}</span>
      </div>
    </section>
  );
}