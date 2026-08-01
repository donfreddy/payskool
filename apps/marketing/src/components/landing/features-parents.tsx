"use client";

import { SmartphoneNfc, Users, CreditCard, FileText, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturesParents() {
  const t = useTranslations("featuresParents");

  const cards = [
    {
      icon: SmartphoneNfc,
      title: t("card1Title"),
      description: t("card1Description"),
      color: "text-emeraude",
      bg: "bg-emeraude/[0.06]",
    },
    {
      icon: Users,
      title: t("card2Title"),
      description: t("card2Description"),
      color: "text-encre",
      bg: "bg-encre/[0.05]",
    },
    {
      icon: CreditCard,
      title: t("card3Title"),
      description: t("card3Description"),
      color: "text-[#FF6600]",
      bg: "bg-orange-50",
    },
    {
      icon: FileText,
      title: t("card4Title"),
      description: t("card4Description"),
      color: "text-emeraude",
      bg: "bg-emeraude/[0.06]",
    },
  ];

  const navItems = [
    t("navHome"),
    t("navReceipts"),
    t("navStudent"),
    t("navSupport"),
  ];

  return (
    <section id="features-parents" className="py-20 sm:py-28 bg-craie">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
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

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Phone mockup */}
          <div className="relative mx-auto w-full max-w-xs">
            <div className="rounded-[2.5rem] border-[3px] border-encre bg-white p-4 shadow-2xl shadow-encre/10">
              <div className="mx-auto mb-3 h-1 w-20 rounded-full bg-fil" />

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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-encre/[0.05] text-sm font-semibold text-encre">
                      YK
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-encre truncate">
                        {t("student1Name")}
                      </p>
                      <p className="text-[10px] text-ardoise">{t("student1Class")}</p>
                    </div>
                    <span className="rounded-md bg-ambre/10 px-2 py-0.5 text-[9px] font-semibold text-ambre">
                      {t("student1Status")}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between ledger-line pb-2">
                    <p className="text-[10px] text-ardoise">{t("student1Owed")}</p>
                    <p className="mono-data text-xs font-semibold text-encre">
                      {t("student1Amount")}
                    </p>
                  </div>
                </div>

                {/* Child 2 — up to date */}
                <div className="rounded-xl border border-fil p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emeraude/[0.06] text-sm font-semibold text-emeraude">
                      AK
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-encre truncate">
                        {t("student2Name")}
                      </p>
                      <p className="text-[10px] text-ardoise">{t("student2Class")}</p>
                    </div>
                    <span className="rounded-md bg-emeraude/10 px-2 py-0.5 text-[9px] font-semibold text-emeraude">
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

            {/* Payment provider badges */}
            <div className="absolute -right-4 top-14 flex flex-col gap-2">
              <div className="rounded-lg bg-[#FF6600] px-2.5 py-1 text-[9px] font-semibold text-white shadow-lg shadow-[#FF6600]/20">
                Orange
              </div>
              <div className="rounded-lg bg-[#FFCC00] px-2.5 py-1 text-[9px] font-semibold text-black shadow-lg shadow-[#FFCC00]/20">
                MTN
              </div>
              <div className="rounded-lg bg-[#1DC9CE] px-2.5 py-1 text-[9px] font-semibold text-white shadow-lg shadow-[#1DC9CE]/20">
                Wave
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.title}
                className="group rounded-2xl border border-fil bg-white p-5 transition-all hover:shadow-lg hover:shadow-encre/[0.04] hover:-translate-y-0.5"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}
                >
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <h4 className="text-sm font-semibold text-encre">
                  {card.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ardoise">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
