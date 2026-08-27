import { Wallet, Home } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ReadOnlyArchiveBanner } from "@/components/layout/read-only-archive-banner";
import { ArchiveReadonlyPanel } from "@/components/shared/archive-readonly-panel";
import { CashierStation } from "@/features/cashier/components/cashier-station";
import { consultAcademicYear, isReadOnlyAcademicYear } from "@/lib/academic-year-guard";

interface CashierPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function CashierPage({ params, searchParams }: CashierPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);
  const readOnly = isReadOnlyAcademicYear(academicYear);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Guichet Caisse", icon: Home },
          { label: "Encaissement", icon: Wallet },
        ]}
        title="Guichet Caisse"
        subtitle="Encaissement au comptoir : espèces ou chèques, avec allocation automatique sur l'échéancier."
      />

      {readOnly ? (
        <>
          <ReadOnlyArchiveBanner year={academicYear} href={`/${schoolId}/cashier`} />
          <ArchiveReadonlyPanel
            year={academicYear}
            title="Encaissement désactivé sur une année clôturée"
            description="Les reçus de cette année sont archivés et définitifs. Passez sur l'année en cours pour reprendre la caisse."
          />
        </>
      ) : (
        <CashierStation schoolId={schoolId} />
      )}
    </div>
  );
}