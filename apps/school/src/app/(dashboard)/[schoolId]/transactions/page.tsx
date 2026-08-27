import { ArrowRightLeft, Calculator } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { TransactionLedger } from "@/features/transactions/components/transaction-ledger";
import { consultAcademicYear } from "@/lib/academic-year-guard";

interface TransactionsPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function TransactionsPage({ params, searchParams }: TransactionsPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: Calculator },
          { label: "Encaissements", icon: ArrowRightLeft },
        ]}
        title="Journal des encaissements"
        subtitle={`Toutes les rentrées d'argent de l'année ${academicYear} : espèces, chèques et mobile money, avec export CSV et accès direct au reçu.`}
      />

      <TransactionLedger schoolId={schoolId} year={academicYear} />
    </div>
  );
}