"use client";

import { Clock, Plug, Upload, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";

const steps = [
  { number: "1", icon: Plug },
  { number: "2", icon: Upload },
  { number: "3", icon: Wand2 },
];

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="py-20 sm:py-28">
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

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((step, i) => {
            const idx = i + 1;
            return (
              <div
                key={i}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Connecting dashed line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+4rem)] top-9 hidden h-[2px] w-[calc(100%-8rem)] lg:block">
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage: `repeating-linear-gradient(90deg, var(--color-fil) 0, var(--color-fil) 4px, transparent 4px, transparent 8px)`,
                      }}
                    />
                  </div>
                )}

                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-encre text-white shadow-lg shadow-encre/10 transition-transform group-hover:scale-105">
                  <step.icon className="h-6 w-6 text-emeraude" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emeraude text-[10px] font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-encre">
                  {t(`step${idx}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ardoise">
                  {t(`step${idx}Description`)}
                </p>
                <p className="mt-3 rounded-lg bg-craie border border-fil/50 px-3 py-2 text-[11px] text-ardoise">
                  {t(`step${idx}Detail`)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-emeraude/20 bg-emeraude/[0.05] px-6 py-4">
            <Clock className="h-5 w-5 text-emeraude" />
            <span className="text-sm font-semibold text-encre">
              {t("totalTimePrefix")}{" "}
              <span className="stat-number text-emeraude">{t("totalTimeValue")}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
