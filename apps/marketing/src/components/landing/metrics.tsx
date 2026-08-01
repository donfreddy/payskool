"use client";

import { useTranslations } from "next-intl";

const metrics = [
  { number: "98", suffix: "%", labelKey: "item1Label" },
  { number: "0", suffixKey: "item2Unit", labelKey: "item2Label" },
  { number: "100", suffix: "%", labelKey: "item3Label" },
  { number: "3", suffixKey: "item4Unit", labelKey: "item4Label" },
] as const;

export function Metrics() {
  const t = useTranslations("metrics");

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-emeraude mb-12">
          {t("eyebrow")}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-2 px-6 py-8 ${
                i < metrics.length - 1
                  ? "lg:border-r lg:border-fil"
                  : ""
              } ${i < 2 ? "border-b border-fil lg:border-b-0" : ""}`}
            >
              <div className="text-center">
                <span className="stat-number text-5xl text-encre sm:text-6xl">
                  {metric.number}
                </span>
                <span className="text-lg font-normal text-ardoise">
                  {"suffixKey" in metric
                    ? t(metric.suffixKey)
                    : metric.suffix}
                </span>
              </div>
              <p className="mt-1 text-center text-sm leading-snug text-ardoise max-w-48">
                {t(metric.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
