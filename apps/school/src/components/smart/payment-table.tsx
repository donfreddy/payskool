import { Search, Receipt } from "lucide-react";
import { Input } from "@payskool/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@payskool/ui/components/ui/select";
import { cn } from "@payskool/ui/utils";

type Method = "orange" | "mtn" | "cash" | "wave";

const methodStyles: Record<Method, string> = {
  orange: "bg-brand-orange-soft text-brand-orange",
  mtn: "bg-warning-soft text-warning",
  cash: "bg-secondary text-muted-foreground",
  wave: "bg-brand-cyan-soft text-brand-cyan",
};

const rows: {
  name: string;
  classe: string;
  amount: string;
  method: Method;
  methodLabel: string;
  receipt: string;
}[] = [
  {
    name: "Marc K. Junior",
    classe: "6ème A",
    amount: "50.000 FCFA",
    method: "orange",
    methodLabel: "Orange Money",
    receipt: "#8921",
  },
  {
    name: "Sonia Talla",
    classe: "3ème B",
    amount: "35.000 FCFA",
    method: "mtn",
    methodLabel: "MTN MoMo",
    receipt: "#8920",
  },
  {
    name: "Erick Kouam",
    classe: "Terminale C",
    amount: "100.000 FCFA",
    method: "cash",
    methodLabel: "Espèces Guichet",
    receipt: "#8919",
  },
  {
    name: "Sarah Diop",
    classe: "4ème C",
    amount: "40.000 FCFA",
    method: "wave",
    methodLabel: "Wave",
    receipt: "#8918",
  },
];

export function PaymentsTable() {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-foreground">Derniers Encaissements</h2>
        <div className="flex flex-1 items-center gap-2 sm:max-w-sm">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher un élève..." className="h-9 rounded-lg pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-32.5 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="ok">Succès</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Élève</th>
              <th className="px-4 py-3 font-medium">Classe</th>
              <th className="px-4 py-3 font-medium">Montant</th>
              <th className="px-4 py-3 font-medium">Mode de Paiement</th>
              <th className="px-4 py-3 font-medium">Reçu</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.receipt} className="border-b border-border last:border-0 hover:bg-secondary/50">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-foreground">{r.name}</td>
                <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">{r.classe}</td>
                <td className="whitespace-nowrap px-4 py-4 font-semibold text-success">{r.amount}</td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                      methodStyles[r.method],
                    )}
                  >
                    {r.methodLabel}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">Reçu {r.receipt}</td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span className="inline-flex items-center rounded-md bg-success-soft px-2 py-1 text-xs font-semibold text-success">
                    SUCCÈS
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right">
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
                    <Receipt className="size-3.5" /> Voir Reçu
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}