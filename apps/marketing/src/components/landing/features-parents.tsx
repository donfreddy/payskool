"use client";

import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturesParents() {
  const t = useTranslations("featuresParents");

  const features = [
    {
      title: t("card1Title"),
      description: t("card1Description"),
    },
    {
      title: t("card2Title"),
      description: t("card2Description"),
    },
    {
      title: t("card3Title"),
      description: t("card3Description"),
    },
    {
      title: t("card4Title"),
      description: t("card4Description"),
    },
  ];

  const navItems = [
    t("navHome"),
    t("navReceipts"),
    t("navStudent"),
    t("navSupport"),
  ];

  return (
    <section id="features-parents" className="py-24 sm:py-32 bg-craie">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
            {t("eyebrow")}
          </p>
          <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-ardoise">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[360px_1fr] lg:gap-24">
          {/* Phone mockup — realistic device frame */}
          <div className="relative mx-auto w-[272px]">
            {/* Outer device frame */}
            <div className="animate-float rounded-[3rem] bg-encre/90 p-[6px] shadow-2xl shadow-encre/[0.06]">
              {/* Inner screen */}
              <div className="overflow-hidden rounded-[2.5rem] bg-white">
                {/* Status bar + notch */}
                <div className="relative bg-white px-6 pb-1 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-encre">9:41</span>
                    <span className="flex items-center gap-0.5">
                      <span className="block h-3 w-4 rounded-sm border border-encre/60" />
                      <span className="block h-3 w-0.5 rounded-full bg-encre" />
                    </span>
                  </div>
                  {/* Notch */}
                  <div className="absolute left-1/2 top-0 h-6 w-[100px] -translate-x-1/2 rounded-b-2xl bg-encre" />
                </div>

                <div className="px-5 pb-5">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-encre">
                        {t("phoneGreeting")}
                      </p>
                      <p className="text-[10px] text-ardoise">
                        {t("phoneChildren")}
                      </p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emeraude/10">
                      <MessageCircle className="h-4 w-4 text-emeraude" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Child 1 — overdue */}
                    <div className="rounded-xl border border-fil p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-encre/[0.05] text-sm font-semibold text-encre">
                          YK
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-encre">
                            {t("student1Name")}
                          </p>
                          <p className="text-[10px] text-ardoise">{t("student1Class")}</p>
                        </div>
                        <span className="shrink-0 rounded-md bg-ambre/10 px-2 py-0.5 text-[9px] font-semibold text-ambre">
                          {t("student1Status")}
                        </span>
                      </div>
                      <div className="ledger-line mt-2 flex items-center justify-between pb-2">
                        <p className="text-[10px] text-ardoise">{t("student1Owed")}</p>
                        <p className="mono-data text-xs font-semibold text-encre">
                          {t("student1Amount")}
                        </p>
                      </div>
                    </div>

                    {/* Child 2 — up to date */}
                    <div className="rounded-xl border border-fil p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emeraude/[0.06] text-sm font-semibold text-emeraude">
                          AK
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-encre">
                            {t("student2Name")}
                          </p>
                          <p className="text-[10px] text-ardoise">{t("student2Class")}</p>
                        </div>
                        <span className="shrink-0 rounded-md bg-emeraude/10 px-2 py-0.5 text-[9px] font-semibold text-emeraude">
                          {t("student2Status")}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-[10px] text-ardoise">{t("student2Balance")}</p>
                        <p className="mono-data text-xs font-semibold text-emeraude">
                          {t("student2Amount")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom nav bar */}
                  <div className="mt-4 flex justify-between rounded-xl bg-craie p-2">
                    {navItems.map((item) => (
                      <div
                        key={item}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <div className="h-1 w-1 rounded-full bg-ardoise/40" />
                        <span className="text-[8px] text-ardoise/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-2">
                  <div className="h-1 w-28 rounded-full bg-encre/15" />
                </div>
              </div>
            </div>

            {/* Side button */}
            <div className="absolute right-0 top-24 h-10 w-[3px] translate-x-[6px] rounded-r-sm bg-encre/20" />

            {/* Payment provider badges */}
            <div className="absolute -right-3 top-16 flex flex-col gap-1.5">
              <div className="rounded-lg bg-[#FF6600] px-2.5 py-1 text-[9px] font-semibold text-white shadow-lg shadow-[#FF6600]/15">
                Orange
              </div>
              <div className="rounded-lg bg-[#FFCC00] px-2.5 py-1 text-[9px] font-semibold text-black shadow-lg shadow-[#FFCC00]/15">
                MTN
              </div>
              <div className="rounded-lg bg-[#1DC9CE] px-2.5 py-1 text-[9px] font-semibold text-white shadow-lg shadow-[#1DC9CE]/15">
                Wave
              </div>
            </div>
          </div>

          {/* Features — minimal annotations */}
          <div className="flex flex-col gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-emeraude/40" />
                <div>
                  <h4 className="text-sm font-semibold text-encre">
                    {feature.title}
                  </h4>
                  <p className="mt-1 max-w-sm text-sm leading-relaxed text-ardoise">
                    {feature.description}
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
