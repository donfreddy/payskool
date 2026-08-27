import { Input } from "@payskool/ui/components/ui/input";
import { cn } from "@payskool/ui/utils";
import { Search, ScanLine, GraduationCap } from "lucide-react";

import { StudentAvatar } from "@/components/shared/student-avatar";
import type { FakeStudent } from "@/core/mocks/fake-data";
import { computeStudentBalance } from "@/lib/fees";
import { formatCFA } from "@/lib/format";

export function StudentLookup({
  students,
  loading,
  query,
  onQueryChange,
  selectedId,
  onSelect,
}: {
  students: FakeStudent[];
  loading: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const q = query.trim().toLowerCase();
  const matches = q
    ? students.filter((s) => {
        const hay = `${s.firstName} ${s.lastName} ${s.matricule} ${s.classLevel}`.toLowerCase();
        return hay.includes(q);
      })
    : students;

  return (
    <section className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-4">
        <label className="text-sm font-semibold text-foreground" htmlFor="cashier-search">
          Trouver un élève
        </label>
        <p className="mt-0.5 text-xs text-muted-foreground">Nom, matricule ou classe.</p>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="cashier-search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Rechercher…"
            className="h-10 rounded-lg pl-9 pr-9"
            autoComplete="off"
          />
          <ScanLine className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-payskool-emerald" />
        </div>
      </div>

      <div className="max-h-[340px] flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="space-y-2 p-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-secondary" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <GraduationCap className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Aucun élève trouvé</p>
            <p className="text-xs text-muted-foreground">Vérifiez le matricule ou l’orthographe du nom.</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {matches.map((s) => {
              const balance = computeStudentBalance(s);
              const active = s.id === selectedId;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => onSelect(s.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors",
                      active ? "bg-payskool-emerald/10 ring-1 ring-payskool-emerald/30" : "hover:bg-secondary",
                    )}
                  >
                    <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {s.firstName} {s.lastName}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {s.matricule} · {s.classLevel}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "text-right text-xs font-semibold whitespace-nowrap",
                        balance.remaining > 0 ? "text-foreground" : "text-payskool-emerald",
                      )}
                    >
                      {balance.remaining > 0 ? formatCFA(balance.remaining) : "À jour"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
        {matches.length} élève{matches.length > 1 ? "s" : ""} · guichet du 20 nov. 2026
      </div>
    </section>
  );
}