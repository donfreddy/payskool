"use client";

import { Badge } from "@payskool/ui/components/ui/badge";
import { Button } from "@payskool/ui/components/ui/button";
import { cn } from "@payskool/ui/utils";
import {
  ArrowRight,
  CalendarClock,
  CheckSquare,
  Info,
  RefreshCcw,
  Square,
} from "lucide-react";
import { useMemo, useState } from "react";

import { PaymentBadge } from "@/components/shared/payment-badge";
import { StudentAvatar } from "@/components/shared/student-avatar";
import { nextAcademicYearFor } from "@/core/mocks/academic-years-db";
import type { FakeStudent } from "@/core/mocks/fake-data";
import { getStudentsSync } from "@/core/mocks/students-db";
import { computeStudentBalance, type PaymentStatus } from "@/lib/fees";
import { formatCFA } from "@/lib/format";

const FRAIS_REINSCRIPTION = 15000;

/** Élève réinscriptible : inscrit cette année, quelle que soit sa situation. */
function isEligible(s: FakeStudent): boolean {
  return s.status === "ENROLLED";
}

export function RenewalBoard({ year }: { year: string }) {
  const nextYear = nextAcademicYearFor(year);
  const students = useMemo(() => getStudentsSync().filter(isEligible), []);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(students.map((s) => s.id)));

  const totals = useMemo(() => {
    const allArrears = students.reduce((sum, s) => sum + Math.max(computeStudentBalance(s).arrears, 0), 0);
    const selectedArrears = students
      .filter((s) => selected.has(s.id))
      .reduce((sum, s) => sum + Math.max(computeStudentBalance(s).arrears, 0), 0);
    return {
      fees: selected.size * FRAIS_REINSCRIPTION,
      allArrears,
      selectedArrears,
      blocked: students.filter((s) => selected.has(s.id) && computeStudentBalance(s).arrears > 0).length,
    };
  }, [students, selected]);

  const balanced = students.filter((s) => selected.has(s.id) && computeStudentBalance(s).remaining > 0);
  const inArrears = students.filter((s) => selected.has(s.id) && computeStudentBalance(s).arrears > 0);

  const allSelected = selected.size === students.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(students.map((s) => s.id)));

  const statusOf = (s: FakeStudent): PaymentStatus => computeStudentBalance(s).status;

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Réinscription · annonce {nextYear}
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-tight">{selected.size}</p>
              <p className="mt-1 text-xs text-white/60">
                sur {students.length} élèves éligibles · {formatCFA(totals.fees)} de frais de
                réinscription attendus
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Éligibles" v={`${students.length}`} />
              <Band k="Sélectionnés" v={`${selected.size}`} />
              <Band k="Arriérés sélectionnés" v={`${totals.blocked}`} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-3 px-6 py-4">
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0 text-payskool-emerald" />
            <span>
              Préparation <span className="font-semibold text-foreground">{nextYear}</span> dans
              l’interface scolaire : on choisit ici qui est reconduit, on signale les arriérés à
              solder et on anticipe l’échéancier. La bascule effective se fera via le sélecteur
              d’année à l’ouverture de l’année.
            </span>
          </p>
          <Button variant="outline" size="sm" onClick={toggleAll}>
            {allSelected ? <Square /> : <CheckSquare />}
            {allSelected ? "Tout décocher" : "Tout cocher"}
          </Button>
        </div>
      </section>

      {balanced.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Reconduction avec reste à solder</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {balanced.length} élève(s) ont encore un solde à régler sur {year} : la réinscription
            restera activable après encaissement.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {balanced.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs"
              >
                <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} className="size-5 text-[8px]" />
                <span className="font-medium text-foreground">{s.firstName} {s.lastName}</span>
                <span className="font-mono text-muted-foreground">{formatCFA(computeStudentBalance(s).remaining)}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {inArrears.length > 0 && (
        <section className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <RefreshCcw className="size-4 text-amber-700" /> Arriérés reportés
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {totals.blocked} élève(s) sélectionné(s) portent un arriéré de {year} qui serait
            reporté en tête d’échéancier {nextYear}.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {inArrears.map((s) => {
              const b = computeStudentBalance(s);
              return (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-card px-2 py-1 text-xs"
                >
                  <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} className="size-5 text-[8px]" />
                  <span className="font-medium text-foreground">{s.firstName} {s.lastName}</span>
                  <span className="font-mono font-semibold text-amber-700">{formatCFA(b.arrears)}</span>
                </span>
              );
            })}
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="w-10 px-4 py-3" />
                <th className="px-3 py-3 font-medium">Élève</th>
                <th className="px-4 py-3 font-medium">Classe</th>
                <th className="px-4 py-3 font-medium">Situation {year}</th>
                <th className="px-4 py-3 text-right font-medium">Reste dû {year}</th>
                <th className="px-4 py-3 font-medium">Échéancier {nextYear}</th>
                <th className="px-5 py-3 text-right font-medium">Frais réinscription</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const balance = computeStudentBalance(s);
                const checked = selected.has(s.id);
                return (
                  <tr key={s.id} className={cn("border-b border-border last:border-0", checked && "bg-payskool-emerald/[0.03]")}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelected((prev) => {
                            const next = new Set(prev);
                            if (next.has(s.id)) next.delete(s.id);
                            else next.add(s.id);
                            return next;
                          })
                        }
                        className="size-4 accent-payskool-emerald"
                        aria-label={`Réinscrire ${s.firstName} ${s.lastName}`}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} />
                        <div>
                          <p className="font-medium text-foreground">
                            {s.firstName} {s.lastName}
                          </p>
                          <p className="font-mono text-[11px] text-muted-foreground">{s.matricule}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{s.classLevel}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <PaymentBadge status={statusOf(s)} />
                      {balance.arrears > 0 && (
                        <p className="mt-1 text-[11px] font-medium text-amber-700">
                          dont {formatCFA(balance.arrears)} d’arriéré
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-foreground">
                      {formatCFA(balance.remaining)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.feePlan.installments.map((i) => (
                          <Badge key={i.id} variant="outline" className="rounded-md border-border bg-muted/40 font-mono text-[10px] text-muted-foreground">
                            {i.label.split("—")[0]?.trim()} {formatCFA(i.amount)}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      <button
                        onClick={() =>
                          setSelected((prev) => {
                            const next = new Set(prev);
                            if (next.has(s.id)) next.delete(s.id);
                            else next.add(s.id);
                            return next;
                          })
                        }
                        className={cn(
                          "rounded-md px-2.5 py-1 font-mono text-xs font-bold transition-colors",
                          checked
                            ? "bg-payskool-emerald/10 text-payskool-emerald"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {formatCFA(FRAIS_REINSCRIPTION)}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/30 px-5 py-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5 text-payskool-navy" />
            Annonce {nextYear} — frais de réinscription forfaitaires en démo, à affiner sur les
            grilles tarifaires de votre établissement.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {selected.size} × {formatCFA(FRAIS_REINSCRIPTION)} ={" "}
              <span className="font-mono font-bold text-foreground">{formatCFA(totals.fees)}</span>
            </span>
            <Button variant="emerald" size="sm" disabled={selected.size === 0}>
              <ArrowRight /> Préparer les réinscriptions
            </Button>
          </div>
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