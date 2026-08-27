"use client";

import { cn } from "@payskool/ui/utils";
import { BadgeCheck, Check, Columns3, FileUp, ListChecks } from "lucide-react";
import { useState } from "react";

import { submitImport } from "@/features/students/import/api/import.mock";
import { StepDone } from "@/features/students/import/components/step-done";
import { StepMapping } from "@/features/students/import/components/step-mapping";
import { StepPreview } from "@/features/students/import/components/step-preview";
import { StepUpload } from "@/features/students/import/components/step-upload";
import { autoDetectMapping, requiredFieldsCovered, validateRows } from "@/features/students/import/lib/parse";
import type { FieldMapping, ImportResult, ParsedFile, ValidationReport } from "@/features/students/import/types";

type Stage = 0 | 1 | 2 | 3 | 4;

const STEP_LABELS = ["Fichier", "Mappage", "Contrôle", "Import"] as const;
const STEP_ICONS = [FileUp, Columns3, ListChecks, BadgeCheck] as const;

export function ImportWizard({ schoolId }: { schoolId: string }) {
  const [stage, setStage] = useState<Stage>(0);
  const [file, setFile] = useState<ParsedFile | null>(null);
  const [mapping, setMapping] = useState<FieldMapping[]>([]);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [ignoreErrors, setIgnoreErrors] = useState(true);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [processing, setProcessing] = useState(0);
  const [dropError, setDropError] = useState<string | null>(null);

  const acceptFile = (f: ParsedFile) => {
    setFile(f);
    setMapping(autoDetectMapping(f));
    setReport(null);
    setResult(null);
    setIgnoreErrors(true);
    setDropError(null);
    setStage(1);
  };

  const goToPreview = () => {
    if (file) {
      setReport(validateRows(mapping, file));
      setStage(2);
    }
  };

  const runImport = async () => {
    if (!file || !report) return;
    setStage(3);
    setProcessing(6);
    const timer = window.setInterval(() => {
      setProcessing((p) => (p < 86 ? p + 4 : p));
    }, 70);

    const res = await submitImport({ file, mapping, report, ignoreErrors });
    window.clearInterval(timer);
    setProcessing(100);
    setTimeout(() => {
      setResult(res);
      setStage(4);
    }, 250);
  };

  const startOver = () => {
    setFile(null);
    setMapping([]);
    setReport(null);
    setResult(null);
    setStage(0);
  };

  const rails: { count?: string | undefined }[] = [
    { count: file ? String(file.rowCount) : undefined },
    { count: mapping.filter((m) => m.target !== "IGNORE").length ? String(mapping.filter((m) => m.target !== "IGNORE").length) : undefined },
    { count: report ? String(report.total) : undefined },
    { count: result ? String(result.created) : undefined },
  ];

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <ol className="flex items-center gap-1.5 lg:gap-3">
          {STEP_LABELS.map((label, i) => {
            const Icon = STEP_ICONS[i]!;
            const done = stage > i;
            const current = stage === i || (stage === 3 && i === 3);
            return (
              <li key={label} className="flex flex-1 items-center gap-1.5 lg:gap-3">
                {i > 0 && <span className="h-px min-w-2 flex-1 bg-border" />}
                <span
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                    current && "bg-payskool-navy text-white",
                    !current && done && "bg-payskool-emerald/10 text-payskool-emerald",
                    !current && !done && "bg-secondary text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md text-[11px] font-bold",
                      current ? "bg-white/20 text-white" : done ? "bg-payskool-emerald text-white" : "bg-card text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  <span className="hidden items-center gap-1.5 sm:flex">
                    <Icon className="size-4 opacity-80" />
                    <span className="text-xs font-semibold">{label}</span>
                    {rails[i]?.count && (
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold",
                          current ? "bg-white/20 text-white" : "bg-card/60",
                        )}
                      >
                        {rails[i].count}
                      </span>
                    )}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      {stage === 0 && (
        <StepUpload
          error={dropError}
          onError={setDropError}
          onFileParsed={(f) => acceptFile(f)}
        />
      )}

      {stage === 1 && file && (
        <StepMapping
          file={file}
          mapping={mapping}
          onMappingChange={setMapping}
          mappingValid={requiredFieldsCovered(mapping)}
          onBack={() => setStage(0)}
          onContinue={goToPreview}
        />
      )}

      {stage === 2 && file && mapping.length > 0 && report && (
        <StepPreview
          file={file}
          mapping={mapping}
          report={report}
          ignoreErrors={ignoreErrors}
          onIgnoreErrors={setIgnoreErrors}
          onBack={() => setStage(1)}
          onConfirm={runImport}
        />
      )}

      {stage === 3 && file && (
        <section className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center shadow-sm">
          <div role="progressbar" aria-valuenow={processing} className="relative size-24">
            <svg viewBox="0 0 96 96" className="size-full -rotate-90">
              <circle cx="48" cy="48" r="42" fill="none" strokeWidth="10" className="stroke-secondary" />
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                className="stroke-payskool-emerald transition-all duration-100"
                strokeDasharray={`${(processing / 100) * 264} 264`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold text-foreground">
              {processing}%
            </span>
          </div>
          <h2 className="mt-5 text-base font-semibold text-foreground">Import en cours…</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Création des {report?.valid ?? 0} élèves dans une transaction unique. Vérification des doublons et
            liaison avec les tuteurs.
          </p>
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">{file.name}</p>
        </section>
      )}

      {stage === 4 && result && (
        <StepDone
          result={result}
          schoolId={schoolId}
          onRestart={startOver}
          onNewFile={() => {
            setFile(null);
            setMapping([]);
            setReport(null);
            setResult(null);
            setStage(0);
          }}
        />
      )}
    </div>
  );
}