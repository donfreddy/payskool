export type TargetField =
  | "IGNORE"
  | "first_name"
  | "last_name"
  | "matricule"
  | "class_level"
  | "gender"
  | "date_of_birth"
  | "previous_balance"
  | "parent_phone"
  | "academic_year";

export const TARGET_OPTIONS: { value: TargetField; label: string; required?: boolean }[] = [
  { value: "first_name", label: "Prénom", required: true },
  { value: "last_name", label: "Nom", required: true },
  { value: "class_level", label: "Classe", required: true },
  { value: "matricule", label: "Matricule" },
  { value: "gender", label: "Sexe" },
  { value: "date_of_birth", label: "Date de naissance" },
  { value: "previous_balance", label: "Montant déjà payé" },
  { value: "parent_phone", label: "Téléphone parent" },
  { value: "academic_year", label: "Année scolaire" },
  { value: "IGNORE", label: "Ne pas importer" },
];

export interface ParsedFile {
  name: string;
  sizeLabel: string;
  delimiter: string;
  columns: string[];
  rows: string[][];
  rowCount: number;
}

export interface FieldMapping {
  column: string;
  target: TargetField;
  sample: string;
  auto: boolean;
}

export type RowVerdict = "ok" | "duplicate" | "missing-name" | "invalid-class" | "bad-amount";

export interface RowResult {
  rowIndex: number; // index dans rows (0-based)
  verdict: RowVerdict;
  reason?: string;
}

export interface ValidationReport {
  total: number;
  valid: number;
  duplicates: number;
  errors: number;
  details: RowResult[];
}

export interface ImportResult {
  file: ParsedFile;
  report: ValidationReport;
  created: number;
  skipped: number;
  generatedMatricules: number; // matricule créés automatiquement
  aborted: boolean; // import annulé car les erreurs ne sont pas ignorées
  createdAt: string;
}