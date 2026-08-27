"use client";

import { cn } from "@payskool/ui/utils";
import { CalendarClock, Landmark, Megaphone, Percent, PieChart, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { TxMethodBadge } from "@/components/shared/tx-method-badge";
import type { FakeFeeStructure, FakeReceipt, FakeStudent } from "@/core/mocks/fake-data";
import { listFeeStructures, listStudentsForFees } from "@/features/fees/api/fees.mock";
import { structureStats } from "@/features/fees/lib/statistics";
import { listReceipts } from "@/features/receipts/api/receipts.mock";
import {
  globalCollection,
  methodShares,
  METHOD_ORDER,
  type MethodShare,
} from "@/features/reports/lib/statistics";
import { formatCFA, formatCompactCFA } from "@/lib/format";

const BAR_TONES: Record<string, string> = {
  CASH: "bg-payskool-navy",
  CHEQUE: "bg-violet-500",
  ORANGE_MONEY: "bg-payskool-orange",
  MTN_MOMO: "bg-amber-400",
  WAVE: "bg-cyan-500",
};

function recoveryTone(rate: number) {
  if (rate >= 75) return "bg-payskool-emerald";
  if (rate >= 50) return "bg-amber-400";
  return "bg-payskool-orange";
}

export function CollectionBoard({ schoolId }: { schoolId: string }) {
  const [structures, setStructures] = useState<FakeFeeStructure[] | null>(null);
  const [students, setStudents] = useState<FakeStudent[]>([]);
  const [receipts, setReceipts] = useState<FakeReceipt[]>([]);

  useEffect(() => {
    listFeeStructures(schoolId).then(setStructures);
    listStudentsForFees(schoolId).then(setStudents);
    listReceipts(schoolId).then(setReceipts);
  }, [schoolId]);

  const global = useMemo(() => (students.length ? globalCollection(students) : null), [students]);
  const shares = useMemo(() => methodShares(receipts), [receipts]);
  const byClass = useMemo(
    () =>
      (structures ?? []).map((s) => ({ structure: s, stats: structureStats(s, students) })),
    [structures, students],
  );

  if (!global) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement du recouvrement…
      </div>
    );
  }

  const totalReceipts = shares.reduce((sum, s) => sum + s.amount, 0);
  const sorted = [...byClass].sort((a, b) => a.stats.recovery - b.stats.recovery);

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Encaissé à date · 2026-2027
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-tight">
                {formatCompactCFA(global.collected)}
              </p>
              <p className="mt-1 text-xs text-white/60">{formatCFA(global.totalDue)} attendus au total</p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Taux global" v={`${global.recovery} %`} />
              <Band k="Reste à percevoir" v={formatCompactCFA(global.remaining)} />
              <Band k="Élèves à jour" v={`${global.uptoDate}/${students.length}`} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Megaphone className="size-3.5 text-payskool-orange" /> Trimestre 2 en cours (échéance 15 nov. – 25 nov.)
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" /> Recouvrement calculé sur les soldes réels des élèves
          </span>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Landmark className="size-4 text-payskool-navy" /> Modes de paiement
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Part du registre des {receipts.length} reçus
              </p>
            </div>
            <Percent className="size-4 text-muted-foreground/50" />
          </div>

          <div className="mt-4 flex h-3 w-full gap-1 overflow-hidden rounded-full bg-secondary">
            {shares.map((s) => (
              <div
                key={s.method}
                className={cn("h-full rounded-full transition-all", BAR_TONES[s.method])}
                style={{ width: `${totalReceipts ? (s.amount / totalReceipts) * 100 : 0}%` }}
                title={`${s.method} · ${formatCFA(s.amount)}`}
              />
            ))}
          </div>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {METHOD_ORDER.filter((m) => shares.some((s) => s.method === m)).map((m) => {
              const share = shares.find((s) => s.method === m) as MethodShare;
              const pct = totalReceipts ? Math.round((share.amount / totalReceipts) * 100) : 0;
              return (
                <li key={m} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <TxMethodBadge method={m} className="px-1.5 py-0.5 text-[10px]" />
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {formatCFA(share.amount)}
                  </span>
                  <span className="w-11 text-right font-mono text-xs text-muted-foreground">{pct} %</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarClock className="size-4 text-payskool-orange" /> À venir
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Tranche 3 du 2ème trimestre — échéance <span className="font-medium">févr. 2027</span>, montant attendu
            sur les grilles actives.
          </p>
          <p className="mt-4 font-mono text-2xl font-bold text-foreground">
            {formatCompactCFA(
              structures?.reduce(
                (sum, s) => sum + (s.installments[s.installments.length - 1]?.amount ?? 0),
                0,
              ) ?? 0,
            )}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <PieChart className="size-3.5" /> 8 grilles · 3 tranches chacune
          </p>
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Recouvrement par classe</h2>
          <span className="rounded-md bg-payskool-emerald/10 px-2 py-1 font-mono text-xs font-bold text-payskool-emerald">
            {global.recovery} % global
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Classe</th>
                <th className="px-4 py-3 text-center font-medium">Effectif</th>
                <th className="px-4 py-3 text-right font-medium">Total dû</th>
                <th className="px-4 py-3 text-right font-medium">Encaissé</th>
                <th className="px-4 py-3 text-right font-medium">Reste</th>
                <th className="px-4 py-3 font-medium">Taux</th>
                <th className="px-5 py-3 text-center font-medium">Retardataires</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(({ structure, stats: s }) => (
                <tr key={structure.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-foreground">
                    {structure.classLevel}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-muted-foreground">{s.effectif}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-muted-foreground">
                    {formatCFA(s.totalDue)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-semibold text-foreground">
                    {formatCFA(s.collected)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-muted-foreground">
                    {formatCFA(Math.max(s.totalDue - s.collected, 0))}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                        <span className={cn("block h-full rounded-full", recoveryTone(s.recovery))} style={{ width: `${s.recovery}%` }} />
                      </span>
                      <span className={cn("font-mono text-xs font-bold", s.recovery >= 75 ? "text-payskool-emerald" : "text-payskool-orange")}>
                        {s.recovery} %
                      </span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-center">
                    {s.overdue > 0 ? (
                      <span className="rounded-md bg-payskool-orange/10 px-2 py-1 font-mono text-xs font-semibold text-payskool-orange">
                        {s.overdue}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-payskool-emerald">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Band({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-mono text-xl font-bold text-white">{v}</p>
      <p className="mt-0.5 text-center text-[10px] uppercase tracking-wide text-white/50">{k}</p>
    </div>
  );
}