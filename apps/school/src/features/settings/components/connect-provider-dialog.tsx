"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import { Label } from "@payskool/ui/components/ui/label";
import { cn } from "@payskool/ui/utils";
import { Check, ChevronLeft, CreditCard, FlaskConical, KeyRound, PlugZap, ShieldCheck } from "lucide-react";
import { useState } from "react";

import {
  PAYMENT_PROVIDER_CATALOG,
  type ConnectProviderInput,
  type FakePaymentProviderConnection,
  type PaymentProviderKind,
  type PaymentProviderCatalogEntry,
} from "@/core/mocks/payment-providers-db";

import { ProviderKindBadge, ProviderLogo } from "./provider-badges";

const OTP_CODE = "482901";

interface ConnectProviderDialogProps {
  /** Connexion existante : le dialogue s'ouvre alors sur la validation des identifiants. */
  initial?: FakePaymentProviderConnection | null;
  /** Opérateurs non connectés proposés à l'ajout (ignoré en édition). */
  available?: PaymentProviderCatalogEntry[];
  onSubmit: (input: ConnectProviderInput, providerId?: string) => Promise<FakePaymentProviderConnection | null>;
  onDone: (connection: FakePaymentProviderConnection) => void;
  onClose: () => void;
}

export function ConnectProviderDialog({
  initial,
  available,
  onSubmit,
  onDone,
  onClose,
}: ConnectProviderDialogProps) {
  const catalog = initial
    ? PAYMENT_PROVIDER_CATALOG.filter((c) => c.kind === initial.kind)
    : (available ?? []);

  const [step, setStep] = useState(initial ? 2 : 1); // 1 choix · 2 identifiants · 3 code · 4 succès
  const [selected, setSelected] = useState<PaymentProviderKind | null>(initial?.kind ?? null);
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [holder, setHolder] = useState(initial?.holder ?? "");
  const [testMode, setTestMode] = useState(initial?.testMode ?? true);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [resent, setResent] = useState(false);
  const [created, setCreated] = useState<FakePaymentProviderConnection | null>(null);

  const entry = catalog.find((c) => c.kind === selected) ?? null;

  const pick = (kind: PaymentProviderKind) => {
    setSelected(kind);
    const e = catalog.find((c) => c.kind === kind);
    if (e) {
      setPhone(e.demoPhone);
      setHolder(e.demoHolder);
    }
  };

  const verify = async () => {
    if (otp !== OTP_CODE) {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 1800);
      return;
    }
    if (!selected) return;
    const connection = await onSubmit({ kind: selected, phone, holder, testMode }, initial?.id);
    if (!connection) return;
    setCreated(connection);
    onDone(connection);
    setStep(4);
  };

  const titres = ["Choix du moyen", "Identifiants", "Vérification", "Connecté"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Fermer" />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-xl">
        <div className="flex items-center gap-2 pb-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-payskool-emerald/10">
            <PlugZap className="size-4 text-payskool-emerald" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">
              {initial ? "Modifier les identifiants" : "Connecter un mode de paiement"}
            </h2>
            <p className="text-xs text-muted-foreground">Attachez le compte marchand et validez-le par code SMS.</p>
          </div>
        </div>

        {/* Stepper */}
        <ol className="mb-4 flex items-center gap-1">
          {titres.map((t, i) => {
            const n = i + 1;
            const done = step > n || (step === 4 && n === 4);
            const current = step === n;
            return (
              <li key={t} className="flex flex-1 items-center gap-1">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    done || current ? "bg-payskool-emerald text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3" /> : n}
                </span>
                <span className={cn("hidden truncate text-[10px] sm:block", current ? "font-semibold text-foreground" : "text-muted-foreground")}>
                  {t}
                </span>
                {n < titres.length && <span className="h-px flex-1 bg-border" />}
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <div>
            <p className="mb-3 text-xs text-muted-foreground">
              Les parents paient depuis leur app de mobile money ou par carte bancaire. Sélectionnez un opérateur :
            </p>
            <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto">
              {catalog.map((c) => {
                const active = selected === c.kind;
                return (
                  <button
                    key={c.kind}
                    onClick={() => pick(c.kind)}
                    className={cn(
                      "flex flex-col gap-3 rounded-xl border p-3 text-left transition-colors",
                      active
                        ? "border-payskool-emerald bg-payskool-emerald/5 ring-1 ring-payskool-emerald"
                        : "border-border bg-muted/20 hover:border-payskool-emerald/50",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <ProviderLogo kind={c.kind} shortName={c.shortName} className="size-9 rounded-lg text-[9px]" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">{c.shortName}</span>
                        <ProviderKindBadge kind={c.kind} className="mt-0.5" />
                      </span>
                    </span>
                    <span className="text-[11px] leading-relaxed text-muted-foreground">{c.tagline}</span>
                    <span className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>
                        Commission <span className="font-mono font-semibold text-foreground">{c.feePercent.toLocaleString("fr-FR")} %</span>
                      </span>
                      <span>
                        Max <span className="font-mono font-semibold text-foreground">{new Intl.NumberFormat("fr-FR").format(c.maxPerTx)} F</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && entry && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
              <ProviderLogo kind={entry.kind} shortName={entry.shortName} className="size-9 rounded-lg text-[9px]" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Commission {entry.feePercent.toLocaleString("fr-FR")} % par transaction (plafond{" "}
                  {new Intl.NumberFormat("fr-FR").format(entry.maxPerTx)} F)
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="pp-phone" className="text-xs text-muted-foreground">
                  Téléphone du collecteur
                </Label>
                <Input id="pp-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237 6 …" className="h-10 rounded-lg font-mono" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pp-holder" className="text-xs text-muted-foreground">
                  Titulaire du compte marchand
                </Label>
                <Input id="pp-holder" value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Ex : Cellule scolarité CS Sainte-Marie" className="h-10 rounded-lg" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-border p-1">
                <button
                  type="button"
                  onClick={() => setTestMode(false)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                    !testMode ? "bg-payskool-navy text-white" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <FlaskConical className="size-3.5" /> Test
                </button>
                <button
                  type="button"
                  onClick={() => setTestMode(true)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                    testMode ? "bg-payskool-navy text-white" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <ShieldCheck className="size-3.5" /> Live
                </button>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {testMode ? "Transactions simulées, aucun réel prélèvement." : "Les paiements des parents seront réels."}
              </span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5 font-medium text-foreground">
                <KeyRound className="size-3.5 text-payskool-emerald" /> Code de vérification envoyé par SMS
              </p>
              <p className="mt-1.5">
                à <span className="font-mono font-semibold text-foreground">{phone}</span> (démo :{" "}
                <span className="font-mono font-bold text-payskool-emerald">{OTP_CODE}</span>).
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <Label htmlFor="pp-otp" className="text-xs text-muted-foreground">Code à 6 chiffres</Label>
              <Input
                id="pp-otp"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className={cn(
                  "h-12 rounded-lg text-center font-mono text-xl tracking-[0.5em]",
                  otpError && "border-red-500 ring-1 ring-red-500",
                )}
              />
              {otpError && <p className="text-[11px] font-medium text-red-500">Code incorrect, réessayez.</p>}
              {resent && <p className="text-[11px] font-medium text-payskool-emerald">Code renvoyé par SMS.</p>}
              <button
                type="button"
                onClick={() => {
                  setOtp("");
                  setResent(true);
                  setTimeout(() => setResent(false), 2000);
                }}
                className="mt-1 self-start text-[11px] font-medium text-payskool-emerald hover:underline"
              >
                Renvoyer le code
              </button>
            </div>
          </div>
        )}

        {step === 4 && created && (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-payskool-emerald/10">
              <Check className="size-7 text-payskool-emerald" />
            </span>
            <h3 className="mt-3 flex items-center gap-2 font-display text-lg font-bold text-foreground">
              {created.shortName}
              <ProviderKindBadge kind={created.kind} />
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Moyen de paiement {initial ? "mis à jour" : "connecté"} {testMode ? "en mode test" : "en live"}.
              Les parents peuvent désormais régler l’école via ce canal.
            </p>
            <div className="mt-4 grid w-full gap-2 rounded-xl border border-border bg-muted/20 p-4 text-left text-xs">
              <span className="flex justify-between">
                <span className="text-muted-foreground">Compte</span>
                <span className="font-mono font-semibold text-foreground">{phone}</span>
              </span>
              <span className="flex justify-between">
                <span className="text-muted-foreground">Titulaire</span>
                <span className="max-w-[60%] truncate font-semibold text-foreground">{holder}</span>
              </span>
              <span className="flex justify-between">
                <span className="text-muted-foreground">Commission</span>
                <span className="font-mono font-semibold text-foreground">{created.feePercent.toLocaleString("fr-FR")} %</span>
              </span>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-2">
          {step > 1 && step < 4 && (
            <Button variant="outline" className="gap-1" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="size-4" /> Retour
            </Button>
          )}
          <div className="flex-1" />
          {step === 1 && (
            <Button variant="emerald" size="lg" className="gap-1.5" disabled={!selected} onClick={() => setStep(2)}>
              <CreditCard className="size-4" /> Continuer
            </Button>
          )}
          {step === 2 && (
            <Button
              variant="emerald"
              size="lg"
              className="gap-1.5"
              disabled={phone.trim().length < 9 || holder.trim().length === 0}
              onClick={() => setStep(3)}
            >
              <ShieldCheck className="size-4" /> Envoyer le code
            </Button>
          )}
          {step === 3 && (
            <Button variant="emerald" size="lg" className="gap-1.5" disabled={otp.length !== 6} onClick={verify}>
              <KeyRound className="size-4" /> Vérifier
            </Button>
          )}
          {step === 4 && (
            <Button variant="emerald" size="lg" onClick={onClose}>
              <Check className="size-4" /> Terminer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}