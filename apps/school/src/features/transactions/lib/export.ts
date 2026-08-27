import { TX_METHOD_LABELS } from "@/components/shared/tx-method-badge";
import type { FakeTx } from "@/core/mocks/fake-data";

const csvEscape = (value: string) => {
  const needsQuotes = /[;"\n]/.test(value);
  return needsQuotes ? `"${value.replace(/"/g, '""')}"` : value;
};

export function transactionsToCSV(txns: FakeTx[]): string {
  const header = ["N° reçu", "Date", "Élève", "Classe", "Mode de paiement", "Montant (FCFA)"];
  const lines = txns.map((t) =>
    [
      t.receipt.replace("#", ""),
      new Date(t.date).toISOString().slice(0, 10),
      t.studentName,
      t.classLevel,
      TX_METHOD_LABELS[t.method],
      String(t.amount),
    ]
      .map(csvEscape)
      .join(";"),
  );
  return [header.map(csvEscape).join(";"), ...lines].join("\n");
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv"): void {
  const blob = new Blob(["\uFEFF" + content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}