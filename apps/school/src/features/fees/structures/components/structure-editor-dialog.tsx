"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import { Label } from "@payskool/ui/components/ui/label";
import { CalendarRange, Save } from "lucide-react";
import { useState } from "react";

import type { FakeFeeStructure } from "@/core/mocks/fake-data";
import { formatCFA } from "@/lib/format";

export function StructureEditorDialog({
  structure,
  onClose,
  onSaved,
}: {
  structure: FakeFeeStructure;
  onClose: () => void;
  onSaved: (installs: FakeFeeStructure["installments"]) => void;
}) {
  const [rows, setRows] = useState(() =>
    structure.installments.map((i) => ({ label: i.label, amount: i.amount, dueDate: i.dueDate })),
  );
  const total = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const patch = (index: number, field: keyof (typeof rows)[number], value: string | number) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-payskool-navy/10">
            <CalendarRange className="size-4 text-payskool-navy" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Échéancier · {structure.classLevel}</h2>
            <p className="text-xs text-muted-foreground">
              Modifiez les montants ou les dates — le total se recalcule automatiquement.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((row, i) => (
            <fieldset key={i} className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex flex-wrap items-end gap-2">
                <Label htmlFor={`st-label-${i}`} className="sr-only">
                  Libellé
                </Label>
                <Input
                  id={`st-label-${i}`}
                  value={row.label}
                  onChange={(e) => patch(i, "label", e.target.value)}
                  className="h-9 flex-1 min-w-40"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <div className="grid flex-1 gap-1">
                  <Label htmlFor={`st-amount-${i}`} className="text-xs text-muted-foreground">
                    Montant (FCFA)
                  </Label>
                  <Input
                    id={`st-amount-${i}`}
                    type="number"
                    inputMode="numeric"
                    value={row.amount}
                    onChange={(e) => patch(i, "amount", e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
                <div className="grid flex-1 gap-1">
                  <Label htmlFor={`st-due-${i}`} className="text-xs text-muted-foreground">
                    Échéance
                  </Label>
                  <Input
                    id={`st-due-${i}`}
                    type="date"
                    value={row.dueDate}
                    onChange={(e) => patch(i, "dueDate", e.target.value)}
                    className="h-9 font-mono"
                  />
                </div>
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-payskool-navy px-4 py-3 text-white">
          <span className="font-mono text-xs uppercase tracking-widest text-white/60">Total grille</span>
          <span className="font-mono text-lg font-bold text-payskool-emerald">{formatCFA(total)}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="emerald"
            size="lg"
            className="flex-1"
            disabled={total <= 0 || rows.some((r) => !r.label.trim())}
            onClick={() => onSaved(rows)}
          >
            <Save className="size-4" /> Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}