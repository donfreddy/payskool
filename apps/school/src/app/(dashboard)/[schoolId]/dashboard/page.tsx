import { FAKE_LIVE_FEED, FAKE_USER } from "@/core/mocks/fake-data";
import { Home, Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@payskool/ui/components/ui/button";
import { MetricsGrid } from "@/components/smart/metrics";
import { PaymentsTable } from "@/components/smart/payment-table";
import { ChartsRow } from "@/components/smart/charts";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        breadcrumbs={[
          { label: "Vue d'ensemble", icon: Home }
        ]}
        greetingName={`M. ${FAKE_USER.name.split(" ")[0]!}`}
        subtitle="Voici ce qui se passe dans votre établissement aujourd'hui."
        actions={
          <>
            <Button variant="outline">
              <Download /> Exporter
            </Button>
            <Button variant="emerald">
              <Plus /> Nouveau règlement
            </Button>
          </>
        }
      />

      <MetricsGrid />

      <ChartsRow />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentsTable />
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
