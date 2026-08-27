import { Button } from "@payskool/ui/components/ui/button";
import { Printer, RotateCcw } from "lucide-react";

import { FakeQR } from "@/components/shared/fake-qr";
import type { ReceiptRecord } from "@/features/cashier/types";
import { formatCFA, formatDigits, formatFullDate, formatTime, formatShortDate } from "@/lib/format";

const methodPrint: Record<string, string> = {
  CASH: "ESPÈCES",
  CHEQUE: "CHÈQUE",
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between font-mono text-[13px] leading-6">
    <span className="text-muted-foreground">{k}</span>
    <span className="font-semibold text-foreground">{v}</span>
  </div>
);

function Dashes() {
  return <div className="my-3 border-t border-dashed border-muted-foreground/30" />;
}

export function ReceiptTicket({
  receipt,
  onReset,
}: {
  receipt: ReceiptRecord;
  onReset: () => void;
}) {
  return (
    <section className="mx-auto max-w-sm">
      <div className="overflow-hidden rounded-t-xl border border-b-0 border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-5 py-4 text-center text-white">
          <p className="text-sm font-bold tracking-tight">CS Sainte-Marie</p>
          <p className="text-[11px] text-white/70">Douala - Akwa · +237 233 42 18 09</p>
          <Dashes />
          <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-300">Reçu de paiement</p>
          <p className="mt-0.5 font-mono text-sm font-bold">{receipt.number}</p>
        </div>

        <div className="px-5 py-4">
          <Row k="Date" v={formatFullDate(receipt.createdAt.slice(0, 10))} />
          <Row k="Heure" v={formatTime(receipt.createdAt)} />
          <Row k="Caissier" v={receipt.cashier} />
          <Dashes />

          <Row k="Élève" v={`${receipt.studentName}`} />
          <Row k="Matricule" v={receipt.matricule} />
          <Row k="Classe" v={receipt.classLevel} />
          <Dashes />

          <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Ventilation</p>
          {receipt.allocations.map((a) => (
            <Row key={a.installmentId} k={a.label} v={formatCFA(a.amount)} />
          ))}
          {receipt.allocations.length === 0 && (
            <Row k="Avance" v={formatCFA(receipt.amount)} />
          )}
          <Dashes />

          <Row k={`Mode : ${methodPrint[receipt.method]}`} v={formatDigits(receipt.amount)} />
          {receipt.chequeNumber && <Row k="Chèque" v={`${receipt.chequeNumber} · ${receipt.chequeBank}`} />}
          <div className="mt-2 flex items-center justify-between rounded-lg bg-payskool-emerald/10 px-3 py-2">
            <span className="font-mono text-xs font-semibold text-payskool-emerald">TOTAL REÇU</span>
            <span className="font-mono text-base font-bold text-payskool-emerald">{formatCFA(receipt.amount)}</span>
          </div>

          <Dashes />
          <div className="flex items-center gap-3">
            <FakeQR />
            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              Scannez pour vérifier l’authenticité de ce reçu sur app.payskool.africa/verify
              <span className="mt-0.5 block text-[10px] text-muted-foreground/70">Reçu imprimé le {formatShortDate(receipt.createdAt.slice(0, 10))}</span>
            </p>
          </div>
        </div>

        <div className="px-2 pb-2">
          <div className="border-t border-dashed border-muted-foreground/30 pb-2" />
          <div className="mx-auto h-1.5 w-2/3 rounded-full bg-border" />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1">
          <Printer /> Imprimer
        </Button>
        <Button variant="emerald" className="flex-1" onClick={onReset}>
          <RotateCcw /> Nouvel encaissement
        </Button>
      </div>
    </section>
  );
}