import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import { Label } from "@payskool/ui/components/ui/label";
import { cn } from "@payskool/ui/utils";
import { Banknote, CheckCheck, Delete, FileText } from "lucide-react";

import type { RegisterDraft } from "@/features/cashier/types";
import { formatCFA } from "@/lib/format";

function parseAmount(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "del"] as const;

export interface RegisterFormProps {
  draft: RegisterDraft;
  onChange: (patch: Partial<RegisterDraft>) => void;
  remaining: number;
  nextDue: number;
  onConfirm: () => void;
}

export function RegisterForm({
  draft,
  onChange,
  remaining,
  nextDue,
  onConfirm,
}: RegisterFormProps) {
  const amount = parseAmount(draft.amount);
  const overpay = amount > remaining;

  const pressKey = (key: (typeof KEYPAD)[number]) => {
    if (key === "del") {
      onChange({ amount: draft.amount.slice(0, -1) });
      return;
    }
    const current = draft.amount.replace(/\D/g, "");
    const next = (current + key).replace(/^0+(?=\d)/, "").slice(0, 8);
    onChange({ amount: next ? parseInt(next, 10).toLocaleString("fr-FR") : "" });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange({ method: "CASH" })}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
            draft.method === "CASH"
              ? "border-payskool-emerald bg-payskool-emerald text-white"
              : "border-border bg-card text-muted-foreground hover:bg-secondary",
          )}
        >
          <Banknote className="size-4" /> Espèces
        </button>
        <button
          type="button"
          onClick={() => onChange({ method: "CHEQUE" })}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
            draft.method === "CHEQUE"
              ? "border-payskool-emerald bg-payskool-emerald text-white"
              : "border-border bg-card text-muted-foreground hover:bg-secondary",
          )}
        >
          <FileText className="size-4" /> Chèque
        </button>
      </div>

      {draft.method === "CHEQUE" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1.5">
            <Label htmlFor="ck-num" className="text-xs text-muted-foreground">
              N° chèque
            </Label>
            <Input
              id="ck-num"
              value={draft.chequeNumber}
              onChange={(e) => onChange({ chequeNumber: e.target.value })}
              placeholder="ex : 0112457"
              className="h-9 font-mono"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ck-bank" className="text-xs text-muted-foreground">
              Banque
            </Label>
            <Input
              id="ck-bank"
              value={draft.chequeBank}
              onChange={(e) => onChange({ chequeBank: e.target.value })}
              placeholder="ex : Afriland"
              className="h-9"
            />
          </div>
        </div>
      )}

      <div className="grid gap-1.5">
        <Label htmlFor="ck-amount" className="text-xs text-muted-foreground">
          Montant reçu
        </Label>
        <div className="relative">
          <Input
            id="ck-amount"
            value={draft.amount}
            onChange={(e) => onChange({ amount: e.target.value })}
            placeholder="0"
            inputMode="numeric"
            autoComplete="off"
            className={cn(
              "h-12 pr-14 text-right font-mono text-lg font-bold",
              overpay ? "text-destructive ring-1 ring-destructive/40" : "text-foreground",
            )}
          />
          <span className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold", overpay ? "text-destructive" : "text-muted-foreground")}>
            FCFA
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {nextDue > 0 && (
          <button
            type="button"
            onClick={() => onChange({ amount: nextDue.toLocaleString("fr-FR") })}
            className="rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            Tranche due · {formatCFA(nextDue)}
          </button>
        )}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => onChange({ amount: remaining.toLocaleString("fr-FR") })}
            className="rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            Tout le reste · {formatCFA(remaining)}
          </button>
        )}
        <button
          type="button"
          onClick={() => onChange({ amount: "" })}
          className="rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary"
        >
          Effacer
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {KEYPAD.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => pressKey(key)}
            className={cn(
              "flex h-11 items-center justify-center rounded-lg border border-border font-mono text-base font-bold text-foreground transition-colors active:scale-[0.97]",
              key === "del" ? "text-muted-foreground hover:bg-secondary" : "hover:bg-secondary",
            )}
          >
            {key === "del" ? <Delete className="size-4" /> : key}
          </button>
        ))}
      </div>

      {overpay && (
        <p className="text-xs font-medium text-destructive">
          Montant supérieur au solde (reste {formatCFA(remaining)}). Le surplus sera porté en avance.
        </p>
      )}

      <Button
        variant="emerald"
        size="lg"
        className="w-full h-12"
        disabled={amount <= 0}
        onClick={onConfirm}
      >
        <CheckCheck /> Encaisser {amount > 0 ? formatCFA(amount) : ""}
      </Button>
    </div>
  );
}