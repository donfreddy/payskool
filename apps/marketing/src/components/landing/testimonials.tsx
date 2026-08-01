"use client";

import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

export function Testimonials() {
  const t = useTranslations("testimonials");

  const testimonials = [
    {
      quote: t("t1Quote"),
      name: t("t1Name"),
      role: t("t1Role"),
      school: t("t1School"),
      city: t("t1City"),
      stat: t("t1Stat"),
      statLabel: t("t1StatLabel"),
      initials: "PT",
    },
    {
      quote: t("t2Quote"),
      name: t("t2Name"),
      role: t("t2Role"),
      school: t("t2School"),
      city: t("t2City"),
      stat: t("t2Stat"),
      statLabel: t("t2StatLabel"),
      initials: "AD",
    },
    {
      quote: t("t3Quote"),
      name: t("t3Name"),
      role: t("t3Role"),
      school: t("t3School"),
      city: t("t3City"),
      stat: t("t3Stat"),
      statLabel: t("t3StatLabel"),
      initials: "JK",
    },
  ];

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

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {testimonials.map((tItem) => (
            <div
              key={tItem.name}
              className="relative flex flex-col rounded-2xl border border-fil bg-white p-6 sm:p-8 transition-all hover:shadow-lg hover:shadow-encre/[0.03]"
            >
              <Quote className="h-7 w-7 text-emeraude/20" />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ardoise">
                &ldquo;{tItem.quote}&rdquo;
              </blockquote>

              <div className="mt-6 pt-5 border-t border-fil">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-encre/[0.05] text-sm font-semibold text-encre">
                    {tItem.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-encre">
                      {tItem.name}
                    </p>
                    <p className="text-xs text-ardoise">
                      {tItem.role} — {tItem.school}
                    </p>
                    <p className="text-xs text-ardoise">{tItem.city}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-emeraude/[0.05] p-4 text-center">
                <p className="stat-number text-2xl text-emeraude">
                  {tItem.stat}
                </p>
                <p className="text-[11px] text-ardoise mt-0.5">
                  {tItem.statLabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
