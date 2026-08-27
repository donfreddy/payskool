import { CircleDollarSign, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { BillingBoard } from "@/features/settings/components/billing-board";

interface BillingPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Paramètres", icon: SlidersHorizontal },
          { label: "Facturation Payskool", icon: CircleDollarSign },
        ]}
        title="Facturation Payskool"
        subtitle="Votre abonnement à la plateforme : plan, cycle mensuel ou annuel, moyen de paiement et historique des factures."
      />

      <BillingBoard schoolId={schoolId} />
    </div>
  );
}