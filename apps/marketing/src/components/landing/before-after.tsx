"use client";

import { ArrowRight, Ban, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

const COMPARISON_COUNT = 3;

export function BeforeAfter() {
  const t = useTranslations("beforeAfter");

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Before */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ambre">
              {t("beforeEyebrow")}
            </p>
            <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
              {t("beforeTitle")}
            </h2>
            <p className="mt-4 text-ardoise">
              {t("beforeSubtitle")}
            </p>
            <ul className="mt-8 space-y-3">
              {Array.from({ length: COMPARISON_COUNT }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-ambre/15 bg-ambre/[0.03] p-4"
                >
                  <Ban className="mt-0.5 h-4 w-4 shrink-0 text-ambre/50" />
                  <span className="text-sm text-ardoise">
                    {t(`comparisons.${i}.before`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
              {t("afterEyebrow")}
            </p>
            <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
              {t("afterTitle")}
            </h2>
            <p className="mt-4 text-ardoise">
              {t("afterSubtitle")}
            </p>
            <ul className="mt-8 space-y-3">
              {Array.from({ length: COMPARISON_COUNT }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-emeraude/20 bg-emeraude/[0.03] p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emeraude" />
                  <span className="text-sm font-medium text-encre">
                    {t(`comparisons.${i}.after`)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href="#cta"
                className="inline-flex items-center gap-2 rounded-xl bg-emeraude px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emeraude/90"
              >
                {t("afterCta")}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
