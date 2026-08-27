import type { FakeFeeStructure, FakeStudent } from "@/core/mocks/fake-data";
import { computeStudentBalance } from "@/lib/fees";

export interface StructureStats {
  effectif: number;
  enrolled: number;
  totalDue: number;
  collected: number;
  recovery: number; // 0 → 100
  overdue: number; // nb d'élèves en retard
}

/** Statistiques de recouvrement d'une grille à partir des élèves réels de la classe. */
export function structureStats(structure: FakeFeeStructure, students: FakeStudent[]): StructureStats {
  const cls = students.filter((s) => s.classLevel === structure.classLevel);
  const balances = cls.map((s) => computeStudentBalance(s));
  const totalDue = balances.reduce((sum, b) => sum + b.totalDue, 0);
  const collected = balances.reduce((sum, b) => sum + b.paid, 0);
  return {
    effectif: cls.length,
    enrolled: cls.filter((s) => s.status === "ENROLLED").length,
    totalDue,
    collected,
    recovery: totalDue > 0 ? Math.round((collected / totalDue) * 100) : 100,
    overdue: balances.filter((b) => b.hasOverdue).length,
  };
}