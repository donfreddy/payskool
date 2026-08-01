import { Button, Badge, StatCard } from "@payskool/ui";
import { Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center p-24 bg-background text-foreground gap-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <Badge variant="paid" className="px-4 py-1 text-sm">
          UI Library Connected
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary">
          PAYSKOOL Marketing
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          This page demonstrates the successful integration of the @payskool/ui
          component library inside a Next.js v15 application using Tailwind CSS v4.
        </p>
        <div className="flex gap-4 mt-4">
          <Button size="lg" variant="emerald">
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Documentation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <StatCard
          title="Total Collected"
          value="45,000,000 FCFA"
          subtitle="School year 2026-2027"
          trend={{ value: 12.5, label: "vs last month" }}
          variant="success"
          icon={<Activity />}
        />
        <StatCard
          title="Pending Payments"
          value="12,500,000 FCFA"
          subtitle="Overdue > 30 days"
          trend={{ value: -2.4, label: "vs last month" }}
          variant="warning"
        />
        <StatCard
          title="Failed Transactions"
          value="45"
          subtitle="Last 7 days"
          trend={{ value: 5.2, label: "vs last week" }}
          variant="danger"
        />
      </div>
    </div>
  );
}
