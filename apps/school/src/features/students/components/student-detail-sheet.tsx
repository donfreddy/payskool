"use client";

import { Button } from "@payskool/ui/components/ui/button";
import {
  Sheet,
  SheetContent,
} from "@payskool/ui/components/ui/sheet";
import { cn } from "@payskool/ui/utils";
import { BadgePercent, BellRing, Phone, Wallet } from "lucide-react";
import Link from "next/link";

import { PaymentBadge } from "@/components/shared/payment-badge";
import { StudentAvatar } from "@/components/shared/student-avatar";
import type { FakeStudent } from "@/core/mocks/fake-data";
import { TrancheRows } from "@/features/students/components/tranche-rows";
import { computeStudentBalance } from "@/lib/fees";
import { formatCFA, formatFullDate } from "@/lib/format";

export function StudentDetailSheet({
  student,
  schoolId,
  open,
  onOpenChange,
}: {
  student: FakeStudent | null;
  schoolId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const s = student;
  const balance = s ? computeStudentBalance(s) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
        {s && balance && (
          <>
            <div className="bg-payskool-navy px-6 pb-5 pt-6 text-white">
              <div className="flex items-start gap-3">
                <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} className="size-11 border border-white/20" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold tracking-tight">
                    {s.firstName} {s.lastName}
                  </h2>
                  <p className="font-mono text-xs text-white/70">{s.matricule}</p>
                  <p className="mt-0.5 text-sm text-white/80">{s.classLevel} · {s.academicYear}</p>
                </div>
                <PaymentBadge status={balance.status} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniStat label="Dû" value={formatCFA(balance.totalDue)} />
                <MiniStat label="Réglé" value={formatCFA(balance.paid)} tone="emerald" />
                <MiniStat label="Reste" value={formatCFA(balance.remaining)} tone={balance.remaining > 0 ? "orange" : "emerald"} />
              </div>
            </div>

            <div className="space-y-6 px-6 py-5">
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Échéancier</h3>
                  {(s.feePlan.discountAmount ?? 0) > 0 && (
                    <span className="flex items-center gap-1 rounded-md bg-payskool-emerald/10 px-2 py-0.5 text-[11px] font-semibold text-payskool-emerald">
                      <BadgePercent className="size-3" /> {s.feePlan.discountLabel}
                    </span>
                  )}
                </div>
                <TrancheRows installments={s.feePlan.installments} />
                {s.previousBalance < 0 && (
                  <p className="mt-3 rounded-lg bg-payskool-orange/10 px-3 py-2 text-xs font-medium text-payskool-orange">
                    Arriéré reporté 2025-2026 : {formatCFA(-s.previousBalance)}
                  </p>
                )}
              </section>

              <section className="rounded-xl border border-border bg-muted/30 p-4">
                <h3 className="text-sm font-semibold text-foreground">Contact & statut</h3>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <InfoRow k="Statut administratif" v={s.status} />
                  <InfoRow k="Responsable légal" v={s.parentName} />
                  <InfoRow k="Téléphone parent" v={
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-3.5" /> {s.parentPhone}
                    </span>
                  } />
                  <InfoRow k="Inscription" v={formatFullDate("2026-09-05")} />
                </dl>
              </section>

              <div className="flex flex-col gap-2">
                <Button asChild={true}>
                  <Link href={`/${schoolId}/cashier`} className="gap-2">
                    <Wallet className="size-4" /> Encaisser au guichet
                  </Link>
                </Button>
                <Button variant="outline">
                  <BellRing className="size-4" /> Envoyer un rappel WhatsApp
                </Button>
              </div>

              <p className="text-center text-[11px] text-muted-foreground">
                Historique des reçus disponible depuis l’onglet « Reçus ».
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function MiniStat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "emerald" | "orange" }) {
  return (
    <div className="rounded-lg bg-white/10 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-white/50">{label}</p>
      <p className={cn("font-mono text-sm font-bold", tone === "emerald" && "text-emerald-300", tone === "orange" && "text-orange-300")}>
        {value}
      </p>
    </div>
  );
}

function InfoRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{k}</dt>
      <dd className="truncate text-right font-medium text-foreground">{v}</dd>
    </div>
  );
}