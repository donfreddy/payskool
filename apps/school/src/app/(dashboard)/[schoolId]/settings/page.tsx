import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@payskool/ui/components/ui/card";
import { ArrowRight, CircleDollarSign, CreditCard, LifeBuoy, School, Settings, UserCog } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";

interface SettingsPageProps {
  params: Promise<{ schoolId: string }>;
}

const CARDS = [
  {
    href: "profile",
    icon: UserCog,
    title: "Profil",
    description: "Informations personnelles, langue de l’interface, mot de passe, 2FA et sessions actives.",
    roles: "Propriétaire · Administration · Caissier",
  },
  {
    href: "school",
    icon: School,
    title: "École",
    description: "Fiche de l’établissement, coordonnées, responsable et année académique en cours.",
    roles: "Propriétaire · Administration",
  },
  {
    href: "payment-providers",
    icon: CreditCard,
    title: "Intégrations Paiement",
    description: "Fournisseur d’encaissement (Wave, Flutterwave, Paystack…) : un seul actif à la fois.",
    roles: "Propriétaire",
  },
  {
    href: "billing",
    icon: CircleDollarSign,
    title: "Facturation Payskool",
    description: "Abonnement de l’école à la plateforme : plan, cycle, moyen de paiement et factures.",
    roles: "Propriétaire",
  },
  {
    href: "support",
    icon: LifeBuoy,
    title: "Aide & Support",
    description: "FAQ, canal prioritaire selon votre plan, contact WhatsApp/email et suivi de vos tickets.",
    roles: "Propriétaire · Administration · Caissier",
  },
];

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[{ label: "Paramètres", icon: Settings }]}
        title="Paramètres"
        subtitle="Gérez votre profil, votre établissement, le paiement en ligne et la facturation de la plateforme."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link key={c.href} href={`/${schoolId}/settings/${c.href}`}>
            <Card className="group transition-colors hover:border-payskool-emerald/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <c.icon className="size-4 text-payskool-emerald" />
                  {c.title}
                </CardTitle>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>{c.description}</CardDescription>
                <span className="mt-2 block text-[11px] text-muted-foreground">{c.roles}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}