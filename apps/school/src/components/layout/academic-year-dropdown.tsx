"use client";

import { cn } from "@payskool/ui/utils";
import { CalendarDays, Check, ChevronDown, Lock } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  ACADEMIC_YEARS,
  CURRENT_ACADEMIC_YEAR,
  isPastAcademicYear,
  resolveAcademicYear,
} from "@/core/mocks/academic-years-db";

/** Sélecteur d’année académique du header. Conserve les autres paramètres
 *  d’URL et bascule `?year=…` ; les années passées sont en lecture seule. */
export function AcademicYearDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = resolveAcademicYear(searchParams.get("year"));

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const select = (year: string) => {
    setOpen(false);
    if (year === selected) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set("year", year);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div ref={ref} className="relative">
      <button
        className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <CalendarDays className="size-4 text-muted-foreground" />
        <span className="whitespace-nowrap">
          Année Scolaire : <span className="font-semibold">{selected}</span>
        </span>
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-border bg-card p-1.5 shadow-xl" role="listbox">
          <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Années académiques
          </p>
          {ACADEMIC_YEARS.map((year) => {
            const past = isPastAcademicYear(year);
            const active = selected === year;
            return (
              <button
                key={year}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => select(year)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
                  active ? "bg-payskool-emerald/10 text-foreground" : "text-foreground hover:bg-secondary",
                )}
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <CalendarDays className="size-3.5 text-muted-foreground" />
                    {year}
                    {year === CURRENT_ACADEMIC_YEAR && (
                      <span className="rounded bg-payskool-emerald/15 px-1.5 py-0.5 text-[10px] font-bold text-payskool-emerald">
                        Actuelle
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {past ? (
                      <>
                        <Lock className="mr-1 inline size-3 align-[-1.5px]" />
                        Année précédente — lecture seule
                      </>
                    ) : (
                      "Année en cours — saisies autorisées"
                    )}
                  </span>
                </span>
                {active && <Check className="size-4 shrink-0 text-payskool-emerald" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}