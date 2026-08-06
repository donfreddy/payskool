"use client";

import { useTranslations } from "next-intl";

export function Testimonials() {
  const t = useTranslations("testimonials");

  const hero = {
    stat: t("t1Stat"),
    statLabel: t("t1StatLabel"),
    quote: t("t1Quote"),
    name: t("t1Name"),
    role: t("t1Role"),
    school: t("t1School"),
    city: t("t1City"),
  };

  const secondary = [
    {
      stat: t("t2Stat"),
      statLabel: t("t2StatLabel"),
      quote: t("t2Quote"),
      name: t("t2Name"),
      role: t("t2Role"),
      school: t("t2School"),
    },
    {
      stat: t("t3Stat"),
      statLabel: t("t3StatLabel"),
      quote: t("t3Quote"),
      name: t("t3Name"),
      role: t("t3Role"),
      school: t("t3School"),
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-craie">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="display-heading text-center text-3xl text-encre sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mx-auto mt-16 max-w-4xl">
          {/* Hero testimonial */}
          <div className="rounded-2xl bg-white p-8 ring-1 ring-inset ring-encre/[0.06] sm:p-12">
            <p className="display-heading text-5xl text-emeraude sm:text-6xl">
              {hero.stat}
            </p>
            <p className="mt-2 text-sm font-medium text-ardoise">
              {hero.statLabel}
            </p>
            <blockquote className="mt-8 max-w-2xl text-[17px] leading-relaxed text-encre">
              &ldquo;{hero.quote}&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <span className="block h-px w-8 bg-encre/15" />
              <p className="text-sm font-semibold text-encre">
                {hero.name}
              </p>
              <span className="text-ardoise/40">·</span>
              <p className="text-sm text-ardoise">
                {hero.role} — {hero.school}
              </p>
              <span className="text-ardoise/40">·</span>
              <p className="text-sm text-ardoise">{hero.city}</p>
            </div>
          </div>

          {/* Secondary testimonials */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {secondary.map((tItem) => (
              <div
                key={tItem.name}
                className="rounded-2xl bg-white p-6 ring-1 ring-inset ring-encre/[0.06] sm:p-8"
              >
                <p className="stat-number text-2xl text-emeraude">
                  {tItem.stat}
                </p>
                <p className="mt-1 text-xs font-medium text-ardoise">
                  {tItem.statLabel}
                </p>
                <blockquote className="mt-5 text-sm leading-relaxed text-encre">
                  &ldquo;{tItem.quote}&rdquo;
                </blockquote>
                <div className="mt-5 flex items-center gap-2">
                  <span className="block h-px w-5 bg-encre/15" />
                  <p className="text-sm font-semibold text-encre">
                    {tItem.name}
                  </p>
                  <span className="text-ardoise/40">·</span>
                  <p className="text-sm text-ardoise">
                    {tItem.role}, {tItem.school}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
