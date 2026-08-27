"use client";

import { cn } from "@payskool/ui/utils";

import { FakeQR } from "@/components/shared/fake-qr";
import { TX_METHOD_LABELS } from "@/components/shared/tx-method-badge";
import type { FakeReceipt } from "@/core/mocks/fake-data";
import { formatCFA, formatDigits, formatFullDate, formatTime } from "@/lib/format";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between font-mono text-[13px] leading-6">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-semibold text-foreground">{v}</span>
    </div>
  );
}

function Dashes() {
  return <div className="my-3 border-t border-dashed border-border/70" />;
}

export function ReceiptTicketCard({ receipt }: { receipt: FakeReceipt }) {
  const isCheque = receipt.chequeNumber !== undefined;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="bg-payskool-navy px-6 py-4 text-center text-white">
        <p className="text-sm font-bold tracking-tight">CS Sainte-Marie</p>
        <p className="text-[11px] text-white/70">Douala - Akwa · +237 233 42 18 09</p>
        <Dashes />
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-300">Reçu de paiement</p>
        <p className="mt-0.5 font-mono text-base font-bold">{receipt.number}</p>
        <span className="mt-2 inline-block rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/80">
          {TX_METHOD_LABELS[receipt.method]}
        </span>
      </div>

      <div className="px-6 py-4">
        <Row k="Date" v={formatFullDate(receipt.createdAt.slice(0, 10))} />
        <Row k="Heure" v={formatTime(receipt.createdAt)} />
        <Row k="Caissier" v={receipt.cashier} />
        <Dashes />

        <Row k="Élève" v={receipt.studentName} />
        <Row k="Matricule" v={receipt.matricule} />
        <Row k="Classe" v={receipt.classLevel} />
        <Dashes />

        <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          Ventilation
        </p>
        {receipt.allocations.length > 0 ? (
          receipt.allocations.map((a) => <Row key={a.installmentId} k={a.label} v={formatCFA(a.amount)} />)
        ) : (
          <Row k="Avance sur échéancier" v={formatCFA(receipt.amount)} />
        )}
        <Dashes />

        <Row
          k={isCheque ? `Chèque n°${receipt.chequeNumber}` : "Total réglé"}
          v={formatDigits(receipt.amount)}
        />
        {isCheque && <Row k="Banque" v={receipt.chequeBank ?? "—"} />}
        <div className="mt-2 flex items-center justify-between rounded-lg bg-payskool-emerald/10 px-3 py-2">
          <span className="font-mono text-xs font-semibold text-payskool-emerald">TOTAL REÇU</span>
          <span className="font-mono text-base font-bold text-payskool-emerald">
            {formatCFA(receipt.amount)}
          </span>
        </div>

        <Dashes />
        <div className="flex items-center gap-3">
          <FakeQR />
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            Scannez pour vérifier l’authenticité de ce reçu
            <span className="mt-0.5 block text-[10px] text-muted-foreground/70">
              app.payskool.africa/verify/{receipt.number.replace("#", "")}
            </span>
          </p>
        </div>
      </div>

      <div className="border-t border-dashed border-border px-2 py-3">
        <p className={cn("mx-auto h-1.5 w-2/3 rounded-full bg-border")} />
      </div>
    </div>
  );
}