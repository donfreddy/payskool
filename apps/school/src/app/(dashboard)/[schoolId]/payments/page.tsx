import { Calculator, Inbox } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ReadOnlyArchiveBanner } from "@/components/layout/read-only-archive-banner";
import { ArchiveReadonlyPanel } from "@/components/shared/archive-readonly-panel";
import { OnlinePaymentsBoard } from "@/features/payments/components/online-payments-board";
import { consultAcademicYear, isReadOnlyAcademicYear } from "@/lib/academic-year-guard";

interface OnlinePaymentsPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function OnlinePaymentsPage({ params, searchParams }: OnlinePaymentsPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);
  const readOnly = isReadOnlyAcademicYear(academicYear);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Finance", icon: Calculator },
          { label: "Paiements en ligne", icon: Inbox },
        ]}
        title="Paiements en ligne"
        subtitle="Les règlements Mobile Money & Wave des parents arrivent par webhook déjà validés par le PSP : l'école reçoit le reçu et le mouvement comptable automatiquement."
      />

      {readOnly && <ReadOnlyArchiveBanner year={academicYear} href={`/${schoolId}/payments`} />}

      {readOnly ? (
        <ArchiveReadonlyPanel
          year={academicYear}
          title="Paiements en ligne indisponibles sur les archives"
          description="Le flux webhook des paiements arrive en temps réel sur l’année en cours. Consultez plutôt le journal des encaissements et le registre des reçus de cette année."
        />
      ) : (
        <OnlinePaymentsBoard schoolId={schoolId} />
      )}
    </div>
  );
}