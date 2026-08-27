import type { FakeStudent } from "@/core/mocks/fake-data";
import { addStudent } from "@/core/mocks/students-db";
import { extractCell } from "@/features/students/import/lib/parse";
import type {
  FieldMapping,
  ImportResult,
  ParsedFile,
  ValidationReport,
} from "@/features/students/import/types";

function buildStudent(
  file: ParsedFile,
  mapping: FieldMapping[],
  rowIndex: number,
  matricule: string,
): FakeStudent {
  const firstName = extractCell(mapping, file.rows, "first_name", rowIndex);
  const lastName = extractCell(mapping, file.rows, "last_name", rowIndex);
  const classLevel = extractCell(mapping, file.rows, "class_level", rowIndex);
  const genderRaw = extractCell(mapping, file.rows, "gender", rowIndex);
  const phone = extractCell(mapping, file.rows, "parent_phone", rowIndex);
  const balanceRaw = extractCell(mapping, file.rows, "previous_balance", rowIndex);
  const year = extractCell(mapping, file.rows, "academic_year", rowIndex) || "2026-2027";

  const balanceDigits = balanceRaw.replace(/[^\d]/g, "");
  const previousBalance = balanceDigits ? -parseInt(balanceDigits, 10) : 0;

  const gender: "M" | "F" = /^f/i.test(genderRaw) ? "F" : "M";

  return {
    id: `std_import_${rowIndex}_${Date.now()}`,
    matricule,
    firstName,
    lastName,
    gender,
    classLevel,
    academicYear: year,
    status: "ENROLLED",
    previousBalance,
    parentName: `Parent de ${firstName} ${lastName}`,
    parentPhone: phone || "+237 690 00 00 00",
    feePlan: {
      id: `fp_imp_${rowIndex}_${Date.now()}`,
      label: `Scolarité ${classLevel} — ${year}`,
      installments: [
        { id: `ii_${rowIndex}_0`, label: "Tranche 1 — Inscription", amount: 100000, paid: 0, dueDate: "2026-09-15" },
        { id: `ii_${rowIndex}_1`, label: "Tranche 2 — 1er Trimestre", amount: 125000, paid: 0, dueDate: "2026-11-15" },
        { id: `ii_${rowIndex}_2`, label: "Tranche 3 — 2ème Trimestre", amount: 125000, paid: 0, dueDate: "2027-02-15" },
      ],
    },
  };
}

/**
 * Simulation de l'import batch côté backend : construit les élèves des lignes
 * valides, les insère dans la base en mémoire (visibles sur la page Élèves),
 * et renvoie le rapport final.
 */
export function submitImport(args: {
  file: ParsedFile;
  mapping: FieldMapping[];
  report: ValidationReport;
  ignoreErrors: boolean;
}): Promise<ImportResult> {
  const { file, mapping, report, ignoreErrors } = args;

  const blocked = report.total > report.valid && !ignoreErrors;

  return new Promise((resolve) => {
    setTimeout(() => {
      const oks = report.details.filter((d) => d.verdict === "ok");
      const created = blocked ? 0 : oks.length;
      let generated = 0;

      if (!blocked) {
        oks.forEach((d, i) => {
          const hasMatricule = extractCell(mapping, file.rows, "matricule", d.rowIndex) !== "";
          const matricule = hasMatricule
            ? extractCell(mapping, file.rows, "matricule", d.rowIndex)
            : `STE-26-${String(1024 + i).padStart(4, "0")}`;
          if (!hasMatricule) generated += 1;
          const student = buildStudent(file, mapping, d.rowIndex, matricule);
          addStudent(student);
        });
      }

      resolve({
        file,
        report,
        created,
        skipped: blocked ? report.total : report.total - oks.length,
        generatedMatricules: generated,
        aborted: blocked,
        createdAt: new Date().toISOString(),
      });
    }, 1400);
  });
}