"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { cn } from "@payskool/ui/utils";
import { CalendarRange, Check, ChevronLeft, FlaskConical, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import {
  PAYSKOOL_PLANS,
  planPrice,
  type BillingCycle,
  type BillingPlanId,
  type FakeSubscription,
} from "@/core/mocks/platform-billing-db";
import { formatCFA } from "@/lib/format";

const CYCLE_LABELS: Record<BillingCycle, string> = {
  MONTHLY: "Mensuel",
  ANNUAL: "Annuel (−15 %)",
};

interface ChangePlanDialogProps {
  current: FakeSubscription;
  preselect: BillingPlanId | null;
  onConfirm: (planId: BillingPlanId, cycle: BillingCycle) => Promise<FakeSubscription | null>;
  onDone: (subscription: FakeSubscription) => void;
  onClose: () => void;
}

export function ChangePlanDialog({ current, preselect, onConfirm, onDone, onClose }: ChangePlanDialogProps) {
  const [planId, setPlanId] = useState<BillingPlanId>(preselect ?? current.planId);
  const [cycle, setCycle] = useState<BillingCycle>(current.cycle);
  const [saved, setSaved] = useState<FakeSubscription | null>(null);

  const unchanged = planId === current.planId && cycle === current.cycle;
  const target = PAYSKOOL_PLANS.find((p) => p.id === planId)!;

  const confirm = async () => {
    const sub = await onConfirm(planId, cycle);
    if (!sub) return;
    setSaved(sub);
    onDone(sub);
  };

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
        <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 text-center shadow-xl">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-payskool-emerald/10">
            <Check className="size-7 text-payskool-emerald" />
          </span>
          <h3 className="mt-3 font-display text-lg font-bold text-foreground">Abonnement mis à jour</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            Votre établissement est passé au plan{" "}
            <span className="font-semibold text-foreground">{saved.planId}</span> ({CYCLE_LABELS[saved.cycle].split(" ")[0]}) à{" "}
            <span className="font-mono font-semibold text-foreground">{formatCFA(saved.price)}</span> /
            {saved.cycle === "MONTHLY" ? "mois" : "an"}. Le prorata du mois en cours sera ajusté sur la prochaine facture.
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
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-payskool-emerald/10">
            <Sparkles className="size-4 text-payskool-emerald" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Changer d’abonnement</h2>
            <p className="text-xs text-muted-foreground">Forcez les limites, les relances et la facturation.</p>
          </div>
        </div>

        <div className="mb-4 grid gap-2">
          {PAYSKOOL_PLANS.map((p) => {
            const active = planId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanId(p.id)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors",
                  active ? "border-payskool-emerald bg-payskool-emerald/5 ring-1 ring-payskool-emerald" : "border-border hover:border-payskool-emerald/50",
                )}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {p.name}
                    {p.id === current.planId && (
                      <span className="ml-2 rounded bg-payskool-emerald/10 px-1.5 py-0.5 text-[10px] font-semibold text-payskool-emerald">
                        Actuel
                      </span>
                    )}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">{p.tagline}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-sm font-bold text-foreground">
                    {formatCFA(planPrice(p.id, cycle))}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">{CYCLE_LABELS[cycle].split(" (")[0]}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 p-1">
          {(Object.keys(CYCLE_LABELS) as BillingCycle[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCycle(c)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                cycle === c ? "bg-payskool-navy text-white" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {c === "ANNUAL" ? <CalendarRange className="size-3.5" /> : <FlaskConical className="size-3.5" />}
              {CYCLE_LABELS[c]}
            </button>
          ))}
        </div>

        <p className="mt-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
          Prochaine échéance le <span className="font-semibold text-foreground">{new Date(current.renewsAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</span> ·
          Prorata appliqué sur {target.name} · Facture mensuelle ou annuelle selon le cycle choisi.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" className="gap-1" onClick={onClose}>
            <ChevronLeft className="size-4" /> Retour
          </Button>
          <div className="flex-1" />
          <Button variant="emerald" size="lg" className="gap-1.5" disabled={unchanged} onClick={confirm}>
            <ShieldCheck className="size-4" /> Passer au plan {target.name}
          </Button>
        </div>
      </div>
    </div>
  );
}