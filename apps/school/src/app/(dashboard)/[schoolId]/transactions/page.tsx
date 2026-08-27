import { ArrowRightLeft, Calculator } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { TransactionLedger } from "@/features/transactions/components/transaction-ledger";

interface TransactionsPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function TransactionsPage({ params }: TransactionsPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: Calculator },
          { label: "Encaissements", icon: ArrowRightLeft },
        ]}
        title="Journal des encaissements"
        subtitle="Toutes les rentrées d'argent : espèces, chèques et mobile money, avec export CSV et accès direct au reçu."
      />

      <TransactionLedger schoolId={schoolId} />
    </div>
  );
}