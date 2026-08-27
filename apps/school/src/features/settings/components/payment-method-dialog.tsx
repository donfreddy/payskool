"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { cn } from "@payskool/ui/utils";
import { Check, ChevronLeft, CreditCard, Landmark, Smartphone, Wallet } from "lucide-react";
import { useState } from "react";

import {
  PAYMENT_METHOD_OPTIONS,
  type FakePaymentMethod,
} from "@/core/mocks/platform-billing-db";

const METHOD_ICONS: Record<FakePaymentMethod["kind"], typeof CreditCard> = {
  DIRECT_DEBIT: Landmark,
  CARD: CreditCard,
  MOBILE_MONEY: Smartphone,
};

interface PaymentMethodDialogProps {
  current: FakePaymentMethod;
  onConfirm: (method: FakePaymentMethod) => Promise<FakePaymentMethod | null>;
  onDone: (method: FakePaymentMethod) => void;
  onClose: () => void;
}

export function PaymentMethodDialog({ current, onConfirm, onDone, onClose }: PaymentMethodDialogProps) {
  const [kind, setKind] = useState<FakePaymentMethod["kind"]>(current.kind);
  const [saved, setSaved] = useState<FakePaymentMethod | null>(null);

  const confirm = async () => {
    const method = PAYMENT_METHOD_OPTIONS.find((m) => m.kind === kind);
    if (!method) return;
    const updated = await onConfirm(method);
    if (!updated) return;
    setSaved(updated);
    onDone(updated);
  };

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
        <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 text-center shadow-xl">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-payskool-emerald/10">
            <Check className="size-7 text-payskool-emerald" />
          </span>
          <h3 className="mt-3 font-display text-lg font-bold text-foreground">Moyen de paiement mis à jour</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            Les prochaines factures Payskool seront prélevées sur{" "}
            <span className="font-semibold text-foreground">{saved.detail}</span> <span className="font-medium">({saved.label}).</span>
          </p>
          <Button variant="emerald" size="lg" className="mt-5" onClick={onClose}>
            <Check className="size-4" /> Terminer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-payskool-emerald/10">
            <Wallet className="size-4 text-payskool-emerald" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Moyen de paiement</h2>
            <p className="text-xs text-muted-foreground">Où prélever la facture Payskool de votre école.</p>
          </div>
        </div>

        <div className="mb-4 grid gap-2">
          {PAYMENT_METHOD_OPTIONS.map((m) => {
            const Icon = METHOD_ICONS[m.kind];
            const active = kind === m.kind;
            return (
              <button
                key={m.kind}
                type="button"
                onClick={() => setKind(m.kind)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  active ? "border-payskool-emerald bg-payskool-emerald/5 ring-1 ring-payskool-emerald" : "border-border hover:border-payskool-emerald/50",
                )}
              >
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", active ? "bg-payskool-emerald/10" : "bg-muted")}>
                  <Icon className={cn("size-4", active ? "text-payskool-emerald" : "text-muted-foreground")} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{m.label}</span>
                  <span className="block font-mono text-[11px] text-muted-foreground">{m.detail}</span>
                </span>
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border",
                    active ? "border-payskool-emerald bg-payskool-emerald" : "border-border",
                  )}
                >
                  {active && <Check className="size-3 text-white" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1" onClick={onClose}>
            <ChevronLeft className="size-4" /> Retour
          </Button>
          <div className="flex-1" />
          <Button variant="emerald" size="lg" className="gap-1.5" disabled={kind === current.kind} onClick={confirm}>
            <Wallet className="size-4" /> Enregistrer le moyen
          </Button>
        </div>
      </div>
    </div>
  );
}