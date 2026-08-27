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
import { Check, Copy, Printer, ReceiptText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { TxMethodBadge } from "@/components/shared/tx-method-badge";
import type { FakeReceipt, TxMethod } from "@/core/mocks/fake-data";
import { listReceipts } from "@/features/receipts/api/receipts.mock";
import { ReceiptTicketCard } from "@/features/receipts/components/receipt-ticket";
import { formatCFA, formatFullDate, formatTime } from "@/lib/format";

const normalize = (s: string) => s.trim().replace(/^#/, "").toLowerCase();

export function ReceiptsBrowser({
  schoolId,
  year,
  initialQuery,
}: {
  schoolId: string;
  year: string;
  initialQuery?: string | undefined;
}) {
  const [receipts, setReceipts] = useState<FakeReceipt[] | null>(null);
  const [query, setQuery] = useState(initialQuery ?? "");
  const [method, setMethod] = useState<"all" | TxMethod>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [printed, setPrinted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    listReceipts(schoolId, year).then((r) => {
      setReceipts(r);
      setSelected((prev) => prev ?? r[0]?.id ?? null);
    });
  }, [schoolId, year]);

  useEffect(() => {
    const stop = () => setPrinted(false);
    window.addEventListener("afterprint", stop);
    return () => window.removeEventListener("afterprint", stop);
  }, []);

  const filtered = useMemo(() => {
    if (!receipts) return [];
    const q = normalize(query);
    return receipts.filter((r) => {
      if (method !== "all" && r.method !== method) return false;
      if (!q) return true;
      return normalize(r.number).includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.matricule.toLowerCase().includes(q);
    });
  }, [receipts, query, method]);

  const current = receipts?.find((r) => r.id === selected) ?? filtered[0] ?? null;

  const doPrint = () => {
    if (!current) return;
    setPrinted(true);
    setTimeout(() => window.print(), 80);
  };

  const doCopy = async () => {
    if (!current) return;
    const url = `https://app.payskool.africa/verify/${current.number.replace("#", "")}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* navigator.clipboard indisponible (http) — silencieux en démo */
    }
  };

  return (
    <>
      <div className={cn("flex flex-col gap-5", printed && "hidden")}>
        <div className="grid items-start gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(null);
                }}
                placeholder="N° reçu, élève, matricule"
                className="h-10 rounded-lg pl-9"
              />
            </div>

            <Select value={method} onValueChange={(v: "all" | TxMethod) => setMethod(v)}>
              <SelectTrigger className="h-10 rounded-lg">
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

            <div className="mt-1 flex-1 overflow-y-auto pr-1 lg:max-h-[520px]">
              <p className="px-1 pb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {receipts ? `${filtered.length} reçu${filtered.length > 1 ? "s" : ""}` : "Chargement…"}
              </p>
              <ul className="space-y-1.5">
                {filtered.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(r.id)}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                        current?.id === r.id
                          ? "border-payskool-navy bg-payskool-navy/5"
                          : "border-transparent hover:bg-secondary/60",
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">{r.number}</span>
                        <span className="font-mono text-xs font-semibold">{formatCFA(r.amount)}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {r.studentName} · {r.classLevel}
                      </span>
                      <span className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-muted-foreground/70">
                          {formatFullDate(r.createdAt.slice(0, 10))} · {formatTime(r.createdAt)}
                        </span>
                        <span className="shrink-0">
                          <TxMethodBadge method={r.method} className="px-1.5 py-0.5 text-[10px]" />
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {filtered.length === 0 && (
                <p className="rounded-lg bg-muted/60 px-3 py-6 text-center text-xs text-muted-foreground">
                  Aucun reçu ne correspond à cette recherche.
                </p>
              )}
            </div>
          </aside>

          <div className="flex flex-col gap-4">
            {current ? (
              <>
                <ReceiptTicketCard receipt={current} />
                <div className="flex flex-wrap gap-2">
                  <Button variant="emerald" onClick={doPrint}>
                    <Printer className="size-4" /> Imprimer le reçu
                  </Button>
                  <Button variant="outline" onClick={doCopy}>
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? "Lien copié" : "Copier le lien de vérification"}
                  </Button>
                </div>
              </>
            ) : (
              <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 p-8 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
                  <ReceiptText className="size-5 text-muted-foreground" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-foreground">Aucun reçu sélectionné</h2>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  Recherchez par numéro, élève ou matricule pour retrouver un reçu et le réimprimer.
                </p>
              </section>
            )}
          </div>
        </div>
      </div>

      {printed && current && (
        <div className="fixed inset-0 z-50 overflow-auto bg-white p-8">
          <div className="mx-auto max-w-sm">
            <ReceiptTicketCard receipt={current} />
          </div>
        </div>
      )}
    </>
  );
}