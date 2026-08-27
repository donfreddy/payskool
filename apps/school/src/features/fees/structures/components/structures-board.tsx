"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { cn } from "@payskool/ui/utils";
import { CalendarClock, ChartNoAxesCombined, ClipboardEdit, Megaphone, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { MOCK_NOW, installmentPeriod, type FakeFeeStructure, type FakeStudent } from "@/core/mocks/fake-data";
import {
  listFeeStructures,
  listStudentsForFees,
  saveFeeStructure,
} from "@/features/fees/api/fees.mock";
import { structureStats } from "@/features/fees/lib/statistics";
import { StructureEditorDialog } from "@/features/fees/structures/components/structure-editor-dialog";
import { formatCFA, formatShortDate } from "@/lib/format";

const PERIOD_META = {
  open: { label: "En cours", tone: "bg-payskool-emerald/10 text-payskool-emerald" },
  past: { label: "Échue", tone: "bg-payskool-orange/10 text-payskool-orange" },
  upcoming: { label: "À venir", tone: "bg-cyan-100 text-cyan-700" },
} as const;

function recoveryTone(rate: number) {
  if (rate >= 75) return "bg-payskool-emerald";
  if (rate >= 50) return "bg-amber-400";
  return "bg-payskool-orange";
}

export function StructuresBoard({
  schoolId,
  year,
  readOnly = false,
}: {
  schoolId: string;
  year: string;
  readOnly?: boolean;
}) {
  const [structures, setStructures] = useState<FakeFeeStructure[] | null>(null);
  const [students, setStudents] = useState<FakeStudent[]>([]);
  const [editing, setEditing] = useState<FakeFeeStructure | null>(null);

  useEffect(() => {
    listFeeStructures(schoolId).then(setStructures);
    listStudentsForFees(schoolId, year).then(setStudents);
  }, [schoolId, year]);

  const stats = useMemo(() => {
    if (!structures) return null;
    return structures.map((s) => ({ structure: s, stats: structureStats(s, students) }));
  }, [structures, students]);

  if (!stats) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement des grilles…
      </div>
    );
  }

  const average = stats.length
    ? Math.round(stats.reduce((s, { structure: g }) => s + g.total, 0) / stats.length)
    : 0;
  const covered = stats.filter(({ stats: s }) => s.recovery >= 75).length;

  const handleSaved = (installs: FakeFeeStructure["installments"]) => {
    if (!editing) return;
    saveFeeStructure(editing.id, installs).then((updated) => {
      if (updated) {
        setStructures((prev) => prev?.map((s) => (s.id === updated.id ? updated : s)) ?? prev);
      }
      setEditing(null);
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                {readOnly ? `Grilles archivées · ${year}` : `Grilles actives · ${year}`}
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-tight">{stats.length}</p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Panier moyen" v={formatCFA(average)} />
              <Band k="Tranches / classe" v="3" />
              <Band k="Grilles ≥ 75 % recouvrées" v={String(covered)} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 px-6 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Megaphone className="size-3.5 text-payskool-orange" /> Trimestre 2 en cours (échéance 15 nov. — 25 nov.)
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" /> Effectif simulé par classe
          </span>
          <span className="flex items-center gap-1.5">
            {readOnly ? (
              <>
                <span className="size-3.5 rounded-full bg-amber-400/80" /> Année clôturée — grilles en consultation
              </>
            ) : (
              <>
                <ClipboardEdit className="size-3.5" /> Modifications enregistrées dans la base de démo
              </>
            )}
          </span>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ structure, stats: s }) => (
          <article key={structure.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="bg-payskool-navy px-4 py-3 text-white">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold tracking-tight">{structure.classLevel}</h2>
                <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/80">
                  {s.effectif} élève{s.effectif > 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1 font-mono text-xs text-white/70">
                <span className="text-emerald-300">{formatCFA(structure.total)}</span> · 3 tranches
              </p>
            </div>

            <div className="flex-1 space-y-1.5 px-4 py-3">
              {structure.installments.map((inst) => {
                const period = installmentPeriod(inst.dueDate, MOCK_NOW);
                const meta = PERIOD_META[period];
                return (
                  <div key={inst.label} className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                      <CalendarClock className="size-3.5 shrink-0" />
                      <span className="truncate">{inst.label}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {formatShortDate(inst.dueDate)}
                      </span>
                      <span className={cn("rounded px-1.5 py-0.5 font-semibold", meta.tone)}>{meta.label}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border px-4 py-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Recouvrement</span>
                <span className={cn("font-mono font-bold", s.recovery >= 75 ? "text-payskool-emerald" : "text-payskool-orange")}>
                  {s.recovery} %
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className={cn("h-full rounded-full", recoveryTone(s.recovery))} style={{ width: `${s.recovery}%` }} />
              </div>
              {s.overdue > 0 && (
                <p className="mt-2 text-[11px] text-payskool-orange">
                  {s.overdue} élève{s.overdue > 1 ? "s" : ""} en retard sur une tranche
                </p>
              )}
            </div>

            <div className="border-t border-border bg-muted/20 px-4 py-2.5">
              {readOnly ? (
                <span className="flex h-8 w-full items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  Lecture seule
                </span>
              ) : (
                <Button variant="ghost" size="sm" className="h-8 w-full justify-center gap-1.5 text-xs" onClick={() => setEditing(structure)}>
                  <ChartNoAxesCombined className="size-3.5" /> Modifier l’échéancier
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <StructureEditorDialog
          key={editing.id}
          structure={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
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