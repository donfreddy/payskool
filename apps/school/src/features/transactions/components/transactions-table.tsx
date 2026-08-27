"use client";

import { Check, Receipt } from "lucide-react";
import Link from "next/link";

import { StudentAvatar } from "@/components/shared/student-avatar";
import { TxMethodBadge } from "@/components/shared/tx-method-badge";
import type { FakeStudent, FakeTx } from "@/core/mocks/fake-data";
import { formatCFA, formatFullDate, formatTime } from "@/lib/format";

export function TransactionsTable({
  txns,
  schoolId,
  students,
}: {
  txns: FakeTx[];
  schoolId: string;
  students: FakeStudent[];
}) {
  const genderOf = (id: string) => students.find((s) => s.id === id)?.gender ?? "M";
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Reçu</th>
              <th className="px-4 py-3 font-medium">Date &amp; heure</th>
              <th className="px-4 py-3 font-medium">Élève</th>
              <th className="px-4 py-3 font-medium">Mode</th>
              <th className="px-4 py-3 text-right font-medium">Montant</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr
                key={t.id}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-secondary/40"
                onClick={() => (window.location.href = `/${schoolId}/receipts?q=${encodeURIComponent(t.receipt.replace("#", ""))}`)}
              >
                <td className="whitespace-nowrap px-5 py-3 font-mono text-xs font-bold text-foreground">{t.receipt}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  <span className="font-mono text-xs">{formatFullDate(t.date.slice(0, 10))}</span>{" "}
                  <span className="font-mono text-xs">· {formatTime(t.date)}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="flex items-center gap-2.5">
                    <StudentAvatar
                      firstName={t.studentName.split(" ")[0] ?? "?"}
                      lastName={t.studentName.split(" ").slice(1).join(" ") || "?"}
                      gender={genderOf(t.studentId)}
                      className="size-7 text-[10px]"
                    />
                    <span>
                      <span className="block font-medium text-foreground">{t.studentName}</span>
                      <span className="block text-[11px] text-muted-foreground">{t.classLevel}</span>
                    </span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <TxMethodBadge method={t.method} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-sm font-bold text-foreground">
                  {formatCFA(t.amount)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-md bg-payskool-emerald/10 px-2 py-1 text-xs font-semibold text-payskool-emerald">
                    <Check className="size-3.5" /> Encaissé
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right">
                  <Link
                    href={`/${schoolId}/receipts?q=${encodeURIComponent(t.receipt.replace("#", ""))}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <Receipt className="size-3.5" /> Voir reçu
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {txns.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">
          Aucune opération ne correspond aux filtres.
        </p>
      )}
    </section>
  );
}