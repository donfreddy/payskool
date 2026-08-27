import { TxMethodBadge } from "@/components/shared/tx-method-badge";
import type { FakeReceipt } from "@/core/mocks/fake-data";
import { formatCFA } from "@/lib/format";

export function PaymentsTable({ receipts }: { receipts: FakeReceipt[] }) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-foreground">Derniers Encaissements</h2>
        <span className="rounded-md bg-muted/60 px-2 py-1 font-mono text-xs text-muted-foreground">
          {receipts.length} reçu{receipts.length > 1 ? "s" : ""} dans le registre
        </span>
      </div>

      {receipts.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          Aucun encaissement dans le registre de cette année.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Élève</th>
                <th className="px-4 py-3 font-medium">Classe</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Mode de Paiement</th>
                <th className="px-4 py-3 font-medium">Reçu</th>
              </tr>
            </thead>
            <tbody>
              {receipts.slice(0, 8).map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-foreground">{r.studentName}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">{r.classLevel}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-success">{formatCFA(r.amount)}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <TxMethodBadge method={r.method} className="px-2 py-1 text-xs" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">Reçu {r.number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}