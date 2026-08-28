"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { Input } from "@payskool/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@payskool/ui/components/ui/select";
import { Search, SlidersHorizontal, Upload, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { FakeStudent } from "@/core/mocks/fake-data";
import { listStudents, createStudent } from "@/features/students/api/students.mock";
import { NewStudentDialog } from "@/features/students/components/new-student-dialog";
import { StudentDetailSheet } from "@/features/students/components/student-detail-sheet";
import { StudentsTable } from "@/features/students/components/students-table";
import { SummaryStrip } from "@/features/students/components/summary-strip";
import { computeStudentBalance } from "@/lib/fees";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "PAID", label: "Payés" },
  { value: "AHEAD", label: "À jour" },
  { value: "PARTIAL", label: "Partiels" },
  { value: "OVERDUE", label: "En retard" },
  { value: "UNPAID", label: "Impayés" },
];

export function StudentsView({
  schoolId,
  year,
  readOnly = false,
}: {
  schoolId: string;
  year: string;
  readOnly?: boolean;
}) {
  const [students, setStudents] = useState<FakeStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  useEffect(() => {
    listStudents(schoolId, year).then((list) => {
      setStudents(list);
      setLoading(false);
    });
  }, [schoolId, year]);

  const classes = useMemo(() => Array.from(new Set(students.map((s) => s.classLevel))).sort(), [students]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (classFilter !== "all" && s.classLevel !== classFilter) return false;
      const balance = computeStudentBalance(s);
      if (statusFilter !== "all" && balance.status !== statusFilter) return false;
      if (q) {
        const hay = `${s.firstName} ${s.lastName} ${s.matricule} ${s.classLevel}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [students, query, classFilter, statusFilter]);

  const detailStudent = students.find((s) => s.id === detailId) ?? null;

  const handleCreate = (student: FakeStudent) => {
    void createStudent(schoolId, student).then((s) => setStudents((prev) => [s, ...prev]));
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un élève…"
                className="h-10 rounded-lg pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="h-10 w-auto min-w-32">
                  <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes classes</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 w-auto min-w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!readOnly && (
              <>
                <Button asChild variant="outline">
                  <Link href={`/${schoolId}/students/import`}>
                    <Upload className="size-4" /> Importer (CSV/Excel)
                  </Link>
                </Button>
                <Button onClick={() => setNewOpen(true)}>
                  <UserPlus className="size-4" /> Nouvel élève
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <SummaryStrip students={students} year={year} />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      ) : (
        <StudentsTable students={filtered} onOpen={setDetailId} />
      )}

      <StudentDetailSheet
        student={detailStudent}
        schoolId={schoolId}
        open={detailId !== null}
        readOnly={readOnly}
        onOpenChange={(o) => !o && setDetailId(null)}
      />
      {!readOnly && (
        <NewStudentDialog open={newOpen} onOpenChange={setNewOpen} onSubmit={handleCreate} />
      )}
    </div>
  );
}