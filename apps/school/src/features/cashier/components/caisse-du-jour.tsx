import { Banknote, ReceiptText, Wallet, TrendingUp } from "lucide-react";

import type { FakeTx } from "@/core/mocks/fake-data";
import { formatCFA, formatTime } from "@/lib/format";

const methodLabel: Record<FakeTx["method"], string> = {
  CASH: "Espèces",
  CHEQUE: "Chèque",
  ORANGE_MONEY: "Orange Money",
  MTN_MOMO: "MTN MoMo",
  WAVE: "Wave",
};

export function CaisseDuJour({
  collected,
  txCount,
  byMethod,
  txns,
}: {
  collected: number;
  txCount: number;
  byMethod: { CASH: number; CHEQUE: number };
  txns: FakeTx[];
}) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Wallet className="size-4 text-payskool-emerald" /> Caisse du jour
        </h2>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          20 nov. 2026
        </span>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
        <div className="p-4">
          <p className="text-xs text-muted-foreground">Encaissé</p>
          <p className="mt-1 text-lg font-bold tracking-tight text-payskool-emerald">
            {formatCFA(collected)}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <TrendingUp className="size-3 text-payskool-emerald" /> {txCount} transactions
          </p>
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground">Par mode</p>
          <div className="mt-1.5 space-y-1 text-xs font-medium">
            <p className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Banknote className="size-3" /> Espèces
              </span>
              <span className="font-semibold text-foreground">{formatCFA(byMethod.CASH)}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <ReceiptText className="size-3" /> Chèques
              </span>
              <span className="font-semibold text-foreground">{formatCFA(byMethod.CHEQUE)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-h-44 overflow-y-auto p-2">
        {txns.map((t) => (
          <div key={t.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-secondary/60">
            <span className="size-1.5 shrink-0 rounded-full bg-payskool-emerald" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{t.studentName}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {methodLabel[t.method]} {t.classLevel}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-foreground">{formatCFA(t.amount)}</p>
              <p className="text-[11px] text-muted-foreground">{formatTime(t.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}