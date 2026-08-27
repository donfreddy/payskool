import type {
  FieldMapping,
  ParsedFile,
  RowResult,
  TargetField,
  ValidationReport,
} from "@/features/students/import/types";

/** Normalise : minuscules, sans accents, espaces uniques. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’"`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const SYNONYMS: Record<Exclude<TargetField, "IGNORE">, string[]> = {
  matricule: ["matricule", "num matricule", "numero matricule", "n matricule", "numero", "code eleve", "identifiant"],
  last_name: ["nom", "nom de famille", "nom famille", "surname", "lastname", "last name"],
  first_name: ["prenom", "prnom", "pnom", "firstname", "first name", "prenoms"],
  class_level: ["classe", "niveau", "class", "level", "section"],
  gender: ["sexe", "genre", "gender"],
  date_of_birth: ["date de naissance", "naissance", "date naissance", "dob", "birthdate"],
  previous_balance: ["montant paye", "montant payé", "paye", "payé", "montant", "solde", "deja paye", "balance"],
  parent_phone: ["telephone parent", "tel parent", "telephone", "tel", "phone", "contact", "mobile parent"],
  academic_year: ["annee scolaire", "annee", "academic year", "session"],
};

type Mappable = Exclude<TargetField, "IGNORE">;

const MATCH_ORDER: Mappable[] = [
  "matricule",
  "date_of_birth",
  "parent_phone",
  "academic_year",
  "last_name",
  "first_name",
  "class_level",
  "gender",
  "previous_balance",
];

function detectField(header: string): TargetField {
  const key = norm(header);
  const lowered = key.replace(/-/g, " ");
  for (const field of MATCH_ORDER) {
    if (SYNONYMS[field].some((s) => lowered.includes(s))) return field;
  }
  return "IGNORE";
}

export function parseCSV(text: string): { delimiter: string; rows: string[][] } {
  const clean = text.replace(/^\uFEFF/, "").replace(/\r/g, "");
  const firstLine = clean.split("\n")[0] ?? "";
  const semis = (firstLine.match(/;/g) ?? []).length;
  const commas = (firstLine.match(/,/g) ?? []).length;
  const delimiter = semis >= commas && semis > 0 ? ";" : ",";

  const lines = clean.split("\n");
  const rows = lines
    .filter((line) => line.trim().length > 0)
    .map((line) =>
      line.split(delimiter).map((cell) => cell.trim().replace(/^"|"$/g, "")),
    );
  return { delimiter, rows };
}

export function buildParsedFile(
  name: string,
  sizeBytes: number,
  text: string,
): ParsedFile {
  const { delimiter, rows } = parseCSV(text);
  const columns = (rows[0] ?? []).map((c, i) => (c || `Colonne ${i + 1}`));
  const dataRows = rows.slice(1).filter((r) => r.some((c) => c.trim() !== ""));
  return {
    name,
    sizeLabel: `${(sizeBytes / 1024).toFixed(1)} Ko`,
    delimiter,
    columns,
    rows: dataRows,
    rowCount: dataRows.length,
  };
}

export function autoDetectMapping(file: ParsedFile): FieldMapping[] {
  return file.columns.map((column) => {
    const target = detectField(column);
    const colIndex = file.columns.indexOf(column);
    const sample =
      file.rows.find((r, _idx) => colIndex < r.length && r[colIndex]?.trim())?.[colIndex] ?? "";
    return { column, target, sample, auto: target !== "IGNORE" };
  });
}

const toNumber = (cell: string): number | null => {
  const digits = cell.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : null;
};

/** Extraction d'un champ de ligne mappée. */
export function extractCell(mapping: FieldMapping[], rows: string[][], target: TargetField, rowIndex: number): string {
  const m = mapping.find((x) => x.target === target);
  if (!m) return "";
  const colIndex = mapping.indexOf(m);
  return rows[rowIndex]?.[colIndex]?.trim() ?? "";
}

export function validateRows(mapping: FieldMapping[], file: ParsedFile): ValidationReport {
  const details: RowResult[] = [];
  const seenMatricules = new Map<string, number>();

  const has = (target: TargetField) => mapping.some((m) => m.target === target);

  file.rows.forEach((row, index) => {
    const colIndex = (target: TargetField) => {
      const m = mapping.find((x) => x.target === target);
      return m ? mapping.indexOf(m) : -1;
    };

    // Doublon par matricule (si le champ est mappé et renseigné)
    const matCol = colIndex("matricule");
    const matValue = matCol >= 0 ? row[matCol]?.trim() ?? "" : "";
    if (matValue) {
      const first = seenMatricules.get(matValue);
      if (first !== undefined) {
        details.push({ rowIndex: index, verdict: "duplicate", reason: `Matricule ${matValue} déjà présent (ligne ${first + 2})` });
        return;
      }
      seenMatricules.set(matValue, index);
    }

    const firstName = extractCell(mapping, file.rows, "first_name", index);
    const lastName = extractCell(mapping, file.rows, "last_name", index);
    const classLevel = extractCell(mapping, file.rows, "class_level", index);
    const balCol = colIndex("previous_balance");

    if (has("first_name") && has("last_name") && (!firstName || !lastName)) {
      details.push({ rowIndex: index, verdict: "missing-name", reason: !firstName && !lastName ? "Prénom et nom manquants" : !firstName ? "Prénom manquant" : "Nom manquant" });
      return;
    }
    if (!has("first_name") || !has("last_name")) {
      details.push({ rowIndex: index, verdict: "missing-name", reason: "Le mappage ne fournit pas de nom complet" });
      return;
    }
    if (!has("class_level") || !classLevel) {
      details.push({ rowIndex: index, verdict: "invalid-class", reason: !has("class_level") ? "Aucune colonne « Classe » mappée" : `Classe manquante ou vide (ligne ${index + 2})` });
      return;
    }
    if (balCol >= 0) {
      const raw = row[balCol] ?? "";
      if (raw.trim() && toNumber(raw) === null) {
        details.push({ rowIndex: index, verdict: "bad-amount", reason: `Montant invalide : « ${raw} »` });
        return;
      }
    }

    details.push({ rowIndex: index, verdict: "ok" });
  });

  const valid = details.filter((d) => d.verdict === "ok").length;
  const duplicates = details.filter((d) => d.verdict === "duplicate").length;
  const errors = details.length - valid - duplicates;

  return { total: details.length, valid, duplicates, errors, details };
}

/** Les champs obligatoires doivent être couverts par le mappage. */
export function requiredFieldsCovered(mapping: FieldMapping[]): boolean {
  const targeted = new Set(mapping.map((m) => m.target));
  return targeted.has("first_name") && targeted.has("last_name") && targeted.has("class_level");
}

export function missingRequired(mapping: FieldMapping[]): string[] {
  const targeted = new Set(mapping.map((m) => m.target));
  const missing = ["first_name", "last_name", "class_level"].filter((f) => !targeted.has(f as TargetField));
  return missing.map((f) => (f === "first_name" ? "Prénom" : f === "last_name" ? "Nom" : "Classe"));
}