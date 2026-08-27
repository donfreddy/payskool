import { CalendarDays, Lock } from "lucide-react";

/** Panneau « archives » affiché à la place d’une fonctionnalité d’écriture
 *  (encaissement, import) quand une année passée est consultée. */
export function ArchiveReadonlyPanel({
  year,
  title,
  description,
}: {
  year: string;
  title: string;
  description: string;
}) {
  return (
    <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-amber-100">
        <Lock className="size-6 text-amber-700" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      <p className="mt-4 flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground">
        <CalendarDays className="size-3.5" /> Archives {year} — clôturées
      </p>
    </section>
  );
}