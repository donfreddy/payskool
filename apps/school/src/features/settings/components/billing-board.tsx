"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { cn } from "@payskool/ui/utils";
import {
  CalendarRange,
  Check,
  CircleDollarSign,
  CreditCard,
  Download,
  Landmark,
  Pencil,
  ReceiptText,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { FakeSubscription } from "@/core/mocks/platform-billing-db";
import {
  PAYSKOOL_PLANS,
  planPrice,
  type BillingCycle,
  type BillingPlanId,
  type FakeBillingInvoice,
} from "@/core/mocks/platform-billing-db";
import { listStudentsForFees } from "@/features/fees/api/fees.mock";
import {
  getSubscription,
  listInvoices,
  updateSubscription,
} from "@/features/settings/api/platform-billing.mock";
import { formatCFA, formatShortDate } from "@/lib/format";

import { InvoiceStatusBadge, SubscriptionStatusBadge } from "./billing-badges";
import { ChangePlanDialog } from "./change-plan-dialog";
import { PaymentMethodDialog } from "./payment-method-dialog";

const CYCLE_SUFFIX: Record<BillingCycle, string> = { MONTHLY: "/mois", ANNUAL: "/an" };

export function BillingBoard({ schoolId }: { schoolId: string }) {
  const [subscription, setSubscription] = useState<FakeSubscription | null>(null);
  const [invoices, setInvoices] = useState<FakeBillingInvoice[]>([]);
  const [students, setStudents] = useState(0);
  const [cycleView, setCycleView] = useState<BillingCycle>("MONTHLY");
  const [planDialog, setPlanDialog] = useState<{ open: boolean; preselect: BillingPlanId | null }>({ open: false, preselect: null });
  const [payOpen, setPayOpen] = useState(false);

  useEffect(() => {
    getSubscription(schoolId).then((s) => {
      setSubscription(s);
      setCycleView(s.cycle);
    });
    listInvoices(schoolId).then(setInvoices);
    listStudentsForFees(schoolId).then((studentsList) => setStudents(studentsList.length));
  }, [schoolId]);

  const currentPlan = useMemo(
    () => PAYSKOOL_PLANS.find((p) => p.id === subscription?.planId),
    [subscription],
  );

  if (!subscription) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement de la facturation…
      </div>
    );
  }

  const handlePlanConfirm = async (planId: BillingPlanId, cycle: BillingCycle) =>
    updateSubscription(schoolId, { planId, cycle });

  const handlePlanDone = (s: FakeSubscription) => {
    setSubscription(s);
    setCycleView(s.cycle);
  };

  const handlePayConfirm = async (method: FakeSubscription["paymentMethod"]) => {
    await updateSubscription(schoolId, { paymentMethod: method });
    return method;
  };

  const handlePayDone = (method: FakeSubscription["paymentMethod"]) =>
    setSubscription((s) => (s ? { ...s, paymentMethod: method } : s));

  const renewalLabel = new Date(subscription.renewsAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Facturation Payskool · Abonnement
              </p>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold tracking-tight">{currentPlan?.name ?? "—"}</h2>
                <SubscriptionStatusBadge status={subscription.status} />
              </div>
              <p className="mt-1 text-xs text-white/70">
                Cycle {subscription.cycle === "MONTHLY" ? "mensuel" : "annuel"} · depuis {formatShortDate(subscription.startedAt)}
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Prochain prélèvement" v={formatShortDate(subscription.renewsAt)} icon={<CalendarRange className="size-3.5 text-white/40" />} />
              <Band k="Montant facturé" v={formatCFA(subscription.price)} icon={<CircleDollarSign className="size-3.5 text-white/40" />} />
              <Band k="Moyen de paiement" v={subscription.paymentMethod.detail} icon={<Landmark className="size-3.5 text-white/40" />} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ReceiptText className="size-3.5 text-payskool-emerald" /> Facture envoyée chaque début de mois, prélèvement automatique.
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-payskool-orange" /> Prochaine échéance : {renewalLabel}.
          </span>
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CircleDollarSign className="size-4 text-payskool-navy" /> Votre abonnement
          </h2>
          <p className="mt-1 text-[11px] text-muted-foreground">{currentPlan?.tagline}</p>

          <ul className="mt-3 space-y-1.5">
            {currentPlan?.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="mt-0.5 size-3.5 shrink-0 text-payskool-emerald" /> {f}
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Élèves actifs (licence)</span>
              <span className="font-mono font-bold text-foreground">
                {students} / {subscription.seats === null ? "illimité" : subscription.seats}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-payskool-emerald"
                style={{
                  width: subscription.seats === null ? "18%" : `${Math.min(100, (students / subscription.seats) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {subscription.seats === null || students <= subscription.seats
                ? "Vous êtes dans votre quota, aucune sur-facturation."
                : `Dépassement de quota : ${students - subscription.seats!} élève(s) au-delà des places incluses.`}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button variant="emerald" className="gap-1.5" onClick={() => setPlanDialog({ open: true, preselect: null })}>
              <Sparkles className="size-4" /> Changer de plan
            </Button>
            <Button variant="outline" className="gap-1.5" onClick={() => setPlanDialog({ open: true, preselect: subscription.planId })}>
              <Pencil className="size-4" /> Modifier le cycle
            </Button>
          </div>
        </section>

        <aside className="flex flex-col gap-5">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Wallet className="size-4 text-payskool-navy" /> Moyen de paiement
            </h2>
            <div className="mt-3 flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-payskool-emerald/10">
                <CreditCard className="size-4 text-payskool-emerald" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{subscription.paymentMethod.label}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">{subscription.paymentMethod.detail}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3 h-8 gap-1.5 text-xs" onClick={() => setPayOpen(true)}>
              <Pencil className="size-3.5" /> Modifier le moyen
            </Button>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">À savoir</h2>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Les frais Payskool sont prélevés chaque début de mois sur le moyen choisi. Changer de plan applique un prorata
              sur la facture en cours ; les plans annuels bénéficient de −15 %.
            </p>
          </section>
        </aside>
      </div>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Choisir un plan</h2>
            <p className="text-[11px] text-muted-foreground">Remise de 15 % sur la facturation annuelle.</p>
          </div>
          <div className="flex items-center gap-1 self-start rounded-lg border border-border p-1 lg:self-auto">
            {(["MONTHLY", "ANNUAL"] as BillingCycle[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCycleView(c)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-semibold transition-colors",
                  cycleView === c ? "bg-payskool-navy text-white" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {c === "MONTHLY" ? "Mensuel" : "Annuel"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-3">
          {PAYSKOOL_PLANS.map((p) => {
            const isCurrent = subscription.planId === p.id;
            const price = planPrice(p.id, cycleView);
            return (
              <article
                key={p.id}
                className={cn(
                  "flex flex-col rounded-xl border p-4",
                  isCurrent ? "border-payskool-emerald bg-payskool-emerald/5 ring-1 ring-payskool-emerald" : "border-border bg-muted/20",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-payskool-emerald/10 px-1.5 py-0.5 text-[10px] font-semibold text-payskool-emerald">
                      <Check className="size-3" /> Plan actuel
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{p.tagline}</p>
                <p className="mt-3 font-mono text-2xl font-bold text-foreground">
                  {formatCFA(price)}
                  <span className="text-xs font-medium text-muted-foreground">{CYCLE_SUFFIX[cycleView]}</span>
                </p>
                {cycleView === "ANNUAL" && (
                  <p className="text-[11px] text-payskool-emerald">soit {formatCFA(Math.round(price / 12))}/mois</p>
                )}
                <ul className="mt-3 flex-1 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                      <Check className="mt-0.5 size-3 shrink-0 text-payskool-emerald" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  {isCurrent ? (
                    <Button variant="outline" size="lg" className="w-full gap-1.5" onClick={() => setPlanDialog({ open: true, preselect: p.id })}>
                      <Pencil className="size-4" /> Modifier le cycle
                    </Button>
                  ) : (
                    <Button variant="emerald" size="lg" className="w-full" onClick={() => setPlanDialog({ open: true, preselect: p.id })}>
                      Passer au plan {p.name}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Factures Payskool</h2>
          <span className="text-[11px] text-muted-foreground">
            {invoices.filter((i) => i.status === "PAID").length} payée(s) · dernière {invoices[0]?.period ?? "—"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Période</th>
                <th className="px-4 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Moyen</th>
                <th className="px-5 py-3 text-right font-medium">Facture</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="whitespace-nowrap px-5 py-3 text-xs font-medium text-foreground">{inv.period}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{inv.reference}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-foreground">
                    {inv.amount === 0 ? "Gratuit" : formatCFA(inv.amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-muted-foreground">{inv.paymentLabel}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px] text-muted-foreground" title="Télécharger le PDF (démo)">
                      <Download className="size-3.5" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
          Factures simulées pour la démo — téléchargement désactivé.
        </p>
      </section>

      {planDialog.open && (
        <ChangePlanDialog
          current={subscription}
          preselect={planDialog.preselect}
          onConfirm={handlePlanConfirm}
          onDone={handlePlanDone}
          onClose={() => setPlanDialog({ open: false, preselect: null })}
        />
      )}
      {payOpen && (
        <PaymentMethodDialog
          current={subscription.paymentMethod}
          onConfirm={handlePayConfirm}
          onDone={handlePayDone}
          onClose={() => setPayOpen(false)}
        />
      )}
    </div>
  );
}

function Band({ k, v, icon }: { k: string; v: string; icon?: ReactNode }) {
  return (
    <div>
      <p className="flex items-center justify-center gap-1.5 font-mono text-xl font-bold text-white">
        {icon}
        {v}
      </p>
      <p className="mt-0.5 text-center text-[10px] uppercase tracking-wide text-white/50">{k}</p>
    </div>
  );
}