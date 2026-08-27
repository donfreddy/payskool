"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { cn } from "@payskool/ui/utils";
import {
  AlertTriangle,
  ArrowsUpFromLine,
  Check,
  FilePlus2,
  FileUp,
  List,
  Users,
} from "lucide-react";
import Link from "next/link";

import type { ImportResult } from "@/features/students/import/types";

export function StepDone({
  result,
  schoolId,
  onRestart,
  onNewFile,
}: {
  result: ImportResult;
  schoolId: string;
  onRestart: () => void;
  onNewFile: () => void;
}) {
  const { aborted, created, skipped, generatedMatricules, file, report } = result;

  return (
    <div className="mx-auto max-w-xl">
      <section
        className={cn(
          "overflow-hidden rounded-xl border bg-card shadow-sm",
          aborted ? "border-payskool-orange/40" : "border-border",
        )}
      >
        <div
          className={cn(
            "px-6 py-5 text-white",
            aborted ? "bg-payskool-orange" : "bg-payskool-navy",
          )}
        >
          <div className="flex items-center gap-3">
            {aborted ? (
              <span className="flex size-10 items-center justify-center rounded-full bg-white/20">
                <AlertTriangle className="size-5" />
              </span>
            ) : (
              <span className="flex size-10 items-center justify-center rounded-full bg-payskool-emerald">
                <Check className="size-5" />
              </span>
            )}
            <div>
              <h2 className="text-lg font-bold">
                {aborted ? "Import bloqué" : "Import terminé"}
              </h2>
              <p className="text-sm text-white/80">
                {aborted
                  ? "Des erreurs empêchent l'import. Corrigez le fichier ou choisissez « ignorer les erreurs »."
                  : `${created} élèves inscrits · fichier traité en une transaction`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          <Stat label="Créés" value={String(created)} tone={aborted ? "muted" : "emerald"} />
          <Stat label="Ignorés" value={String(skipped)} tone="slate" />
          <Stat label="Matricules générés" value={String(generatedMatricules)} tone="orange" />
        </div>

        <div className="px-6 py-4">
          <dl className="space-y-1.5 text-sm">
            <Detail k="Fichier" v={`${file.name} (${file.sizeLabel})`} />
            <Detail k="Lignes traitées" v={String(report.total)} />
            <Detail k="Valides / doublons / erreurs" v={`${report.valid} / ${report.duplicates} / ${report.errors}`} />
            <Detail k="Séparateur détecté" v={`« ${file.delimiter} »`} />
            <Detail k="Enregistré le" v={new Date(result.createdAt).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })} />
          </dl>

          <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
            {aborted ? (
              <>
                Aucune ligne n’a été importée (transaction annulée). Rechargez le fichier,
                ajustez le mappage, ou activez « ignorer les lignes en erreur » au moment du contrôle.
              </>
            ) : (
              <>
                Les tuteurs sont reliés automatiquement via la colonne « Téléphone parent ».
                Consultez chaque élève dans le registre pour personnaliser bourses et réductions.
              </>
            )}
          </div>
        </div>
      </section>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="emerald" size="lg" className="flex-1">
          <Link href={`/${schoolId}/students`}>
            <Users className="size-4" /> Voir le registre des élèves
          </Link>
        </Button>
        {!aborted && (
          <Button variant="outline" size="lg" onClick={onRestart} className="flex-1">
            <ArrowsUpFromLine className="size-4" /> Réimporter un autre fichier
          </Button>
        )}
        {aborted && (
          <Button variant="outline" size="lg" onClick={onNewFile} className="flex-1">
            <FileUp className="size-4" /> Choisir un nouveau fichier
          </Button>
        )}
      </div>

      {!aborted && (
        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <FilePlus2 className="size-3.5" /> Échéancier 3 tranches créé par élève
          </span>
          <span className="flex items-center gap-1.5">
            <List className="size-3.5" /> Registre auditable (audit_logs)
          </span>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "emerald" | "orange" | "slate" | "muted" }) {
  const tones = {
    emerald: "text-payskool-emerald",
    orange: "text-payskool-orange",
    slate: "text-foreground",
    muted: "text-muted-foreground",
  };
  return (
    <div className="px-5 py-4">
      <p className={cn("font-mono text-2xl font-bold", tones[tone])}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="truncate text-right font-medium text-foreground">{v}</dd>
    </div>
  );
}