"use client";

import type { FakeTx } from "@/core/mocks/fake-data";
import { formatCompactCFA, formatCFA } from "@/lib/format";

function totals(txns: FakeTx[]) {
  const sum = txns.reduce((acc, t) => acc + t.amount, 0);
  const mobile = txns.filter((t) => t.method !== "CASH" && t.method !== "CHEQUE");
  const mobileSum = mobile.reduce((acc, t) => acc + t.amount, 0);
  return {
    sum,
    count: txns.length,
    avg: txns.length ? Math.round(sum / txns.length) : 0,
    mobileShare: sum ? Math.round((mobileSum / sum) * 100) : 0,
  };
}

export function LedgerSummary({ txns }: { txns: FakeTx[] }) {
  const { sum, count, avg, mobileShare } = totals(txns);
  const last = txns[0];

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="bg-payskool-navy px-6 py-5 text-white">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
              Encaissé sur la période
            </p>
            <p className="mt-1 font-mono text-4xl font-bold tracking-tight">
              {formatCFA(sum)}
            </p>
          </div>
          <div className="text-right text-xs text-white/60">
            <p>
              Dernier reçu :{" "}
              <span className="font-mono font-semibold text-white">{last ? last.receipt : "—"}</span>
            </p>
            <p>
              {last ? (
                <>
                  {last.studentName} · {last.classLevel}
                </>
              ) : (
                "Aucune opération"
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
        <Kpi label="Opérations" value={String(count)} hint={count > 0 ? "sur la période" : "aucune"} />
        <Kpi label="Panier moyen" value={avg ? formatCompactCFA(avg) : "—"} hint="par opération" />
        <Kpi label="Mobile money" value={`${mobileShare} %`} hint="de l'encaisse" accent />
      </div>
    </section>
  );
}

function Kpi({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className="px-5 py-4">
      <p className={`font-mono text-lg font-bold ${accent ? "text-payskool-emerald" : "text-foreground"}`}>
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground">
        {label} · <span className="text-muted-foreground/70">{hint}</span>
      </p>
    </div>
  );
}