"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@payskool/ui/components/ui/tabs";

function ChartFrame({ height, children }: { height: number; children: React.ReactElement }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="w-full" style={{ height }}>
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="size-full animate-pulse rounded-lg bg-secondary" />
      )}
    </div>
  );
}

const monthly = [
  { mois: "Sep", encaisse: 8200, objectif: 9000 },
  { mois: "Oct", encaisse: 7400, objectif: 8000 },
  { mois: "Nov", encaisse: 6100, objectif: 6500 },
  { mois: "Déc", encaisse: 4800, objectif: 6000 },
  { mois: "Jan", encaisse: 9300, objectif: 8500 },
  { mois: "Fév", encaisse: 5600, objectif: 7000 },
  { mois: "Mar", encaisse: 3800, objectif: 6500 },
];

const tranches = [
  { name: "Tranche 1", value: 22400, color: "var(--color-success)" },
  { name: "Tranche 2", value: 14600, color: "var(--color-brand-cyan)" },
  { name: "Tranche 3", value: 8200, color: "var(--color-brand-orange)" },
  { name: "Impayés", value: 12800, color: "var(--color-warning)" },
];

const levels = [
  { niveau: "6ème", taux: 92 },
  { niveau: "5ème", taux: 88 },
  { niveau: "4ème", taux: 74 },
  { niveau: "3ème", taux: 81 },
  { niveau: "2nde", taux: 69 },
  { niveau: "1ère", taux: 77 },
  { niveau: "Tle", taux: 85 },
];

const paymentMix = [
  { mode: "Orange Money", value: 42, color: "var(--color-brand-orange)" },
  { mode: "MTN MoMo", value: 28, color: "var(--color-warning)" },
  { mode: "Wave", value: 18, color: "var(--color-brand-cyan)" },
  { mode: "Espèces", value: 12, color: "var(--color-muted-foreground)" },
];

const periodData: Record<string, { mois: string; encaisse: number; objectif: number }[]> = {
  "1m": [
    { mois: "Sem.1", encaisse: 2100, objectif: 2200 },
    { mois: "Sem.2", encaisse: 1950, objectif: 2000 },
    { mois: "Sem.3", encaisse: 2300, objectif: 2400 },
    { mois: "Sem.4", encaisse: 1800, objectif: 1900 },
  ],
  "3m": [
    { mois: "Jan", encaisse: 9300, objectif: 8500 },
    { mois: "Fév", encaisse: 5600, objectif: 7000 },
    { mois: "Mar", encaisse: 3800, objectif: 6500 },
  ],
  "6m": [
    { mois: "Oct", encaisse: 7400, objectif: 8000 },
    { mois: "Nov", encaisse: 6100, objectif: 6500 },
    { mois: "Déc", encaisse: 4800, objectif: 6000 },
    { mois: "Jan", encaisse: 9300, objectif: 8500 },
    { mois: "Fév", encaisse: 5600, objectif: 7000 },
    { mois: "Mar", encaisse: 3800, objectif: 6500 },
  ],
  "1a": [
    { mois: "Sep", encaisse: 8200, objectif: 9000 },
    { mois: "Oct", encaisse: 7400, objectif: 8000 },
    { mois: "Nov", encaisse: 6100, objectif: 6500 },
    { mois: "Déc", encaisse: 4800, objectif: 6000 },
    { mois: "Jan", encaisse: 9300, objectif: 8500 },
    { mois: "Fév", encaisse: 5600, objectif: 7000 },
    { mois: "Mar", encaisse: 3800, objectif: 6500 },
  ],
};

const paymentMixPeriod: Record<string, typeof paymentMix> = {
  week: [
    { mode: "Orange Money", value: 48, color: "var(--color-brand-orange)" },
    { mode: "MTN MoMo", value: 31, color: "var(--color-warning)" },
    { mode: "Wave", value: 15, color: "var(--color-brand-cyan)" },
    { mode: "Espèces", value: 6, color: "var(--color-muted-foreground)" },
  ],
  month: [
    { mode: "Orange Money", value: 42, color: "var(--color-brand-orange)" },
    { mode: "MTN MoMo", value: 28, color: "var(--color-warning)" },
    { mode: "Wave", value: 18, color: "var(--color-brand-cyan)" },
    { mode: "Espèces", value: 12, color: "var(--color-muted-foreground)" },
  ],
  year: [
    { mode: "Orange Money", value: 35, color: "var(--color-brand-orange)" },
    { mode: "MTN MoMo", value: 25, color: "var(--color-warning)" },
    { mode: "Wave", value: 20, color: "var(--color-brand-cyan)" },
    { mode: "Espèces", value: 20, color: "var(--color-muted-foreground)" },
  ],
};

function fmt(v: number) {
  return `${(v * 1000).toLocaleString("fr-FR")} FCFA`;
}

function ChartCard({
  title,
  subtitle,
  right,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card p-6 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  fontSize: 12,
  boxShadow: "0 8px 24px -12px oklch(0.2 0.04 265 / 0.35)",
} as const;

export function ChartsRow() {
  const [period, setPeriod] = useState("1a");
  const [mixPeriod, setMixPeriod] = useState("month");
  const chartData = periodData[period]!;
  const mixData = paymentMixPeriod[mixPeriod]!;

  return (
    <div className="grid gap-6 xl:grid-cols-10">
      <ChartCard
        className="xl:col-span-7"
        title="Encaissements mensuels"
        subtitle="Année scolaire 2026-2027 · en milliers de FCFA"
        right={
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="3m">3M</TabsTrigger>
              <TabsTrigger value="6m">6M</TabsTrigger>
              <TabsTrigger value="1a">1A</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        <ChartFrame height={260}>
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="ps-encaisse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="mois"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, n) => [fmt(v as number), n === "encaisse" ? "Encaissé" : "Objectif"]}
              />
              <Area
                type="monotone"
                dataKey="objectif"
                stroke="var(--color-muted-foreground)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                fill="none"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="encaisse"
                stroke="var(--color-success)"
                strokeWidth={2.5}
                fill="url(#ps-encaisse)"
                isAnimationActive={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--color-card)" }}
              />
            </AreaChart>
        </ChartFrame>
      </ChartCard>

      <ChartCard
        className="xl:col-span-3"
        title="Répartition par tranche"
        subtitle="Total attendu : 58.000.000 FCFA"
      >
        <ChartFrame height={200}>
            <PieChart>
              <Pie
                data={tranches}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                isAnimationActive={false}
                stroke="var(--color-card)"
                strokeWidth={2}
              >
                {tranches.map((t) => (
                  <Cell key={t.name} fill={t.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => fmt(v as number)} />
            </PieChart>
        </ChartFrame>
        <ul className="mt-4 space-y-2">
          {tranches.map((t) => (
            <li key={t.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="size-2 rounded-full" style={{ background: t.color }} />
                {t.name}
              </span>
              <span className="font-semibold text-foreground">{fmt(t.value)}</span>
            </li>
          ))}
        </ul>
      </ChartCard>

      <ChartCard
        className="xl:col-span-5"
        title="Modes de règlement"
        subtitle="Sur les encaissements"
        right={
          <Tabs value={mixPeriod} onValueChange={setMixPeriod}>
            <TabsList>
              <TabsTrigger value="week">Sem.</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
              <TabsTrigger value="year">Année</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      >
        <div className="grid grid-cols-[1fr_1.15fr] items-center gap-4">
          <div className="relative">
            <ChartFrame height={175}>
              <PieChart>
                <Pie
                  data={mixData}
                  dataKey="value"
                  nameKey="mode"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="62%"
                  outerRadius="88%"
                  paddingAngle={3}
                  cornerRadius={7}
                  strokeWidth={0}
                  isAnimationActive={false}
                >
                  {mixData.map((item) => (
                    <Cell key={item.mode} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartFrame>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-bold text-foreground">100%</span>
              <span className="text-[10px] text-muted-foreground">total reçu</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {mixData.map((item) => (
              <div key={item.mode} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs font-medium">
                  <span className="size-2 rounded-full" style={{ background: item.color }} />
                  {item.mode}
                </span>
                <span className="font-display text-sm font-bold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-payskool-emerald/10 px-4 py-3">
          <p className="text-xs font-semibold text-payskool-emerald">Votre taux de digitalisation est de 79 %</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Les règlements en ligne progressent de 8 % ce mois-ci.</p>
        </div>
      </ChartCard>

      <ChartCard
        className="xl:col-span-5"
        title="Taux de recouvrement par niveau"
        subtitle="Part des élèves à jour de leurs frais de scolarité"
      >
        <ChartFrame height={220}>
            <BarChart data={levels} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="niveau"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                cursor={{ fill: "var(--color-secondary)" }}
                contentStyle={tooltipStyle}
                formatter={(v) => [`${v}%`, "Recouvrement"]}
              />
              <Bar dataKey="taux" radius={[6, 6, 0, 0]} maxBarSize={44} isAnimationActive={false}>
                {levels.map((l) => (
                  <Cell
                    key={l.niveau}
                    fill={l.taux >= 80 ? "var(--color-success)" : "var(--color-warning)"}
                  />
                ))}
              </Bar>
            </BarChart>
        </ChartFrame>
      </ChartCard>
    </div>
  );
}