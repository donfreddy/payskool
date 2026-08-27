import { Button } from "@payskool/ui/components/ui/button";
import { CalendarDays, Lock } from "lucide-react";
import Link from "next/link";

/** Bannière « archive en lecture seule » affichée quand une année passée est
 *  sélectionnée : les saisies sont bloquées, un lien ramène à l’année en cours. */
export function ReadOnlyArchiveBanner({ year, href }: { year: string; href: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200/70 bg-amber-50 px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
        <Lock className="size-4 text-amber-700" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-amber-900">
          Année scolaire {year} — consultation en lecture seule
        </p>
        <p className="mt-0.5 text-xs text-amber-700/80">
          Archives clôturées : les saisies ne sont autorisées que sur l’année en cours.
        </p>
      </div>
      <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
        <Link href={href}>
          <CalendarDays className="size-3.5" /> Revenir à l’année en cours
        </Link>
      </Button>
    </div>
  );
}