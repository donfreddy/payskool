import { Button } from "@payskool/ui/components/ui/button";
import { Home, Download, Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ReadOnlyArchiveBanner } from "@/components/layout/read-only-archive-banner";
import { ChartsRow } from "@/components/smart/charts";
import { MetricsGrid } from "@/components/smart/metrics";
import { PaymentsTable } from "@/components/smart/payment-table";
import { FAKE_LIVE_FEED, FAKE_USER } from "@/core/mocks/fake-data";
import { listReceipts } from "@/features/receipts/api/receipts.mock";
import { globalCollection } from "@/features/reports/lib/statistics";
import { listStudents } from "@/features/students/api/students.mock";
import { consultAcademicYear, isReadOnlyAcademicYear } from "@/lib/academic-year-guard";

interface DashboardPageProps {
  params: Promise<{ schoolId: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function DashboardPage({ params, searchParams }: DashboardPageProps) {
  const [{ schoolId }, { year }] = await Promise.all([params, searchParams]);
  const academicYear = consultAcademicYear(year);
  const readOnly = isReadOnlyAcademicYear(academicYear);

  const [students, receipts] = await Promise.all([
    listStudents(schoolId, academicYear),
    listReceipts(schoolId, academicYear),
  ]);
  const global = globalCollection(students);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[{ label: "Vue d'ensemble", icon: Home }]}
        greetingName={`M. ${FAKE_USER.name.split(" ")[0]!}`}
        subtitle={
          readOnly
            ? `Consultation des archives — vue d'ensemble de l'année scolaire ${academicYear}.`
            : "Voici ce qui se passe dans votre établissement aujourd'hui."
        }
        actions={
          readOnly ? undefined : (
            <>
              <Button variant="outline">
                <Download /> Exporter
              </Button>
              <Button variant="emerald">
                <Plus /> Nouveau règlement
              </Button>
            </>
          )
        }
      />

      {readOnly && <ReadOnlyArchiveBanner year={academicYear} href={`/${schoolId}/dashboard`} />}

      <MetricsGrid
        year={academicYear}
        readOnly={readOnly}
        collected={global.collected}
        totalDue={global.totalDue}
        recovery={global.recovery}
        receiptsCount={receipts.length}
        studentCount={students.length}
        uptoDate={global.uptoDate}
      />

      <ChartsRow year={academicYear} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentsTable receipts={receipts} />
        </div>
        <div>
          <section className="rounded-xl border border-border bg-card h-full">
            <div className="border-b border-border p-6">
              <h2 className="text-base font-semibold text-foreground">Activité Caisse en Direct</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {FAKE_LIVE_FEED.map((feed, index) => (
                  <div key={feed.id} className="relative pl-6">
                    {index !== FAKE_LIVE_FEED.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-24px] w-px bg-border" />
                    )}
                    <div className="absolute left-0 top-1.5 w-5 h-5 bg-payskool-emerald/10 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-payskool-emerald rounded-full" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {feed.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {feed.timeAgo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}