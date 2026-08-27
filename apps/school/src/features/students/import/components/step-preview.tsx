"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { cn } from "@payskool/ui/utils";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  DatabaseZap,
  RotateCcw,
  X,
} from "lucide-react";
import { useState } from "react";

import { extractCell } from "@/features/students/import/lib/parse";
import type { FieldMapping, ParsedFile, TargetField, ValidationReport } from "@/features/students/import/types";

const TARGET_SHORT: Record<string, string> = {
  first_name: "Prénom",
  last_name: "Nom",
  class_level: "Classe",
  matricule: "Matricule",
  gender: "Sexe",
  date_of_birth: "Naissance",
  previous_balance: "Payé",
  parent_phone: "Tél. parent",
  academic_year: "Année",
};

const VERDICT_META: Record<string, { label: string; cls: string }> = {
  ok: { label: "OK", cls: "bg-payskool-emerald/10 text-payskool-emerald" },
  duplicate: { label: "Doublon", cls: "bg-blue-100 text-blue-700" },
  "missing-name": { label: "Nom manquant", cls: "bg-payskool-orange/10 text-payskool-orange" },
  "invalid-class": { label: "Classe invalide", cls: "bg-payskool-orange/10 text-payskool-orange" },
  "bad-amount": { label: "Montant invalide", cls: "bg-destructive/10 text-destructive" },
};

export function StepPreview({
  file,
  mapping,
  report,
  ignoreErrors,
  onIgnoreErrors,
  onBack,
  onConfirm,
}: {
  file: ParsedFile;
  mapping: FieldMapping[];
  report: ValidationReport;
  ignoreErrors: boolean;
  onIgnoreErrors: (v: boolean) => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [previewRows] = useState(() => Math.min(file.rowCount, 20));
  const columns = mapping.filter((m) => m.target !== "IGNORE");
  const hasErrors = report.errors > 0;

  return (
    <div className="flex flex-col gap-5">
      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryChip
          tone="emerald"
          icon={<CheckCircle2 className="size-4" />}
          label="Lignes valides"
          value={String(report.valid)}
        />
        <SummaryChip
          tone="blue"
          icon={<RotateCcw className="size-4" />}
          label="Doublons détectés"
          value={String(report.duplicates)}
        />
        <SummaryChip
          tone={hasErrors ? "orange" : "slate"}
          icon={hasErrors ? <AlertTriangle className="size-4" /> : <X className="size-4" />}
          label="Lignes en erreur"
          value={String(report.errors)}
        />
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Prévisualisation</h2>
            <p className="text-xs text-muted-foreground">
              {previewRows} premières lignes sur {file.rowCount} · fichier {file.name}
            </p>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            séparateur « {file.delimiter} »
          </span>
        </div>

        <div className="max-h-96 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Ligne</th>
                {columns.map((c) => (
                  <th key={`${c.column}-${c.target}`} className="px-3 py-2.5 font-medium">
                    {TARGET_SHORT[c.target] ?? c.target}
                  </th>
                ))}
                <th className="px-4 py-2.5 font-medium">Contrôle</th>
              </tr>
            </thead>
            <tbody>
              {file.rows.slice(0, previewRows).map((row, idx) => {
                const verdict = report.details.find((d) => d.rowIndex === idx)?.verdict ?? "ok";
                const meta = VERDICT_META[verdict] ?? VERDICT_META.ok!;
                const details = report.details.find((d) => d.rowIndex === idx);
                return (
                  <tr key={idx} className={cn("border-b border-border last:border-0", verdict !== "ok" && "bg-destructive/[0.03]")}>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{idx + 2}</td>
                    {columns.map((c) => {
                      const value = extractCell(mapping, file.rows, c.target as TargetField, idx);
                      return (
                        <td key={`${c.column}-${c.target}`} className="max-w-40 truncate px-3 py-2.5">
                          <span className="truncate font-medium text-foreground">{value || <span className="text-muted-foreground/50">—</span>}</span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-2.5">
                      <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold", meta.cls)}>
                        {verdict !== "ok" && verdict === "duplicate" && <RotateCcw className="size-3" />}
                        {verdict === "ok" && <CheckCircle2 className="size-3" />}
                        {verdict === "bad-amount" && <AlertTriangle className="size-3" />}
                        {verdict === "missing-name" || verdict === "invalid-class" ? <AlertTriangle className="size-3" /> : null}
                        <span className="whitespace-nowrap">{meta.label}</span>
                      </span>
                      {details?.reason && verdict !== "ok" && (
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{details.reason}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <label className="relative flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={ignoreErrors}
              onChange={(e) => onIgnoreErrors(e.target.checked)}
              className="size-4 accent-payskool-emerald"
            />
          </label>
          <div>
            <p className="text-sm font-semibold text-foreground">Ignorer les lignes en erreur</p>
            <p className="text-xs text-muted-foreground">
              L’import est transactionnel : il créera {report.valid} élèves et ignorera les{" "}
              {report.duplicates + report.errors} autres lignes signalées.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="size-4" /> Mappage
          </Button>
          {hasErrors && !ignoreErrors && (
            <p className="max-w-48 rounded-lg bg-payskool-orange/10 px-3 py-1.5 text-[11px] font-medium text-payskool-orange">
              L’import sera annulé tant que des erreurs subsistent.
            </p>
          )}
          <Button variant="emerald" size="lg" onClick={onConfirm}>
            <DatabaseZap className="size-4" /> Lancer l’import
          </Button>
        </div>
      </section>
    </div>
  );
}

function SummaryChip({
  tone,
  icon,
  label,
  value,
}: {
  tone: "emerald" | "blue" | "orange" | "slate";
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const tones = {
    emerald: "bg-payskool-emerald/10 text-payskool-emerald",
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-payskool-orange/10 text-payskool-orange",
    slate: "bg-secondary text-muted-foreground",
  };
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm")}>
      <span className={cn("flex size-10 items-center justify-center rounded-lg", tones[tone])}>{icon}</span>
      <div>
        <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}