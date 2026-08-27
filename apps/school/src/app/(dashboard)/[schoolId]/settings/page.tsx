import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@payskool/ui/components/ui/card";
import { ArrowRight, School, Settings, UserCog } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";

interface SettingsPageProps {
  params: Promise<{ schoolId: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { schoolId } = await params;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[{ label: "Paramètres", icon: Settings }]}
        title="Paramètres"
        subtitle="Gérez votre profil personnel et la fiche de votre établissement."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href={`/${schoolId}/settings/profile`}>
          <Card className="group transition-colors hover:border-payskool-emerald/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCog className="size-4 text-payskool-emerald" />
                Profil
              </CardTitle>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription>
                Informations personnelles, langue de l’interface, mot de passe, 2FA et sessions actives.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/${schoolId}/settings/school`}>
          <Card className="group transition-colors hover:border-payskool-emerald/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <School className="size-4 text-payskool-emerald" />
                École
              </CardTitle>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription>
                Fiche de l’établissement, coordonnées, responsable et année académique en cours.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}