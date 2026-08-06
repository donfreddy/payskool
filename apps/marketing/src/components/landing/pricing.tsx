"use client";

import { Button } from "@payskool/ui";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function Pricing() {
  const t = useTranslations("pricing");
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: t("plan1Name"),
      description: t("plan1Description"),
      priceMonthly: "Gratuit",
      priceAnnual: "Gratuit",
      periodMonthly: t("plan1PeriodMonthly"),
      periodAnnual: t("plan1PeriodAnnual"),
      features: t.raw("plan1Features") as string[],
      excluded: t.raw("plan1Excluded") as string[],
      cta: t("plan1Cta"),
      highlighted: false,
    },
    {
      name: t("plan2Name"),
      description: t("plan2Description"),
      priceMonthly: "25 000",
      priceAnnual: "290 000",
      currency: "FCFA",
      periodMonthly: t("plan2PeriodMonthly"),
      periodAnnual: t("plan2PeriodAnnual"),
      features: t.raw("plan2Features") as string[],
      excluded: [],
      cta: t("plan2Cta"),
      highlighted: true,
      badge: t("plan2Badge"),
    },
    {
      name: t("plan3Name"),
      description: t("plan3Description"),
      priceMonthly: "Sur devis",
      priceAnnual: "Sur devis",
      periodMonthly: "",
      periodAnnual: "",
      features: t.raw("plan3Features") as string[],
      excluded: [],
      cta: t("plan3Cta"),
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-craie">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
            {t("eyebrow")}
          </p>
          <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ardoise">
            {t("subtitle")}
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setAnnual(false)}
            className={`text-sm font-medium transition-colors ${!annual ? "text-encre" : "text-ardoise"
              }`}
          >
            {t("monthly")}
          </button>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${annual ? "bg-emeraude" : "bg-fil"
              }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${annual ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`text-sm font-medium transition-colors ${annual ? "text-encre" : "text-ardoise"
              }`}
          >
            {t("annual")}
            <span className="ml-1.5 rounded-full bg-emeraude/10 px-2 py-0.5 text-[10px] font-semibold text-emeraude">
              {t("annualDiscount")}
            </span>
          </button>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 transition-all ${plan.highlighted
                  ? "border-emeraude shadow-xl shadow-emeraude/6 lg:scale-105"
                  : "border-fil hover:shadow-lg hover:shadow-encre/3"
                }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emeraude px-4 py-1 text-[11px] font-semibold text-white shadow-lg shadow-emeraude/20">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-encre">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-ardoise">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="stat-number text-4xl text-encre">
                    {annual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  {plan.periodMonthly && (
                    <span className="text-sm text-ardoise">
                      {" "}
                      {annual ? plan.periodAnnual : plan.periodMonthly}
                    </span>
                  )}
                </div>
                {"currency" in plan && (
                  <p className="mt-0.5 text-xs text-ardoise">
                    {plan.currency}
                  </p>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-encre"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emeraude" />
                    {feature}
                  </li>
                ))}
                {plan.excluded.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-fil line-through"
                  >
                    <span className="mt-0.5 block h-4 w-4 shrink-0 rounded-full border border-fil" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => { }}
                size="default" variant={plan.highlighted ? "emerald" : "outline"}
                className="py-5">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
