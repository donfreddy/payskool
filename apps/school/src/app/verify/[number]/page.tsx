import {
  AlertTriangle,
  CalendarCheck2,
  CheckCircle2,
  School,
  Search,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { FakeQR } from "@/components/shared/fake-qr";
import { findReceiptByNumber } from "@/core/mocks/students-db";
import {
  formatCFA,
  formatDigits,
  formatFullDate,
  formatShortDate,
  formatTime,
} from "@/lib/format";

export const metadata: Metadata = {
  title: "Vérification de reçu | Payskool",
  description: "Vérifiez l’authenticité d’un reçu de paiement Payskool.",
};

const methodText: Record<string, string> = {
  CASH: "Espèces",
  CHEQUE: "Chèque",
  MOBILE_MONEY: "Mobile Money",
  BANK_TRANSFER: "Virement",
  CARD: "Carte",
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between border-b border-border/60 py-2 font-mono text-[13px]">
    <span className="text-muted-foreground">{k}</span>
    <span className="font-semibold text-foreground">{v}</span>
  </div>
);

export default async function VerifyReceiptPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const receipt = findReceiptByNumber(number);

  return (
    <main className="flex min-h-dvh flex-col bg-muted/40">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-lg bg-payskool-navy text-white">
            <School className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-foreground">Payskool</p>
            <p className="text-[11px] text-muted-foreground">Vérification publique de reçu</p>
          </div>
        </div>
        <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] text-muted-foreground">
          reçu n° {number}
        </span>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        {!receipt ? (
          <section className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="bg-payskool-orange px-6 py-8 text-center text-white">
              <AlertTriangle className="mx-auto size-10" />
              <p className="mt-3 font-mono text-sm uppercase tracking-widest">Reçu introuvable</p>
              <p className="mt-1 font-mono text-xs text-white/70">{number}</p>
            </div>
            <div className="px-6 py-6 text-sm text-muted-foreground">
              <p>
                Aucun reçu ne correspond à ce numéro dans les registres de
                {" "}<span className="font-semibold text-foreground">CS Sainte-Marie</span>. Vérifiez
                le numéro saisi ou contactez l’administration de l’école.
              </p>
            </div>
          </section>
        ) : (
          <section className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="bg-payskool-emerald px-6 py-6 text-center text-white">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/15">
                <CheckCircle2 className="size-7" />
              </div>
              <p className="mt-3 font-mono text-lg font-bold tracking-tight">{receipt.number}</p>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-white/80">
                Reçu valide · {receipt.academicYear}
              </p>
            </div>

            <div className="px-6 py-5">
              <Row k="Élève" v={`${receipt.studentName} · ${receipt.classLevel}`} />
              <Row k="Matricule" v={receipt.matricule} />
              <Row k="Mode" v={methodText[receipt.method] ?? receipt.method} />
              {receipt.chequeNumber && (
                <Row k="Chèque" v={`${receipt.chequeNumber} · ${receipt.chequeBank}`} />
              )}
              <div className="flex justify-between py-2.5">
                <span className="font-mono text-[13px] text-muted-foreground">Montant</span>
                <span className="font-mono text-lg font-bold text-payskool-emerald">
                  {formatDigits(receipt.amount)} <span className="text-xs">FCFA</span>
                </span>
              </div>
            </div>

            <div className="border-t border-border px-6 py-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                Ventilation
              </p>
              {receipt.allocations.map((a) => (
                <Row key={a.installmentId} k={a.label} v={formatCFA(a.amount)} />
              ))}
              {receipt.allocations.length === 0 && <Row k="Avance" v={formatCFA(receipt.amount)} />}
            </div>

            <div className="flex items-center gap-4 border-t border-border px-6 py-5">
              <FakeQR />
              <div className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                <p className="flex items-center gap-1.5 font-semibold text-foreground">
                  <CalendarCheck2 className="size-3.5 text-payskool-emerald" />
                  Émission : {formatFullDate(receipt.createdAt.slice(0, 10))} à {formatTime(receipt.createdAt)}
                </p>
                <p className="mt-1">
                  Signature : Payskool · {formatShortDate(receipt.createdAt.slice(0, 10))} — reçu
                  émis par la caisse de l’établissement.
                </p>
              </div>
            </div>

            <p className="border-t border-border px-6 py-3 text-center text-[11px] text-muted-foreground">
              Ce reçu a été généré par le logiciel Payskool. En cas de doute, contactez le
              secrétariat de CS Sainte-Marie.
            </p>
          </section>
        )}
      </div>

      <footer className="flex items-center justify-center gap-1.5 border-t border-border bg-card px-6 py-4 text-[11px] text-muted-foreground">
        <Search className="size-3.5" />
        Vérification authentifiée par Payskool —{" "}
        <Link href="https://payskool.africa" className="font-semibold underline-offset-2 hover:underline">
          payskool.africa
        </Link>
      </footer>
    </main>
  );
}