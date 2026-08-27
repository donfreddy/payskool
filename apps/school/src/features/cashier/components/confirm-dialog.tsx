import { Button } from "@payskool/ui/components/ui/button";
import { AlertTriangle, Check, X } from "lucide-react";

import type { FakeStudent } from "@/core/mocks/fake-data";
import { allocateFIFO } from "@/lib/fees";
import { formatCFA } from "@/lib/format";

export function ConfirmDialog({
  open,
  student,
  amount,
  methodLabel,
  chequeContext,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  student: FakeStudent | null;
  amount: number;
  methodLabel: string;
  chequeContext: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open || !student) return null;

  const allocations = allocateFIFO(student, amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} aria-label="Fermer" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="Annuler"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-2 text-payskool-emerald">
          <AlertTriangle className="size-5" />
          <h2 className="text-base font-bold text-foreground">Confirmer l’encaissement</h2>
        </div>

        <p className="mt-3 text-sm text-foreground">
          Encaisser <span className="font-mono font-bold text-payskool-emerald">{formatCFA(amount)}</span> en{" "}
          <span className="font-semibold">{methodLabel}</span>
          {chequeContext && <span className="text-muted-foreground"> ({chequeContext})</span>} pour{" "}
          <span className="font-semibold">{student.firstName} {student.lastName}</span> ({student.classLevel}).
        </p>

        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Allocation sur l’échéancier (FIFO)
          </p>
          <ul className="mt-2 space-y-1.5">
            {allocations.map((a) => {
              const inst = student.feePlan.installments.find((i) => i.id === a.installmentId)!;
              return (
                <li key={a.installmentId} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Check className="size-3.5 text-payskool-emerald" />
                    {inst.label}
                  </span>
                  <span className="font-mono font-semibold text-foreground">{formatCFA(a.amount)}</span>
                </li>
              );
            })}
            {allocations.length === 0 && (
              <li className="text-sm text-muted-foreground">
                Élève à jour — le montant sera porté en avance.
              </li>
            )}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-sm">
            <span className="font-semibold text-foreground">Total reçu</span>
            <span className="font-mono text-base font-bold text-payskool-emerald">{formatCFA(amount)}</span>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button variant="outline" size="lg" className="flex-1" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="emerald" size="lg" className="flex-1" onClick={onConfirm}>
            <Check /> Confirmer & imprimer
          </Button>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Le reçu sera remis au parent · l’écriture est définitive dans le registre.
        </p>
      </div>
    </div>
  );
}