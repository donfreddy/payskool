"use client";

import { useTranslations } from "next-intl";
import { Building2, ShieldCheck, Check, X } from "lucide-react";

export function Comparison() {
  const t = useTranslations("comparison");

  return (
    <section className="bg-craie py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-flex items-center rounded-full border border-emeraude/20 bg-emeraude/[0.06] px-3 py-1 text-xs font-medium text-emeraude mb-4">
            {t("eyebrow")}
          </span>
          <h2 className="display-heading text-3xl text-encre sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-ardoise">
            {t("subtitle")}
          </p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-encre/5 border border-fil">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-fil">
            
            {/* Column Headers */}
            <div className="hidden md:block p-8 bg-craie/30"></div>
            <div className="p-8 text-center bg-craie/30">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-encre/5 rounded-xl">
                  <Building2 className="w-6 h-6 text-ardoise" />
                </div>
              </div>
              <h3 className="font-semibold text-encre text-lg">{t("col1Title")}</h3>
            </div>
            <div className="p-8 text-center bg-emeraude/5 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-emeraude"></div>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-emeraude/10 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-emeraude" />
                </div>
              </div>
              <h3 className="font-semibold text-encre text-lg">{t("col2Title")}</h3>
            </div>

            {/* Row 1: Visibility */}
            <div className="p-6 md:p-8 flex items-center bg-white border-t border-fil">
              <span className="font-medium text-encre">{t("row1Label")}</span>
            </div>
            <div className="p-6 md:p-8 bg-white border-t border-fil md:border-t-0 flex items-start gap-3">
              <X className="w-5 h-5 text-ambre shrink-0 mt-0.5" />
              <p className="text-sm text-ardoise leading-relaxed">{t("row1Col1")}</p>
            </div>
            <div className="p-6 md:p-8 bg-emeraude/[0.02] border-t border-fil md:border-t-0 flex items-start gap-3">
              <Check className="w-5 h-5 text-emeraude shrink-0 mt-0.5" />
              <p className="text-sm text-encre font-medium leading-relaxed">{t("row1Col2")}</p>
            </div>

            {/* Row 2: Security */}
            <div className="p-6 md:p-8 flex items-center bg-white border-t border-fil">
              <span className="font-medium text-encre">{t("row2Label")}</span>
            </div>
            <div className="p-6 md:p-8 bg-white border-t border-fil flex items-start gap-3">
              <X className="w-5 h-5 text-ambre shrink-0 mt-0.5" />
              <p className="text-sm text-ardoise leading-relaxed">{t("row2Col1")}</p>
            </div>
            <div className="p-6 md:p-8 bg-emeraude/[0.02] border-t border-fil flex items-start gap-3">
              <Check className="w-5 h-5 text-emeraude shrink-0 mt-0.5" />
              <p className="text-sm text-encre font-medium leading-relaxed">{t("row2Col2")}</p>
            </div>

            {/* Row 3: Financing */}
            <div className="p-6 md:p-8 flex items-center bg-white border-t border-fil">
              <span className="font-medium text-encre">{t("row3Label")}</span>
            </div>
            <div className="p-6 md:p-8 bg-white border-t border-fil flex items-start gap-3">
              <X className="w-5 h-5 text-ambre shrink-0 mt-0.5" />
              <p className="text-sm text-ardoise leading-relaxed">{t("row3Col1")}</p>
            </div>
            <div className="p-6 md:p-8 bg-emeraude/[0.02] border-t border-fil flex items-start gap-3">
              <Check className="w-5 h-5 text-emeraude shrink-0 mt-0.5" />
              <p className="text-sm text-encre font-medium leading-relaxed">{t("row3Col2")}</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
