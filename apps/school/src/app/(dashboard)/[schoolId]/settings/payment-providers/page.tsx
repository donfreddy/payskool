import { CreditCard, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { PaymentProvidersBoard } from "@/features/settings/components/payment-providers-board";

interface PaymentProvidersPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function PaymentProvidersPage({ params }: PaymentProvidersPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Paramètres", icon: SlidersHorizontal },
          { label: "Intégrations Paiement", icon: CreditCard },
        ]}
        title="Intégrations Paiement"
        subtitle="Configurez le fournisseur d’encaissement supporté par la plateforme (Wave, Flutterwave, Paystack, PayUnit, CamPay, Marviance…). Un seul fournisseur actif à la fois."
      />

      <PaymentProvidersBoard schoolId={schoolId} />
    </div>
  );
}