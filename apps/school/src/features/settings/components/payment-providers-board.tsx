"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { ArrowLeftRight, Banknote, Landmark, Pause, Pencil, Play, PlugZap, Smartphone, Trash2, Wallet } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { FakeReceipt, TxMethod } from "@/core/mocks/fake-data";
import {
  PAYMENT_PROVIDER_CATALOG,
  providerFeePercent,
  type ConnectProviderInput,
  type FakePaymentPayout,
  type FakePaymentProviderConnection,
  type PaymentProviderKind,
} from "@/core/mocks/payment-providers-db";
import { listReceipts } from "@/features/receipts/api/receipts.mock";
import {
  addConnection,
  listConnections,
  listPayouts,
  removeConnection,
  saveConnection,
} from "@/features/settings/api/payment-providers.mock";
import { formatCFA, formatShortDate } from "@/lib/format";

import { ConnectProviderDialog } from "./connect-provider-dialog";
import { ConnectionStatusBadge, PayoutStatusBadge, ProviderKindBadge, ProviderLogo } from "./provider-badges";

const METHOD_KIND: Partial<Record<TxMethod, PaymentProviderKind>> = {
  MTN_MOMO: "MTN_MOMO",
  ORANGE_MONEY: "ORANGE_MONEY",
  WAVE: "WAVE",
};

export function PaymentProvidersBoard({ schoolId }: { schoolId: string }) {
  const [connections, setConnections] = useState<FakePaymentProviderConnection[] | null>(null);
  const [payouts, setPayouts] = useState<FakePaymentPayout[]>([]);
  const [receipts, setReceipts] = useState<FakeReceipt[]>([]);
  const [dialog, setDialog] = useState<{ open: boolean; editing: FakePaymentProviderConnection | null }>({
    open: false,
    editing: null,
  });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    listConnections(schoolId).then(setConnections);
    listPayouts(schoolId).then(setPayouts);
    listReceipts(schoolId).then(setReceipts);
  }, [schoolId]);

  const { onlineVolume, commission } = useMemo(() => {
    const online = receipts.filter((r) => r.method !== "CASH" && r.method !== "CHEQUE");
    return {
      onlineVolume: online.reduce((sum, r) => sum + r.amount, 0),
      commission: online.reduce((sum, r) => sum + (r.amount * providerFeePercent(METHOD_KIND[r.method] ?? "CARD")) / 100, 0),
    };
  }, [receipts]);

  const nextPayout = useMemo(
    () => payouts.filter((p) => p.status === "SCHEDULED").sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))[0],
    [payouts],
  );

  if (!connections) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement des intégrations…
      </div>
    );
  }

  const volumeOf = (kind: PaymentProviderKind) =>
    receipts.filter((r) => METHOD_KIND[r.method] === kind).reduce((sum, r) => sum + r.amount, 0);
  const countOf = (kind: PaymentProviderKind) => receipts.filter((r) => METHOD_KIND[r.method] === kind).length;

  const available = PAYMENT_PROVIDER_CATALOG.filter((c) => !connections.some((cn) => cn.kind === c.kind));

  const toggle = (conn: FakePaymentProviderConnection) => {
    saveConnection(schoolId, conn.id, { status: conn.status === "ACTIVE" ? "PAUSED" : "ACTIVE" }).then((updated) => {
      if (updated) setConnections((prev) => prev?.map((c) => (c.id === updated.id ? updated : c)) ?? prev);
    });
  };

  const unsubscribe = (conn: FakePaymentProviderConnection) => {
    removeConnection(schoolId, conn.id).then(() => {
      setConnections((prev) => prev?.filter((c) => c.id !== conn.id) ?? prev);
      setConfirmId(null);
    });
  };

  const handleSubmit = (input: ConnectProviderInput, providerId?: string) => {
    if (providerId) {
      return saveConnection(schoolId, providerId, { phone: input.phone, holder: input.holder, testMode: input.testMode });
    }
    return addConnection(schoolId, input);
  };

  const handleDone = (conn: FakePaymentProviderConnection) => {
    setConnections((prev) => {
      const exists = prev?.some((c) => c.kind === conn.kind);
      return exists ? prev?.map((c) => (c.kind === conn.kind ? conn : c)) ?? prev : [conn, ...(prev ?? [])];
    });
  };

  const sortedPayouts = [...payouts].sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Intégrations Paiement · Environnement test
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight">Moyens de paiement en ligne</h2>
              <p className="mt-1 text-xs text-white/70">Mobile money & cartes bancaires reliés au registre des reçus.</p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Collecté en ligne" v={formatCFA(onlineVolume)} icon={<Wallet className="size-3.5 text-white/40" />} />
              <Band k="Commission opérateur" v={formatCFA(Math.round(commission))} icon={<ArrowLeftRight className="size-3.5 text-white/40" />} />
              <Band
                k="Prochain règlement"
                v={nextPayout ? formatCFA(nextPayout.amount) : "—"}
                icon={<Landmark className="size-3.5 text-white/40" />}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Smartphone className="size-3.5 text-payskool-emerald" /> Les parents règlent via le lien de paiement ou le QR sur le reçu.
          </span>
          <span className="flex items-center gap-1.5">
            <ArrowLeftRight className="size-3.5 text-payskool-orange" /> Virement hebdomadaire automatisé chaque lundi (BICEC •••• 0142).
          </span>
        </div>
      </section>

      {/* Flux de paiement */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Step icon={Smartphone} title="Le parent paye" text="Mobile money ou carte bancaire, en 20 secondes." />
        <Step icon={Landmark} title="PaySkool encaisse" text="Fonds sécurisés sur le compte PaySkool marchand." />
        <Step icon={ArrowLeftRight} title="Virement hebdomadaire" text="Chaque lundi, le net perçu est transféré." />
        <Step icon={Banknote} title="Crédité à l’école" text="Arrive sur le compte bancaire BICEC •••• 0142." />
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Moyens connectés</h2>
            <p className="text-[11px] text-muted-foreground">
              {connections.length} sur {PAYMENT_PROVIDER_CATALOG.length} opérateurs disponibles.
            </p>
          </div>
          <Button variant="emerald" className="h-9" disabled={available.length === 0} onClick={() => setDialog({ open: true, editing: null })}>
            <PlugZap className="size-4" /> Connecter un moyen de paiement
          </Button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          {connections.map((conn) => (
            <article key={conn.id} className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <ProviderLogo kind={conn.kind} shortName={conn.shortName} />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                      <span className="truncate">{conn.name}</span>
                      <ProviderKindBadge kind={conn.kind} />
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{conn.phone}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <ConnectionStatusBadge status={conn.status} />
                  {conn.testMode && (
                    <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                      Test
                    </span>
                  )}
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-border bg-card p-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Collecté ce mois</dt>
                  <dd className="mt-0.5 font-mono font-bold text-foreground">{formatCFA(volumeOf(conn.kind))}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Transactions</dt>
                  <dd className="mt-0.5 font-mono font-bold text-foreground">{countOf(conn.kind)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Commission opérateur</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-foreground">
                    {conn.feePercent.toLocaleString("fr-FR")} % / transaction
                  </dd>
                </div>
                <div className="col-span-2 truncate">
                  <dt className="text-muted-foreground">Titulaire</dt>
                  <dd className="mt-0.5 truncate font-medium text-foreground">{conn.holder}</dd>
                </div>
              </dl>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant={conn.status === "ACTIVE" ? "outline" : "emerald"}
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => toggle(conn)}
                >
                  {conn.status === "ACTIVE" ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                  {conn.status === "ACTIVE" ? "Mettre en pause" : "Réactiver"}
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setDialog({ open: true, editing: conn })}>
                  <Pencil className="size-3.5" /> Modifier
                </Button>
                {confirmId === conn.id ? (
                  <Button variant="destructive" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => unsubscribe(conn)}>
                    <Trash2 className="size-3.5" /> Confirmer
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-xs text-muted-foreground"
                    onClick={() => setConfirmId(conn.id)}
                  >
                    <Trash2 className="size-3.5" /> Déconnecter
                  </Button>
                )}
              </div>
            </article>
          ))}

          {connections.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Aucun moyen de paiement connecté. Connectez le premier opérateur pour encaisser les parents en ligne.
            </div>
          )}
        </div>
      </section>

      {available.length > 0 && (
        <section className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Ajouter un mode de paiement</h2>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            {available.map((c) => (
              <article key={c.kind} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <ProviderLogo kind={c.kind} shortName={c.shortName} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{c.shortName}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      Commission {c.feePercent.toLocaleString("fr-FR")} % · max{" "}
                      {new Intl.NumberFormat("fr-FR").format(c.maxPerTx)} F
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setDialog({ open: true, editing: null })}>
                  <PlugZap className="size-3.5" /> Connecter
                </Button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Règlements */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Règlements bancaires</h2>
          <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400">
            Hebdo
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium">Moyen</th>
                <th className="px-4 py-3 font-medium">Montant net</th>
                <th className="px-4 py-3 font-medium">Retenues</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Banque</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayouts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-xs font-semibold text-foreground">{p.reference}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{p.providerName}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-foreground">{formatCFA(p.amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{formatCFA(p.fees)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                    {p.status === "SCHEDULED" ? "Lun. " : ""}
                    {formatShortDate(p.scheduledFor)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <PayoutStatusBadge status={p.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-[11px] text-muted-foreground">{p.bank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
          Les montants nets correspondent au collecté en ligne diminué des commissions opérateur (démo).
        </p>
      </section>

      {dialog.open && (
        <ConnectProviderDialog
          initial={dialog.editing}
          available={available}
          onSubmit={handleSubmit}
          onDone={handleDone}
          onClose={() => setDialog({ open: false, editing: null })}
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

function Step({ icon: Icon, title, text }: { icon: typeof Smartphone; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <span className="flex size-8 items-center justify-center rounded-lg bg-payskool-emerald/10">
        <Icon className="size-4 text-payskool-emerald" />
      </span>
      <p className="mt-2.5 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}