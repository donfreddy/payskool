import { Wallet, Home } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { CashierStation } from "@/features/cashier/components/cashier-station";
import { requireCurrentAcademicYear } from "@/lib/academic-year-guard";

interface CashierPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function CashierPage({ params, searchParams }: CashierPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  requireCurrentAcademicYear(year, `/${schoolId}/cashier`);

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

      <CashierStation schoolId={schoolId} />
    </div>
  );
}