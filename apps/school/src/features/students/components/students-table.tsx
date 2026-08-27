import { Button } from "@payskool/ui/components/ui/button";
import { cn } from "@payskool/ui/utils";
import { Eye, FileSpreadsheet, Inbox } from "lucide-react";

import { PaymentBadge } from "@/components/shared/payment-badge";
import { StudentAvatar } from "@/components/shared/student-avatar";
import type { FakeStudent } from "@/core/mocks/fake-data";
import { computeStudentBalance, isInstallmentOverdue } from "@/lib/fees";
import { formatCFA } from "@/lib/format";

function dotTone(amount: number, paid: number, dueDate: string) {
  if (paid >= amount) return "bg-payskool-emerald";
  if (isInstallmentOverdue(dueDate, paid, amount)) return "bg-payskool-orange";
  if (paid > 0) return "bg-blue-500";
  return "bg-slate-300";
}

export function StudentsTable({
  students,
  onOpen,
}: {
  students: FakeStudent[];
  onOpen: (id: string) => void;
}) {
  if (students.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <Inbox className="size-8 text-muted-foreground" />
        <h3 className="mt-3 text-base font-semibold text-foreground">Aucun élève à afficher</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Modifiez les filtres, ou importez une liste depuis un fichier CSV/Excel pour peupler l’année scolaire.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Élève</th>
              <th className="px-4 py-3 font-medium">Classe</th>
              <th className="px-4 py-3 font-medium">Statut de paiement</th>
              <th className="px-4 py-3 font-medium">Solde</th>
              <th className="px-4 py-3 font-medium">Échéancier</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const balance = computeStudentBalance(s);
              return (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="truncate font-mono text-[11px] text-muted-foreground">{s.matricule}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                      {s.classLevel}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <PaymentBadge status={balance.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <p className={cn("font-mono font-bold", balance.remaining > 0 ? "text-foreground" : "text-payskool-emerald")}>
                      {formatCFA(balance.remaining)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">/ {formatCFA(balance.totalDue)} dûs</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5" aria-label={`${s.feePlan.installments.length} tranches`}>
                      {s.feePlan.installments.map((i) => (
                        <span
                          key={i.id}
                          title={`${i.label} · ${formatCFA(Math.max(i.amount - i.paid, 0))} restants`}
                          className={cn("size-2.5 rounded-full", dotTone(i.amount, i.paid, i.dueDate))}
                        />
                      ))}
                      <span className="ml-1 text-[11px] text-muted-foreground">
                        {s.feePlan.installments.filter((i) => i.paid >= i.amount).length}/{s.feePlan.installments.length}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    <Button variant="outline" size="sm" onClick={() => onOpen(s.id)}>
                      <Eye className="size-3.5" /> Détails
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
        <span>{students.length} élève{students.length > 1 ? "s" : ""} affiché{students.length > 1 ? "s" : ""}</span>
        <span className="flex items-center gap-1.5">
          <FileSpreadsheet className="size-3.5" /> Export du registre disponible en PDF / CSV
        </span>
      </div>
    </section>
  );
}