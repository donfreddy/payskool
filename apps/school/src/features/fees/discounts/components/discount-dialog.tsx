"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import { Label } from "@payskool/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@payskool/ui/components/ui/select";
import { cn } from "@payskool/ui/utils";
import { BadgePercent, Save } from "lucide-react";
import { useState } from "react";

import { FAKE_DISCOUNT_TYPES } from "@/core/mocks/fake-data";
import type { FakeStudent } from "@/core/mocks/fake-data";
import type { DiscountPatch } from "@/features/fees/api/fees.mock";
import { computeStudentBalance } from "@/lib/fees";
import { formatCFA } from "@/lib/format";

const grossOf = (student: FakeStudent) =>
  student.feePlan.installments.reduce((sum, i) => sum + i.amount, 0);

export function DiscountDialog({
  student,
  onClose,
  onSave,
}: {
  student: FakeStudent;
  onClose: () => void;
  onSave: (patch: DiscountPatch) => void;
}) {
  const gross = grossOf(student);
  const before = computeStudentBalance(student);
  const [typeId, setTypeId] = useState(FAKE_DISCOUNT_TYPES[0]!.id);
  const [percent, setPercent] = useState(String(FAKE_DISCOUNT_TYPES[0]!.defaultPercent ?? 10));
  const [fixed, setFixed] = useState(String(FAKE_DISCOUNT_TYPES[0]!.defaultAmount ?? 0));

  const type = FAKE_DISCOUNT_TYPES.find((t) => t.id === typeId) ?? FAKE_DISCOUNT_TYPES[0]!;
  const pct = Math.max(0, Math.min(100, Number(percent) || 0));
  const amount = type.kind === "percent" ? Math.round((gross * pct) / 100) : (Number(fixed) || 0);
  const safeAmount = Math.min(amount, gross);

  const label =
    type.kind === "percent"
      ? `${type.label} ${pct} %`
      : `${type.label} · ${safeAmount.toLocaleString("fr-FR")} FCFA`;

  const projected = computeStudentBalance({
    ...student,
    feePlan: { ...student.feePlan, discountAmount: safeAmount, discountLabel: label },
  });

  const save = () => {
    if (safeAmount <= 0) return;
    onSave({ label, amount: safeAmount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-payskool-emerald/10">
            <BadgePercent className="size-4 text-payskool-emerald" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Attribuer un avantage</h2>
            <p className="text-xs text-muted-foreground">
              {student.firstName} {student.lastName} · {student.classLevel}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor="dt-type" className="text-xs text-muted-foreground">
              Type d’avantage
            </Label>
            <Select value={typeId} onValueChange={setTypeId}>
              <SelectTrigger id="dt-type" className="h-10 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FAKE_DISCOUNT_TYPES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type.kind === "percent" ? (
            <div className="grid gap-1.5">
              <Label htmlFor="dt-pct" className="text-xs text-muted-foreground">
                Pourcentage de réduction
              </Label>
              <div className="relative">
                <Input
                  id="dt-pct"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  className="h-10 pr-10 font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">%</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-1.5">
              <Label htmlFor="dt-fixed" className="text-xs text-muted-foreground">
                Montant de l’abattement (FCFA)
              </Label>
              <Input
                id="dt-fixed"
                type="number"
                inputMode="numeric"
                min={0}
                value={fixed}
                onChange={(e) => setFixed(e.target.value)}
                className="h-10 font-mono"
              />
            </div>
          )}

          <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Grille {student.classLevel}</span>
              <span className="font-mono font-semibold text-foreground">{formatCFA(gross)}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-muted-foreground">Abattement</span>
              <span className="font-mono font-bold text-payskool-emerald">{formatCFA(safeAmount)}</span>
            </div>
            <div className={cn("mt-1.5 flex items-center justify-between rounded-lg px-2 py-1.5", before.remaining > projected.remaining ? "bg-payskool-emerald/10" : "bg-secondary")}>
              <span className="text-xs font-medium text-muted-foreground">
                Total dû · {before.remaining > projected.remaining ? "avant → après" : "actuel"}
              </span>
              <span className="font-mono text-sm font-bold text-foreground">
                {formatCFA(before.totalDue)}
                {before.remaining > projected.remaining && (
                  <span className="text-payskool-emerald"> → {formatCFA(projected.totalDue)}</span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="emerald" size="lg" className="flex-1" disabled={safeAmount <= 0} onClick={save}>
            <Save className="size-4" /> Appliquer
          </Button>
        </div>
      </div>
    </div>
  );
}