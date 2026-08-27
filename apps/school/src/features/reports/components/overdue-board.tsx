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
import { Megaphone, PhoneOutgoing, Search, Send, UserCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PaymentBadge } from "@/components/shared/payment-badge";
import { StudentAvatar } from "@/components/shared/student-avatar";
import type { FakeStudent } from "@/core/mocks/fake-data";
import { listStudentsForFees } from "@/features/fees/api/fees.mock";
import { sendRelance } from "@/features/notifications/api/notifications.mock";
import {
  overdueBuckets,
  overdueStudents,
  sumUnpaidTranches,
  type OverdueStudent,
} from "@/features/reports/lib/statistics";
import { formatCFA, formatShortDate } from "@/lib/format";

const BUCKET_TONES: Record<string, { dot: string; band: string }> = {
  "0-7": { dot: "bg-amber-400", band: "bg-amber-100 text-amber-700" },
  "8-30": { dot: "bg-payskool-orange", band: "bg-payskool-orange/10 text-payskool-orange" },
  "30+": { dot: "bg-red-500", band: "bg-red-100 text-red-700" },
};

function lateTone(days: number) {
  if (days < 8) return "bg-amber-100 text-amber-700";
  if (days < 31) return "bg-payskool-orange/10 text-payskool-orange";
  return "bg-red-100 text-red-700";
}

export function OverdueBoard({
  schoolId,
  year,
  readOnly = false,
}: {
  schoolId: string;
  year: string;
  readOnly?: boolean;
}) {
  const [students, setStudents] = useState<FakeStudent[] | null>(null);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "OVERDUE" | "UNPAID">("all");
  const [sent, setSent] = useState<Set<string>>(new Set());

  useEffect(() => {
    listStudentsForFees(schoolId, year).then(setStudents);
  }, [schoolId, year]);

  const overdue: OverdueStudent[] = useMemo(
    () => (students ? overdueStudents(students) : []),
    [students],
  );

  const classes = useMemo(() => {
    const set = new Set<string>();
    overdue.forEach((o) => set.add(o.student.classLevel));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [overdue]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return overdue.filter((o) => {
      if (classFilter !== "all" && o.student.classLevel !== classFilter) return false;
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (
        q &&
        !`${o.student.firstName} ${o.student.lastName} ${o.student.matricule}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [overdue, query, classFilter, statusFilter]);

  if (!students) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement des impayés…
      </div>
    );
  }

  const buckets = overdueBuckets(overdue);
  const totalAtRisk = overdue.reduce((sum, o) => sum + o.remaining, 0);
  const totalArrears = overdue.reduce((sum, o) => sum + o.arrears, 0);
  const totalTranchesLate = sumUnpaidTranches(overdue);

  const relance = (o: OverdueStudent) => {
    sendRelance(schoolId, o.student).then((notif) => {
      if (notif) setSent((prev) => new Set(prev).add(o.student.id));
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Encours en défaut · {formatShortDate("2026-11-20")}
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-tight">{formatCFA(totalAtRisk)}</p>
              <p className="mt-1 text-xs text-white/60">
                {overdue.length} élève{overdue.length > 1 ? "s" : ""} · {totalTranchesLate} tranche
                {totalTranchesLate > 1 ? "s" : ""} échue{totalTranchesLate > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
              <Send className="size-4 text-emerald-300" />
              <span className="text-xs text-white/80">
                <span className="font-mono font-bold text-white">{sent.size}</span> relance
                {sent.size > 1 ? "s" : ""} envoyée{sent.size > 1 ? "s" : ""} aujourd’hui
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <PhoneOutgoing className="size-3.5 text-payskool-orange" />
            Rappel automatique aux parents le lundi (règle de relance #1)
          </span>
          <span className="flex items-center gap-1.5">
            <UserCheck className="size-3.5" />
            {formatCFA(totalArrears)} d’arriérés reportés inclus
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {buckets.map((b) => (
          <article key={b.key} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className={cn("flex items-center gap-1.5 text-xs font-semibold", BUCKET_TONES[b.key]!.band.split(" ")[1])}>
                <span className={cn("size-2 rounded-full", BUCKET_TONES[b.key]!.dot)} />
                {b.label}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{b.count} élève{b.count > 1 ? "s" : ""}</span>
            </div>
            <p className="mt-2 font-mono text-xl font-bold text-foreground">{formatCFA(b.amount)}</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full", BUCKET_TONES[b.key]!.dot)}
                style={{ width: `${totalAtRisk ? (b.amount / totalAtRisk) * 100 : 0}%` }}
              />
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-sm font-semibold text-foreground">Élèves à relancer</h2>
          <div className="flex flex-wrap gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom ou matricule…"
                className="h-9 rounded-lg pl-9"
              />
            </div>
            <Select value={classFilter} onValueChange={(v) => setClassFilter(v)}>
              <SelectTrigger className="h-9 w-full rounded-lg sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v: "all" | "OVERDUE" | "UNPAID") => setStatusFilter(v)}>
              <SelectTrigger className="h-9 w-full rounded-lg sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="OVERDUE">En retard</SelectItem>
                <SelectItem value="UNPAID">Impayé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Élève</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Échéance la plus ancienne</th>
                <th className="px-4 py-3 text-right font-medium">Reste dû</th>
                <th className="px-4 py-3 font-medium">Parent</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const s = o.student;
                const isSent = sent.has(s.id);
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className="flex items-center gap-2.5">
                        <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} className="size-8 text-[10px]" />
                        <span>
                          <span className="block font-medium text-foreground">{s.firstName} {s.lastName}</span>
                          <span className="block font-mono text-[11px] text-muted-foreground">
                            {s.matricule} · {s.classLevel}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <PaymentBadge status={o.status} className="px-1.5 py-0.5 text-[10px]" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="block text-muted-foreground">{o.oldest.label}</span>
                      <span className="mt-0.5 flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-muted-foreground/70">
                          {formatShortDate(o.oldest.dueDate)}
                        </span>
                        <span className={cn("rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold", lateTone(o.daysLate))}>
                          {o.daysLate + " j"}
                        </span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-bold text-payskool-orange">
                      {formatCFA(o.remaining)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="block text-foreground">{s.parentName}</span>
                      <span className="block font-mono text-[11px] text-muted-foreground">{s.parentPhone}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      {readOnly ? (
                        <span className="rounded-md bg-muted/60 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground">
                          Archive — non relançable
                        </span>
                      ) : (
                        <Button
                          variant={isSent ? "outline" : "emerald"}
                          size="sm"
                          className={cn("h-8 gap-1.5 text-xs", isSent && "cursor-default")}
                          disabled={isSent}
                          onClick={() => relance(o)}
                        >
                          <Send className="size-3.5" />
                          {isSent ? "Relance envoyée" : "Relancer"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              Aucun élève en défaut ne correspond à ces filtres.
            </p>
          )}
        </div>
      </section>

      <section className="flex items-start gap-2 rounded-xl border border-border bg-card px-5 py-4 text-xs text-muted-foreground shadow-sm">
        <Megaphone className="mt-0.5 size-4 shrink-0 text-payskool-orange" />
        <p>
          La campagne utilise les <span className="font-medium text-foreground">règles de relance</span> configurées :
          SMS WhatsApp automatique, puis appel du secrétariat après 30 jours. Les envois simulés ici n’écrivent pas dans
          l’historique de communication.
        </p>
      </section>
    </div>
  );
}