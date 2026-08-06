"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export function FeaturesSchool() {
  const t = useTranslations("featuresSchool");

  const tabs = [
    {
      id: "collection",
      label: t("tab1Label"),
      title: t("tab1Title"),
      description: t("tab1Description"),
      highlights: t.raw("tab1Highlights") as string[],
      stat1: "100%",
      stat1Label: t("statRecovery"),
      stat2: "0 min",
      stat2Label: t("statFcfa"),
    },
    {
      id: "tresorerie",
      label: t("tab2Label"),
      title: t("tab2Title"),
      description: t("tab2Description"),
      highlights: t.raw("tab2Highlights") as string[],
      stat1: "98%",
      stat1Label: t("statRecovery"),
      stat2: "4,2M",
      stat2Label: t("statFcfa"),
    },
    {
      id: "credit",
      label: t("tab3Label"),
      title: t("tab3Title"),
      description: t("tab3Description"),
      highlights: t.raw("tab3Highlights") as string[],
      stat1: "+85%",
      stat1Label: t("statRecovery"),
      stat2: "100%",
      stat2Label: t("statFcfa"),
    },
    {
      id: "groupe",
      label: t("tab4Label"),
      title: t("tab4Title"),
      description: t("tab4Description"),
      highlights: t.raw("tab4Highlights") as string[],
      stat1: "4",
      stat1Label: t("statRecovery"),
      stat2: "1",
      stat2Label: t("statFcfa"),
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]!.id);
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]!;

  return (
    <section id="features-school" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
          {t("eyebrow")}
        </p>
        <h2 className="display-heading mt-4 text-center text-3xl text-encre sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mx-auto mt-16 max-w-3xl">
          {/* Horizontal tabs */}
          <div className="flex border-b border-fil/60">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 pb-3 pt-1 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-encre"
                      : "text-ardoise hover:text-encre"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emeraude" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content card */}
          <div className="mt-10 rounded-2xl bg-white p-8 ring-1 ring-inset ring-encre/[0.06] lg:p-10">
            <h3 className="text-xl font-semibold text-encre sm:text-2xl">
              {active.title}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ardoise">
              {active.description}
            </p>

            {/* Mini dashboard */}
            <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_140px]">
              <div className="rounded-xl bg-craie p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-ardoise">
                    {t("performanceLabel")}
                  </p>
                  <span className="rounded-md bg-emeraude/10 px-2 py-0.5 text-[10px] font-semibold text-emeraude">
                    +12%
                  </span>
                </div>
                <div className="flex items-end gap-1 h-20">
                  {[30, 45, 35, 70, 50, 85, 60, 75, 55, 90, 65, 80].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-emeraude/20"
                        style={{ height: `${h}%` }}
                      />
                    ),
                  )}
                </div>
                <div className="mt-3 flex gap-4 text-[10px] text-ardoise">
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Déc</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-1 flex-col justify-center rounded-xl bg-encre/[0.04] px-4">
                  <p className="stat-number text-xl text-encre">
                    {active.stat1}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-tight text-ardoise">
                    {active.stat1Label}
                  </p>
                </div>
                <div className="flex flex-1 flex-col justify-center rounded-xl bg-emeraude/[0.05] px-4">
                  <p className="stat-number text-xl text-emeraude">
                    {active.stat2}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-tight text-ardoise">
                    {active.stat2Label}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <ul className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {active.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-encre"
                >
                  <span className="mt-[9px] block h-px w-3 shrink-0 bg-encre/20" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
