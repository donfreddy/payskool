"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@payskool/ui/components/ui/select";
import { cn } from "@payskool/ui/utils";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { MOCK_NOW, type FakeStudent, type FakeTx, type TxMethod } from "@/core/mocks/fake-data";
import { listStudents } from "@/features/students/api/students.mock";
import { listTransactions } from "@/features/transactions/api/transactions.mock";
import { LedgerSummary } from "@/features/transactions/components/ledger-summary";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import { downloadTextFile, transactionsToCSV } from "@/features/transactions/lib/export";

type Period = "all" | "today" | "7d" | "30d";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "today", label: "Aujourd'hui" },
  { value: "7d", label: "7 derniers jours" },
  { value: "30d", label: "30 derniers jours" },
  { value: "all", label: "Tout l'historique" },
];

const PERIOD_REFERENCE = MOCK_NOW;
const PAGE_SIZE = 14;

export function TransactionLedger({ schoolId, year }: { schoolId: string; year: string }) {
  const [txns, setTxns] = useState<FakeTx[] | null>(null);
  const [students, setStudents] = useState<FakeStudent[]>([]);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<Period>("all");
  const [method, setMethod] = useState<"all" | TxMethod>("all");
  const [page, setPage] = useState(0);

  useEffect(() => {
    listTransactions(schoolId, year).then((t) => setTxns(t));
    listStudents(schoolId, year).then((s) => setStudents(s));
  }, [schoolId, year]);

  const filtered = useMemo(() => {
    if (!txns) return [];
    const q = query.trim().toLowerCase();
    let days = Infinity;
    if (period === "today") days = 1;
    else if (period === "7d") days = 7;
    else if (period === "30d") days = 30;
    const cutoff = new Date(PERIOD_REFERENCE.getTime() - days * 24 * 3600 * 1000).getTime();

    return txns.filter((t) => {
      if (period !== "all" && new Date(t.date).getTime() < cutoff) return false;
      if (method !== "all" && t.method !== method) return false;
      if (q && !`${t.studentName} ${t.receipt} ${t.classLevel}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [txns, query, period, method]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const slice = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const to = Math.min(filtered.length, (safePage + 1) * PAGE_SIZE);

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const label = period === "today" ? "aujourd-hui" : period === "7d" ? "7-jours" : period === "30d" ? "30-jours" : "historique";
    downloadTextFile(`encaissements-${label}.csv`, transactionsToCSV(filtered));
  };

  return (
    <div className="flex flex-col gap-5">
      <LedgerSummary txns={txns ?? []} />

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Rechercher un élève, un n° de reçu…"
            className="h-10 rounded-lg pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={period}
            onValueChange={(v: Period) => {
              setPeriod(v);
              setPage(0);
            }}
          >
            <SelectTrigger className="h-10 w-44 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={method}
            onValueChange={(v: "all" | TxMethod) => {
              setMethod(v);
              setPage(0);
            }}
          >
            <SelectTrigger className="h-10 w-40 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les modes</SelectItem>
              <SelectItem value="CASH">Espèces</SelectItem>
              <SelectItem value="CHEQUE">Chèques</SelectItem>
              <SelectItem value="ORANGE_MONEY">Orange Money</SelectItem>
              <SelectItem value="MTN_MOMO">MTN MoMo</SelectItem>
              <SelectItem value="WAVE">Wave</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="h-10" onClick={exportCSV} disabled={filtered.length === 0}>
            <Download className="size-4" /> CSV
          </Button>
        </div>
      </section>

      <TransactionsTable txns={slice} schoolId={schoolId} students={students} />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>
          Opérations <span className="font-mono font-semibold text-foreground">{from}–{to}</span> sur{" "}
          <span className="font-mono font-semibold text-foreground">{filtered.length}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft className="size-4" /> Précédent
          </Button>
          <span className="px-1 font-mono text-[11px]">
            {safePage + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            Suivant <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className={cn("size-1.5 rounded-full bg-payskool-emerald")} />
        Les encaissements passés au guichet caisse apparaissent dans ce journal en temps réel.
      </p>
    </div>
  );
}