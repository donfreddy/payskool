"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import { cn } from "@payskool/ui/utils";
import {
  ArrowLeftRight,
  CheckCircle2,
  ExternalLink,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { StudentAvatar } from "@/components/shared/student-avatar";
import { TxMethodBadge } from "@/components/shared/tx-method-badge";
import {
  listPayments,
  refundPayment,
  simulateParentPaymentFromPortal,
} from "@/features/payments/api/payments.mock";
import type { OnlinePayment, OnlinePaymentStatus } from "@/features/payments/types";
import { formatCFA, formatShortDate, formatTime } from "@/lib/format";

const STATUS_META: Record<OnlinePaymentStatus, { label: string; tone: string; icon: typeof CheckCircle2 }> = {
  SETTLED: { label: "Encaissé", tone: "bg-payskool-emerald/10 text-payskool-emerald", icon: CheckCircle2 },
  REFUNDED: { label: "Remboursé", tone: "bg-secondary text-muted-foreground", icon: RotateCcw },
};

export function OnlinePaymentsBoard({ schoolId }: { schoolId: string }) {
  const [payments, setPayments] = useState<OnlinePayment[] | null>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | OnlinePaymentStatus>("all");
  const [refunding, setRefunding] = useState<string | null>(null);

  const refresh = () => listPayments(schoolId).then(setPayments);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  const filtered = useMemo(() => {
    if (!payments) return [];
    const q = query.trim().toLowerCase();
    return payments.filter((p) => {
      if (tab !== "all" && p.status !== tab) return false;
      if (
        q &&
        !`${p.firstName} ${p.lastName} ${p.matricule} ${p.ref} ${p.parentName} ${p.phone}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [payments, query, tab]);

  if (!payments) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement des paiements en ligne…
      </div>
    );
  }

  const settled = payments.filter((p) => p.status === "SETTLED");
  const settledAmount = settled.reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount = payments
    .filter((p) => p.status === "REFUNDED")
    .reduce((sum, p) => sum + p.amount, 0);

  const doRefund = (p: OnlinePayment) => {
    setRefunding(p.id);
    refundPayment(p.id).then(() => {
      setRefunding(null);
      refresh();
    });
  };

  const doSimulate = () => {
    simulateParentPaymentFromPortal().then(refresh);
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Paiements en ligne · MoMo & Wave
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-tight">{settled.length}</p>
              <p className="mt-1 text-xs text-white/60">
                encaissés automatiquement · {formatCFA(settledAmount)}
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Encaissés" v={`${settled.length}`} sub={formatCFA(settledAmount)} />
              <Band k="Remboursés" v={`${payments.length - settled.length}`} sub={formatCFA(refundedAmount)} />
              <Band k="Reçus émis" v={`${settled.length}`} sub="reçus + transactions" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-payskool-emerald" />
            Confirmés par le PSP (webhook) → <span className="font-semibold text-foreground">encaissés
            et reçus émis automatiquement</span>, sans action de l’école.{" "}
            <span className="text-muted-foreground/70">Matching par numéro de téléphone sur la fiche élève.</span>
          </p>
          <Button variant="outline" size="sm" onClick={doSimulate}>
            <Smartphone /> Paiement Parent Simulé
          </Button>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher élève, matricule, réf, téléphone…"
            className="w-80 pl-8"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-secondary/60 p-1">
          {(
            [
              ["all", "Tous"],
              ["SETTLED", "Encaissés"],
              ["REFUNDED", "Remboursés"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Transaction PSP</th>
                <th className="px-4 py-3 font-medium">Élève / parent</th>
                <th className="px-4 py-3 text-right font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Reçu le</th>
                <th className="px-4 py-3 font-medium">Reçu émis</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Aucun paiement en ligne ne correspond à ce filtre.
                  </td>
                </tr>
              )}
              {filtered.map((p) => {
                const status = STATUS_META[p.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="whitespace-nowrap px-5 py-3">
                      <TxMethodBadge method={p.operator} />
                      <p className="mt-1 font-mono text-xs text-muted-foreground">{p.ref}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <StudentAvatar firstName={p.firstName} lastName={p.lastName} gender={p.gender} />
                        <div>
                          <p className="font-medium text-foreground">
                            {p.firstName} {p.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.matricule} · {p.classLevel}
                            <span className="text-muted-foreground/70">
                              {" "}· {p.parentName} · {p.phone}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-semibold text-foreground">
                      {formatCFA(p.amount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="font-mono text-xs text-foreground">
                        {formatShortDate(p.createdAt.slice(0, 10))}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{formatTime(p.createdAt)}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`/${schoolId}/receipts?year=${p.academicYear}`}
                        className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-payskool-navy underline-offset-2 hover:underline"
                      >
                        <ReceiptText className="size-3.5" /> {p.receiptNumber}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold",
                          status.tone,
                        )}
                      >
                        <StatusIcon className="size-3.5" /> {status.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      {p.status === "SETTLED" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={refunding === p.id}
                          onClick={() => doRefund(p)}
                        >
                          <ArrowLeftRight /> Rembourser
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/30 px-5 py-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-payskool-orange" />
            Les fonds Mobile Money sont crédités sur le compte marchand de l’école ·{" "}
            <a
              href={`/${schoolId}/settings/payment-providers`}
              className="inline-flex items-center gap-1 font-semibold text-payskool-navy underline-offset-2 hover:underline"
            >
              configurer les intégrations <ExternalLink className="size-3" />
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

function Band({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div>
      <p className="font-mono text-xl font-bold text-white">{v}</p>
      <p className="mt-0.5 text-center text-[10px] uppercase tracking-wide text-white/50">{k}</p>
      <p className="text-center font-mono text-[10px] text-white/40">{sub}</p>
    </div>
  );
}