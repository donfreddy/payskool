"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import { cn } from "@payskool/ui/utils";
import { BadgePercent, Gift, Search, Trash2, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { StudentAvatar } from "@/components/shared/student-avatar";
import type { FakeStudent } from "@/core/mocks/fake-data";
import {
  applyDiscount,
  removeDiscount,
  type DiscountPatch,
} from "@/features/fees/api/fees.mock";
import { listStudentsForFees } from "@/features/fees/api/fees.mock";
import { DiscountDialog } from "@/features/fees/discounts/components/discount-dialog";
import { computeStudentBalance } from "@/lib/fees";
import { formatCFA } from "@/lib/format";

function flagOf(discountLabel?: string): string {
  const d = discountLabel ?? "";
  if (d.includes("mérite")) return "Bourses mérite";
  if (d.includes("partenariat")) return "Partenariats";
  if (d.includes("fratrie")) return "Remises fratrie";
  if (d.includes("régional")) return "Bourses régionales";
  return "Autres remises";
}

const FLAG_TONES: Record<string, string> = {
  "Bourses mérite": "bg-payskool-emerald/10 text-payskool-emerald",
  "Bourses régionales": "bg-cyan-100 text-cyan-700",
  Partenariats: "bg-violet-100 text-violet-700",
  "Remises fratrie": "bg-amber-100 text-amber-700",
  "Autres remises": "bg-secondary text-muted-foreground",
};

export function DiscountsBoard({ schoolId }: { schoolId: string }) {
  const [students, setStudents] = useState<FakeStudent[] | null>(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<FakeStudent | null>(null);

  useEffect(() => {
    listStudentsForFees(schoolId).then(setStudents);
  }, [schoolId]);

  const all = useMemo(() => students ?? [], [students]);

  const withDiscount = useMemo(
    () =>
      all
        .filter((s) => (s.feePlan.discountAmount ?? 0) > 0)
        .sort((a, b) => (b.feePlan.discountAmount ?? 0) - (a.feePlan.discountAmount ?? 0)),
    [all],
  );

  const withoutDiscount = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((s) => (s.feePlan.discountAmount ?? 0) <= 0)
      .filter(
        (s) =>
          !q ||
          `${s.firstName} ${s.lastName} ${s.classLevel} ${s.matricule}`.toLowerCase().includes(q),
      )
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [all, query]);

  if (!students) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chargement des avantages…
      </div>
    );
  }

  const totalDiscounts = withDiscount.reduce((sum, s) => sum + (s.feePlan.discountAmount ?? 0), 0);
  const flags = [...new Set(withDiscount.map((s) => flagOf(s.feePlan.discountLabel)))];

  const handleSave = (studentId: string, patch: DiscountPatch) => {
    applyDiscount(schoolId, studentId, patch).then(() => {
      setStudents((prev) =>
        prev?.map((s) =>
          s.id === studentId
            ? {
                ...s,
                feePlan: {
                  ...s.feePlan,
                  discountLabel: patch.label,
                  discountAmount: patch.amount,
                },
              }
            : s,
        ) ?? prev,
      );
      setEditing(null);
    });
  };

  const handleRemove = (studentId: string) => {
    removeDiscount(schoolId, studentId).then(() => {
      setStudents((prev) =>
        prev?.map((s) =>
          s.id === studentId
            ? { ...s, feePlan: { ...s.feePlan, discountLabel: "", discountAmount: 0 } }
            : s,
        ) ?? prev,
      );
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-payskool-navy px-6 py-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                Abattements accordés
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-tight">{formatCFA(totalDiscounts)}</p>
            </div>
            <div className="flex gap-6 text-center">
              <Band k="Élèves avantagés" v={String(withDiscount.length)} />
              <Band
                k="Abattement moyen"
                v={withDiscount.length ? formatCFA(Math.round(totalDiscounts / withDiscount.length)) : "—"}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-6 py-3">
          {flags.map((flag) => (
            <span
              key={flag}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold",
                FLAG_TONES[flag] ?? FLAG_TONES["Autres remises"],
              )}
            >
              <Gift className="size-3.5" /> {flag}
            </span>
          ))}
          {flags.length === 0 && (
            <p className="text-xs text-muted-foreground">Aucun avantage accordé pour l’instant.</p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Avantages actifs</h2>
          <span className="rounded-md bg-payskool-emerald/10 px-2 py-1 font-mono text-xs font-bold text-payskool-emerald">
            {withDiscount.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Élève</th>
                <th className="px-4 py-3 font-medium">Classe</th>
                <th className="px-4 py-3 font-medium">Avantage</th>
                <th className="px-4 py-3 text-right font-medium">Abattement</th>
                <th className="px-4 py-3 text-right font-medium">Total dû</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withDiscount.map((s) => {
                const balance = computeStudentBalance(s);
                const gross = s.feePlan.installments.reduce((sum, i) => sum + i.amount, 0);
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className="flex items-center gap-2.5">
                        <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} className="size-8 text-[10px]" />
                        <span>
                          <span className="block font-medium text-foreground">
                            {s.firstName} {s.lastName}
                          </span>
                          <span className="block font-mono text-[11px] text-muted-foreground">{s.matricule}</span>
                        </span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{s.classLevel}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold",
                          FLAG_TONES[flagOf(s.feePlan.discountLabel)],
                        )}
                      >
                        <BadgePercent className="size-3.5" /> {s.feePlan.discountLabel}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-bold text-payskool-emerald">
                      {formatCFA(s.feePlan.discountAmount ?? 0)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-foreground">
                      {formatCFA(balance.totalDue)}{" "}
                      <span className="text-[10px] text-muted-foreground">
                        ({Math.round(((s.feePlan.discountAmount ?? 0) / gross) * 100)} % grille)
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      <span className="inline-flex gap-1.5">
                        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setEditing(s)}>
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={() => handleRemove(s.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {withDiscount.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              Aucun avantage actif — attribuez une bourse depuis la liste des élèves ci-dessous.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-foreground">Attribuer une bourse ou une remise</h2>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un élève…"
              className="h-9 rounded-lg pl-9"
            />
          </div>
        </div>
        <ul className="divide-y divide-border">
          {withoutDiscount.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-secondary/30">
              <span className="flex min-w-0 items-center gap-2.5">
                <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} className="size-8 text-[10px]" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {s.firstName} {s.lastName}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {s.classLevel} · {s.matricule}
                  </span>
                </span>
              </span>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setEditing(s)}>
                <UserPlus className="size-3.5" /> Attribuer
              </Button>
            </li>
          ))}
          {withoutDiscount.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-muted-foreground">
              Tous les élèves bénéficient déjà d’un avantage.
            </li>
          )}
        </ul>
      </section>

      {editing && (
        <DiscountDialog
          key={editing.id}
          student={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => handleSave(editing.id, patch)}
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