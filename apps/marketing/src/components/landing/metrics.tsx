import { Shield, Smartphone, Zap } from "lucide-react";

const metrics = [
  {
    number: "98%",
    label: "de taux de recouvrement des tranches à temps",
    icon: TrendingUpIcon,
  },
  {
    number: "0",
    unit: " minute",
    label: "de saisie manuelle. Les paiements sont confirmés en temps réel.",
    icon: Zap,
  },
  {
    number: "100%",
    label: "de traçabilité anti-fraude sur les encaissements caisse",
    icon: Shield,
  },
  {
    number: "3",
    unit: " clics",
    label: "pour un parent, de la réception de la relance au paiement terminé",
    icon: Smartphone,
  },
];

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function Metrics() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-payskool-emerald">
          Des résultats concrets
        </p>

        <div className="mt-10 grid gap-0.5 sm:gap-1 grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-3 rounded-2xl p-6 sm:p-8 transition-colors hover:bg-slate-50 ${
                i === 1 ? "bg-slate-50" : ""
              }`}
            >
              <metric.icon className="h-5 w-5 text-payskool-emerald/60" />
              <div className="text-center">
                <div className="stat-number text-5xl text-payskool-navy sm:text-6xl">
                  {metric.number}
                  {metric.unit && (
                    <span className="font-sans text-lg font-normal text-payskool-muted">
                      {metric.unit}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-snug text-payskool-muted max-w-[10rem] mx-auto">
                  {metric.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
