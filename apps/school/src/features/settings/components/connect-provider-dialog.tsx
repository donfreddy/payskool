"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import { Label } from "@payskool/ui/components/ui/label";
import { cn } from "@payskool/ui/utils";
import {
  Check,
  ChevronLeft,
  FlaskConical,
  KeyRound,
  PlugZap,
  ReceiptText,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

import {
  providerById,
  type ConnectProviderInput,
  type FakePaymentProviderConnection,
  type PaymentEnvironment,
  type PaymentProviderId,
} from "@/core/mocks/payment-providers-db";

import { EnvironmentBadge, ProviderLogo } from "./provider-badges";

const OTP_CODE = "482901";

interface ConnectProviderDialogProps {
  /** Fournisseur déjà configuré : le wizard s'ouvre sur la mise à jour de ses identifiants. */
  initial?: FakePaymentProviderConnection | null;
  /** Présélectionne un fournisseur du catalogue (mode ajout). */
  preselect?: PaymentProviderId | null;
  /** Nom du fournisseur actif — la configuration le remplacera (un seul à la fois). */
  replacing?: string | null;
  onSubmit: (input: ConnectProviderInput) => Promise<FakePaymentProviderConnection | null>;
  onDone: (connection: FakePaymentProviderConnection) => void;
  onClose: () => void;
}

export function ConnectProviderDialog({
  initial,
  preselect,
  replacing,
  onSubmit,
  onDone,
  onClose,
}: ConnectProviderDialogProps) {
  const [step, setStep] = useState(initial ? 2 : 1); // 1 fournisseur · 2 configuration · 3 vérification · 4 succès
  const [selected, setSelected] = useState<PaymentProviderId | null>(initial?.providerId ?? preselect ?? null);
  const [values, setValues] = useState<Record<string, string>>(() => initial?.config ?? {});
  const [environment, setEnvironment] = useState<PaymentEnvironment>(initial?.environment ?? "test");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [resent, setResent] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testReceived, setTestReceived] = useState(false);
  const [created, setCreated] = useState<FakePaymentProviderConnection | null>(null);

  const entry = selected ? providerById(selected) : undefined;

  const pick = (id: PaymentProviderId) => {
    const e = providerById(id);
    setSelected(id);
    if (e) setValues(e.demoValues);
    setOtp("");
    setTestStarted(false);
    setTestReceived(false);
  };

  const restartTest = () => {
    setTestStarted(true);
    setTimeout(() => setTestReceived(true), 1100);
  };

  const verify = async () => {
    if (!entry) return;
    if (entry.verification === "SMS_CODE" && otp !== OTP_CODE) {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 1800);
      return;
    }
    const connection = await onSubmit({ providerId: entry.id, config: values, environment });
    if (!connection) return;
    setCreated(connection);
    onDone(connection);
    setStep(4);
  };

  const allValid = entry
    ? entry.fields.every((f) => (values[f.key] ?? "").trim().length > 0)
    : false;

  const masked = (fieldKey: string, kind: string) => {
    const value = values[fieldKey] ?? "";
    if (kind !== "password") return value;
    if (value.length <= 6) return "••••••";
    return `••••••${value.slice(-4)}`;
  };

  const titres = ["Fournisseur", "Configuration", "Vérification", "Connecté"];

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
              {initial ? "Modifier la configuration" : "Configurer un fournisseur"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {initial ? "Mettez à jour les identifiants et revalidez le compte." : "Un seul fournisseur actif à la fois."}
            </p>
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

        {replacing && !initial && (
          <p className="mb-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-700 dark:text-amber-400">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
            Seul fournisseur actif autorisé : configurer {entry?.name ?? "ce fournisseur"} remplacera{" "}
            <span className="font-semibold">{replacing}</span> et son historique de règlements.
          </p>
        )}

        {step === 1 && (
          <div>
            <p className="mb-3 text-xs text-muted-foreground">
              Choisissez le fournisseur d’encaissement pris en charge par la plateforme (les APIs MTN/Orange ne sont pas
              intégrées directement) :
            </p>
            <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto pr-1">
              {[
                "wave",
                "flutterwave",
                "paystack",
                "payunit",
                "campay",
                "marviance",
              ].map((id) => {
                const e = providerById(id as PaymentProviderId);
                if (!e) return null;
                const active = selected === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => pick(e.id)}
                    className={cn(
                      "flex flex-col gap-2.5 rounded-xl border p-3 text-left transition-colors",
                      active
                        ? "border-payskool-emerald bg-payskool-emerald/5 ring-1 ring-payskool-emerald"
                        : "border-border bg-muted/20 hover:border-payskool-emerald/50",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <ProviderLogo providerId={e.id} className="size-9 rounded-lg text-[9px]" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">{e.name}</span>
                        <span className="block truncate text-[10px] text-muted-foreground">{e.channels}</span>
                      </span>
                    </span>
                    <span className="line-clamp-2 min-h-[2.25rem] text-[11px] leading-snug text-muted-foreground">{e.tagline}</span>
                    <span className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>
                        <span className="font-mono font-semibold text-foreground">{e.feeLabel}</span>
                      </span>
                      <span>{e.settlement.split(" (")[0]}</span>
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
              <ProviderLogo providerId={entry.id} className="size-9 rounded-lg text-[9px]" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {entry.channels} · {entry.feeLabel} · {entry.settlement}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {entry.fields.map((field) => (
                <div key={field.key} className="grid gap-1.5">
                  <Label htmlFor={`cfg-${field.key}`} className="text-xs text-muted-foreground">
                    {field.label}
                  </Label>
                  <Input
                    id={`cfg-${field.key}`}
                    type={field.kind === "password" ? "password" : field.kind === "tel" ? "tel" : "text"}
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="h-10 rounded-lg font-mono"
                  />
                  {field.hint && <p className="text-[11px] text-muted-foreground">{field.hint}</p>}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-border p-1">
                <button
                  type="button"
                  onClick={() => setEnvironment("test")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                    environment === "test" ? "bg-payskool-navy text-white" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <FlaskConical className="size-3.5" /> Test
                </button>
                <button
                  type="button"
                  onClick={() => setEnvironment("live")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                    environment === "live" ? "bg-payskool-navy text-white" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <ShieldCheck className="size-3.5" /> Live
                </button>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {environment === "test"
                  ? "Clés et transactions de démo, aucun vrai prélèvement."
                  : "Les paiements des parents seront réels (clés live requises)."}
              </span>
            </div>
          </div>
        )}

        {step === 3 && entry && (
          <div>
            <p className="mb-3 text-xs text-muted-foreground">
              {entry.verification === "SMS_CODE"
                ? "Vérifiez que le compte marchand vous appartient : un code est envoyé par SMS."
                : "Vérifiez que la clé API est valide : PaySkool initie une micro-transaction de contrôle."}
            </p>

            {entry.verification === "SMS_CODE" ? (
              <div>
                <div className="rounded-xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5 font-medium text-foreground">
                    <Smartphone className="size-3.5 text-payskool-emerald" /> Code de vérification envoyé par SMS
                  </p>
                  <p className="mt-1.5">
                    au <span className="font-mono font-semibold text-foreground">{entry.demoPhone}</span> (démo :{" "}
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
            ) : (
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <ReceiptText className="size-3.5 text-payskool-emerald" /> Transaction de test de{" "}
                  <span className="font-mono font-bold">{entry.testAmount} FCFA</span>
                </p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  La clé {entry.id === "paystack" ? "sk_" : "FLWSECK-"}… sera utilisée pour une charge de vérification, puis
                  automatiquement remboursée.
                </p>
                <div className="mt-3 rounded-lg border border-border bg-card px-3 py-2.5 text-xs">
                  {!testStarted ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="size-2 rounded-full bg-slate-400" />
                      En attente — le prélèvement n’a pas encore été initié.
                    </span>
                  ) : !testReceived ? (
                    <span className="flex animate-pulse items-center gap-2 text-muted-foreground">
                      <span className="size-2 rounded-full bg-sky-500" />
                      Prélèvement de {entry.testAmount} FCFA en cours…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 font-medium text-payskool-emerald">
                      <Check className="size-3.5" /> Prélèvement reçu — la clé est valide.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && created && (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-payskool-emerald/10">
              <Check className="size-7 text-payskool-emerald" />
            </span>
            <h3 className="mt-3 flex items-center gap-2 font-display text-lg font-bold text-foreground">
              {created.providerName}
              <EnvironmentBadge environment={created.environment} />
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Fournisseur d’encaissement {initial ? "mis à jour" : "configuré"} — seul actif. Les paiements des parents
              passent désormais par{" "}
              <span className="font-semibold text-foreground">{created.providerName}</span>.
            </p>
            <div className="mt-4 grid w-full gap-2 rounded-xl border border-border bg-muted/20 p-4 text-left text-xs">
              {entry?.fields.map((f) => (
                <span key={f.key} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className="truncate font-mono font-semibold text-foreground">{masked(f.key, f.kind)}</span>
                </span>
              ))}
              <span className="flex justify-between">
                <span className="text-muted-foreground">Commission</span>
                <span className="font-mono font-semibold text-foreground">{entry?.feeLabel}</span>
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
            <Button variant="emerald" size="lg" disabled={!selected} onClick={() => setStep(2)}>
              <PlugZap className="size-4" /> Continuer
            </Button>
          )}
          {step === 2 && entry && (
            <Button variant="emerald" size="lg" disabled={!allValid} onClick={() => setStep(3)}>
              <ShieldCheck className="size-4" />
              {entry.verification === "SMS_CODE" ? "Envoyer le code" : "Vérifier la clé"}
            </Button>
          )}
          {step === 3 && entry && entry.verification === "SMS_CODE" && (
            <Button variant="emerald" size="lg" className="gap-1.5" disabled={otp.length !== 6} onClick={verify}>
              <KeyRound className="size-4" /> Vérifier
            </Button>
          )}
          {step === 3 && entry && entry.verification === "TEST_TRANSACTION" && (
            <Button variant="emerald" size="lg" disabled={!testReceived} onClick={verify}>
              <ShieldCheck className="size-4" /> Valider la configuration
            </Button>
          )}
          {step === 3 && entry && entry.verification === "TEST_TRANSACTION" && !testStarted && (
            <Button variant="outline" className="gap-1.5" onClick={restartTest}>
              <FlaskConical className="size-4" /> Initier le prélèvement test
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