"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { cn } from "@payskool/ui/utils";
import { FileSpreadsheet, FileUp, FolderOpen, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

import { buildParsedFile } from "@/features/students/import/lib/parse";
import { SAMPLE_CSV } from "@/features/students/import/sample-file";
import type { ParsedFile } from "@/features/students/import/types";

export function StepUpload({
  onFileParsed,
  onError,
  error,
}: {
  onFileParsed: (file: ParsedFile) => void;
  onError: (message: string | null) => void;
  error: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const readFile = (f: File | null | undefined) => {
    if (!f) return;
    const isCsv = /\.(csv|txt)$/i.test(f.name) || f.type.includes("csv");
    if (!isCsv) {
      onError("Format non pris en charge dans cette démo. Utilisez un fichier .csv (UTF-8).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      if (!text.trim()) {
        onError("Le fichier semble vide.");
        return;
      }
      onFileParsed(buildParsedFile(f.name, f.size, text));
    };
    reader.onerror = () => onError("Impossible de lire le fichier.");
    reader.readAsText(f);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            readFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          className={cn(
            "flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors",
            dragOver ? "border-payskool-emerald bg-payskool-emerald/5" : "border-border hover:border-payskool-emerald/50 hover:bg-secondary/40",
          )}
        >
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-2xl",
              dragOver ? "bg-payskool-emerald text-white" : "bg-secondary text-muted-foreground",
            )}
          >
            <FileUp className="size-6" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Déposez votre fichier ici
          </h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            ou <span className="font-medium text-payskool-emerald">parcourez vos fichiers</span>
          </p>
          <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <FileSpreadsheet className="size-3.5" /> .csv (UTF-8) · max 5 Mo · 10 000 lignes
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.txt,text/csv"
            className="hidden"
            onChange={(e) => readFile(e.target.files?.[0])}
          />
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
            {error}
          </p>
        )}
      </section>

      <section className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">Pas encore de fichier ?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Pour tester la démo, chargez une liste d’élèves pré-remplie : elle contient volontairement
          des doublons et des erreurs pour illustrer le contrôle de validation.
        </p>
        <div className="mt-4 flex flex-1 flex-col items-start justify-center gap-3">
          <Button
            variant="emerald"
            size="lg"
            onClick={() => onFileParsed(buildParsedFile("Liste_Classes_2026-2027.csv", 2860, SAMPLE_CSV))}
          >
            <Sparkles className="size-4" /> Charger le fichier d’exemple
          </Button>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FolderOpen className="size-3.5" /> 25 lignes · 8 colonnes · séparateur « ; »
          </p>
        </div>
        <div className="mt-4 rounded-lg bg-muted/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
          Format attendu : <code className="font-mono">Matricule ; Prénom ; Nom ; Sexe ; Classe ; Naissance ; Montant payé ; Tél. parent</code>
          — le mappage est détecté automatiquement, puis ajustable.
        </div>
      </section>
    </div>
  );
}