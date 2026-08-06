"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const COMPARISON_COUNT = 3;

export function BeforeAfter() {
  const t = useTranslations("beforeAfter");

  return (
    <section className="py-24 sm:py-32 bg-craie">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
          {t("beforeEyebrow")}
        </p>
        <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
          {t("beforeTitle")}
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ardoise">
          {t("beforeSubtitle")}
        </p>

        <div className="mt-14">
          {Array.from({ length: COMPARISON_COUNT }).map((_, i) => (
            <div
              key={i}
              className="grid gap-4 border-b border-fil/60 py-6 first:pt-0 last:border-b-0 sm:grid-cols-2 sm:gap-10"
            >
              <p className="text-[15px] leading-relaxed text-ardoise">
                {t(`comparisons.${i}.before`)}
              </p>
              <p className="text-[15px] leading-relaxed font-medium text-encre">
                {t(`comparisons.${i}.after`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <a
            href="#cta"
            className="inline-flex items-center gap-2 text-sm font-medium text-emeraude transition-colors hover:text-emeraude/80"
          >
            {t("afterCta")}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
