"use client";

import { Button } from "@payskool/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@payskool/ui/components/ui/select";
import { cn } from "@payskool/ui/utils";
import { ArrowLeft, ArrowRight, Columns3, Sparkles, TriangleAlert } from "lucide-react";

import { missingRequired } from "@/features/students/import/lib/parse";
import type { FieldMapping, ParsedFile, TargetField } from "@/features/students/import/types";
import { TARGET_OPTIONS } from "@/features/students/import/types";

function sampleValues(file: ParsedFile, colIndex: number): string[] {
  const values: string[] = [];
  for (const row of file.rows) {
    const v = row[colIndex]?.trim();
    if (v && !values.includes(v)) values.push(v);
    if (values.length >= 3) break;
  }
  return values;
}

export function StepMapping({
  file,
  mapping,
  onMappingChange,
  mappingValid,
  onBack,
  onContinue,
}: {
  file: ParsedFile;
  mapping: FieldMapping[];
  onMappingChange: (mapping: FieldMapping[]) => void;
  mappingValid: boolean;
  onBack: () => void;
  onContinue: () => void;
}) {
  const missing = missingRequired(mapping);
  const usedTargets = new Map<TargetField, number>();
  for (const m of mapping) {
    usedTargets.set(m.target, (usedTargets.get(m.target) ?? 0) + 1);
  }

  const duplicates = Array.from(usedTargets.entries())
    .filter(([t, n]) => t !== "IGNORE" && n > 1)
    .map(([t]) => TARGET_OPTIONS.find((o) => o.value === t)?.label ?? t);

  const update = (column: string, target: TargetField) => {
    onMappingChange(
      mapping.map((m) => (m.column === column ? { ...m, target, auto: false } : m)),
    );
  };

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Columns3 className="size-4 text-payskool-emerald" /> Mappage des colonnes
          </h2>
          <span className="font-mono text-xs text-muted-foreground">{file.name}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Associez chaque colonne du fichier au champ PAYSKOOL correspondant. La détection est automatique,
          ajustez si besoin.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2.5 pr-3 font-medium">Colonne du fichier</th>
                <th className="py-2.5 pr-3 font-medium">Champ PAYSKOOL</th>
                <th className="py-2.5 font-medium">Exemple</th>
              </tr>
            </thead>
            <tbody>
              {mapping.map((m, idx) => {
                const colIndex = idx;
                const samples = sampleValues(file, colIndex);
                return (
                  <tr key={m.column} className="border-b border-border last:border-0">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        {m.auto ? (
                          <Sparkles className="size-3.5 shrink-0 text-payskool-emerald" />
                        ) : (
                          <span className="size-3.5 shrink-0 rounded-sm border border-border" />
                        )}
                        <span className="font-semibold text-foreground">{m.column}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <Select value={m.target} onValueChange={(v) => update(m.column, v as TargetField)}>
                        <SelectTrigger className={cn("h-9 w-56", m.auto && "border-payskool-emerald/40 bg-payskool-emerald/5")}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TARGET_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              <span className={cn(o.required && "font-medium")}>
                                {o.label}
                                {o.required && <span className="ml-0.5 text-payskool-emerald">*</span>}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3">
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {samples.length > 0 ? samples.join(" · ") : "—"}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">Contrôle du mappage</h3>
        <pre className="mt-2 overflow-hidden rounded-lg bg-payskool-navy p-3 font-mono text-[11px] leading-relaxed text-white/80">
{`⟨ fichier ⟩        ⟨ pay skool ⟩
${mapping
                .map((m) => `${m.column.padEnd(18, ".")} ${m.target === "IGNORE" ? "— ignoré" : m.target}`)
                .join("\n")}
─────────────────────
lignes détectées : ${file.rowCount}
séparateur      : « ${file.delimiter} »`}
        </pre>

        <div className="mt-4 space-y-2">
          {missing.length === 0 && mappingValid ? (
            <p className="flex items-center gap-2 rounded-lg bg-payskool-emerald/10 px-3 py-2 text-xs font-medium text-payskool-emerald">
              <span className="size-1.5 rounded-full bg-payskool-emerald" /> Champs obligatoires couverts
            </p>
          ) : (
            <p className="flex items-start gap-2 rounded-lg bg-payskool-orange/10 px-3 py-2 text-xs font-medium text-payskool-orange">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
              <span>
                Champ(s) obligatoire(s) manquant(s) :{" "}
                <span className="font-bold">{missing.join(", ")}</span>
              </span>
            </p>
          )}
          {duplicates.length > 0 && (
            <p className="rounded-lg bg-amber-100/60 px-3 py-2 text-xs font-medium text-amber-700">
              Attention : {duplicates.join(", ")} est mappé plusieurs fois — seule la première colonne sera utilisée.
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Button variant="emerald" size="lg" disabled={!mappingValid} onClick={onContinue}>
            <ArrowRight className="size-4" /> Prévisualiser & contrôler
          </Button>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="size-4" /> Choisir un autre fichier
          </Button>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Le mappage sera mémorisé pour vos prochains imports.
        </p>
      </section>
    </div>
  );
}