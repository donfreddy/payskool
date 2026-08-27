"use client";

import { Button } from "@payskool/ui/components/ui/button";
import {
  ArrowLeftRight,
  Banknote,
  Check,
  Landmark,
  Pencil,
  PlugZap,
  Power,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { FakeReceipt, TxMethod } from "@/core/mocks/fake-data";
import {
  PAYMENT_PROVIDER_CATALOG,
  providerById,
  type FakePaymentProviderConnection,
  type FakePaymentPayout,
  type ConnectProviderInput,
} from "@/core/mocks/payment-providers-db";
import { listReceipts } from "@/features/receipts/api/receipts.mock";
import {
  getActiveProvider,
  listPayouts,
  removeActiveProvider,
  saveProvider,
} from "@/features/settings/api/payment-providers.mock";
import { formatCFA, formatShortDate } from "@/lib/format";

import { ConnectProviderDialog } from "./connect-provider-dialog";
import { EnvironmentBadge, PayoutStatusBadge, ProviderLogo } from "./provider-badges";

const ONLINE_METHODS: TxMethod[] = ["MTN_MOMO", "ORANGE_MONEY", "WAVE"];

export function PaymentProvidersBoard({ schoolId }: { schoolId: string }) {
  const [connection, setConnection] = useState<FakePaymentProviderConnection | null | undefined>(undefined);
  const [payouts, setPayouts] = useState<FakePaymentPayout[]>([]);
  const [receipts, setReceipts] = useState<FakeReceipt[]>([]);
  const [dialog, setDialog] = useState<{
    open: boolean;
    initial: FakePaymentProviderConnection | null;
    preselect: ConnectProviderInput["providerId"] | null;
  }>({ open: false, initial: null, preselect: null });
  const [confirmOff, setConfirmOff] = useState(false);

  useEffect(() => {
    getActiveProvider(schoolId).then(setConnection);
    listPayouts(schoolId).then(setPayouts);
    listReceipts(schoolId).then(setReceipts);
  }, [schoolId]);

  const { onlineVolume, onlineCount } = useMemo(() => {
    const online = receipts.filter((r) => ONLINE_METHODS.includes(r.method));
    return {
      onlineVolume: online.reduce((sum, r) => sum + r.amount, 0),
      onlineCount: online.length,
    };
  }, [receipts]);

  const commission = connection ? (onlineVolume * connection.feePercent) / 100 : 0;

  const nextPayout = useMemo(
    () => payouts.filter((p) => p.status === "SCHEDULED").sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))[0],
    [payouts],
  );

  if (connection === undefined) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement des fournisseurs…
      </div>
    );
  }

  const handleSubmit = (input: ConnectProviderInput) => saveProvider(schoolId, input);

  const handleDone = (conn: FakePaymentProviderConnection) => {
    setConnection(conn);
    listPayouts(schoolId).then(setPayouts);
    setConfirmOff(false);
  };

  const disconnect = () => {
    removeActiveProvider(schoolId).then(() => {
      setConnection(null);
      setPayouts([]);
      setConfirmOff(false);
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
                Fournisseur d’encaissement
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {connection ? connection.providerName : "Aucun fournisseur configuré"}
              </h2>
              <p className="mt-1 text-xs text-white/70">
                {connection
                  ? `${connection.channel} · un seul fournisseur actif à la fois`
                  : "Configurez un agrégateur (Wave, Flutterwave, Paystack…) pour encaisser en ligne."}
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Collecté en ligne T2" v={formatCFA(onlineVolume)} icon={<Wallet className="size-3.5 text-white/40" />} />
              <Band k="Commission fournisseur" v={formatCFA(Math.round(commission))} icon={<ArrowLeftRight className="size-3.5 text-white/40" />} />
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
            <Smartphone className="size-3.5 text-payskool-emerald" /> Les parents règlent via un lien de paiement ou le QR du reçu.
          </span>
          <span className="flex items-center gap-1.5">
            <ArrowLeftRight className="size-3.5 text-payskool-orange" /> {connection?.providerName ?? "Le fournisseur"} transfère les fonds vers BICEC •••• 0142.
          </span>
        </div>
      </section>

      {connection ? (
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <ProviderLogo providerId={connection.providerId} className="size-12 rounded-2xl" />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-base font-semibold text-foreground">
                  {connection.providerName}
                  <EnvironmentBadge environment={connection.environment} />
                </p>
                <p className="text-xs text-muted-foreground">
                  {connection.channel} · {connection.feePercent.toLocaleString("fr-FR")} % commission
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Configuré le {formatShortDate(connection.connectedAt)} · {onlineCount} transactions en ligne ce trimestre
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => setDialog({ open: true, initial: connection, preselect: null })}
              >
                <Pencil className="size-3.5" /> Modifier la configuration
              </Button>
              {confirmOff ? (
                <Button variant="destructive" size="sm" className="h-8 gap-1.5 text-xs" onClick={disconnect}>
                  <Power className="size-3.5" /> Confirmer la déconnexion
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-muted-foreground"
                  onClick={() => setConfirmOff(true)}
                >
                  <Power className="size-3.5" /> Déconnecter
                </Button>
              )}
            </div>
          </div>

          <dl className="mt-4 grid gap-2 rounded-xl border border-border bg-muted/20 p-4 text-xs sm:grid-cols-3">
            {providerById(connection.providerId)?.fields.map((f) => (
              <div key={f.key} className="min-w-0">
                <dt className="text-muted-foreground">{f.label}</dt>
                <dd className="mt-0.5 truncate font-mono font-semibold text-foreground">
                  {f.kind === "password" ? "••••••" + (connection.config[f.key] ?? "").slice(-4) : connection.config[f.key]}
                </dd>
              </div>
            ))}
            <div className="min-w-0">
              <dt className="text-muted-foreground">Règlement des fonds</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {providerById(connection.providerId)?.settlement} → BICEC •••• 0142
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-sm">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-payskool-emerald/10">
            <PlugZap className="size-6 text-payskool-emerald" />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-foreground">Aucun fournisseur d’encaissement</h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            Les parents ne peuvent pas payer en ligne pour l’instant. Choisissez un fournisseur supporté par la plateforme
            pour ouvrir les paiements : vous n’en gardez qu’un seul actif.
          </p>
          <Button variant="emerald" className="mt-4" onClick={() => setDialog({ open: true, initial: null, preselect: null })}>
            <PlugZap className="size-4" /> Configurer un fournisseur
          </Button>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Step icon={Smartphone} title="Le parent paye" text="Mobile money ou carte, par lien de paiement ou QR." />
        <Step icon={Landmark} title={connection?.providerName ?? "Le fournisseur"} text="Fonds sécurisés puis transférés selon son cycle." />
        <Step icon={ArrowLeftRight} title="Règlement automatique" text={providerById(connection?.providerId ?? "wave")?.settlement ?? "Virement hebdomadaire"} />
        <Step icon={Banknote} title="Crédité à l’école" text="Arrive sur le compte bancaire BICEC •••• 0142." />
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Fournisseurs supportés</h2>
            <p className="text-[11px] text-muted-foreground">
              Liste des agrégateurs intégrés au backend — un seul actif à la fois.
            </p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {PAYMENT_PROVIDER_CATALOG.map((e) => {
            const isActive = connection?.providerId === e.id;
            return (
              <article key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <ProviderLogo providerId={e.id} className="size-10 rounded-xl" />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                      {e.name}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-payskool-emerald/10 px-1.5 py-0.5 text-[10px] font-semibold text-payskool-emerald">
                          <Check className="size-3" /> Actif
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {e.tagline} · {e.markets}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {e.channels} · {e.feeLabel} · {e.settlement}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs"
                      onClick={() => setDialog({ open: true, initial: connection, preselect: null })}
                    >
                      <Pencil className="size-3.5" /> Modifier
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs"
                      onClick={() => setDialog({ open: true, initial: null, preselect: e.id })}
                    >
                      <PlugZap className="size-3.5" /> {connection ? "Remplacer" : "Configurer"}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {sortedPayouts.length > 0 && (
        <section className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Règlements bancaires</h2>
            <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400">
              {connection?.providerName}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Référence</th>
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
            Les montants nets correspondent au collecté en ligne diminué des commissions du fournisseur (démo).
          </p>
        </section>
      )}

      {dialog.open && (
        <ConnectProviderDialog
          initial={dialog.initial}
          preselect={dialog.preselect}
          replacing={connection && !dialog.initial ? connection.providerName : null}
          onSubmit={handleSubmit}
          onDone={handleDone}
          onClose={() => setDialog({ open: false, initial: null, preselect: null })}
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