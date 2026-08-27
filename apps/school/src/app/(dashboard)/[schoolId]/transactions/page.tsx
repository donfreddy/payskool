import { ArrowRightLeft, Calculator } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ReadOnlyArchiveBanner } from "@/components/layout/read-only-archive-banner";
import { TransactionLedger } from "@/features/transactions/components/transaction-ledger";
import { consultAcademicYear, isReadOnlyAcademicYear } from "@/lib/academic-year-guard";

interface TransactionsPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function TransactionsPage({ params, searchParams }: TransactionsPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);
  const readOnly = isReadOnlyAcademicYear(academicYear);

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

      {readOnly && <ReadOnlyArchiveBanner year={academicYear} href={`/${schoolId}/transactions`} />}

      <TransactionLedger schoolId={schoolId} year={academicYear} />
    </div>
  );
}