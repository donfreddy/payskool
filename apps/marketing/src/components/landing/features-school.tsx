"use client";

import {
  BarChart3,
  Building2,
  FileSpreadsheet,
  Receipt,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function FeaturesSchool() {
  const t = useTranslations("featuresSchool");

  const tabs = [
    {
      id: "multi-etablissements",
      icon: Building2,
      label: t("tab1Label"),
      title: t("tab1Title"),
      description: t("tab1Description"),
      highlights: t.raw("tab1Highlights") as string[],
    },
    {
      id: "caisse-recus",
      icon: Receipt,
      label: t("tab2Label"),
      title: t("tab2Title"),
      description: t("tab2Description"),
      highlights: t.raw("tab2Highlights") as string[],
    },
    {
      id: "import-excel",
      icon: FileSpreadsheet,
      label: t("tab3Label"),
      title: t("tab3Title"),
      description: t("tab3Description"),
      highlights: t.raw("tab3Highlights") as string[],
    },
    {
      id: "tresorerie",
      icon: BarChart3,
      label: t("tab4Label"),
      title: t("tab4Title"),
      description: t("tab4Description"),
      highlights: t.raw("tab4Highlights") as string[],
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]!.id);
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]!;

  return (
    <section id="features-school" className="py-20 sm:py-28">
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

        <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
          {/* Tabs */}
          <div className="flex shrink-0 gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all flex-shrink-0 lg:w-full ${
                    isActive
                      ? "bg-encre text-white shadow-lg shadow-encre/10"
                      : "text-ardoise hover:bg-encre/[0.04] hover:text-encre"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${isActive ? "text-emeraude" : ""}`}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="rounded-2xl border border-fil bg-white p-8 lg:p-10">
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-semibold text-encre">
                {active.title}
              </h3>
              <p className="text-ardoise leading-relaxed">
                {active.description}
              </p>

              <ul className="grid gap-3 sm:grid-cols-2">
                {active.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-encre"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emeraude/10">
                      <svg
                        className="h-2.5 w-2.5 text-emeraude"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Mini dashboard preview */}
              <div className="mt-2 grid grid-cols-3 gap-3">
                <div className="col-span-2 rounded-xl bg-craie p-5 border border-fil/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-medium text-ardoise uppercase tracking-wider">
                      {t("performanceLabel")}
                    </p>
                    <span className="rounded-md bg-emeraude/10 px-2 py-0.5 text-[10px] font-semibold text-emeraude">
                      +12%
                    </span>
                  </div>
                  <div className="flex items-end gap-[3px] h-20">
                    {[30, 45, 35, 70, 50, 85, 60, 75, 55, 90, 65, 80].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm bg-emeraude/20"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                  <div className="mt-3 flex gap-4 text-[10px] text-ardoise">
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Déc</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex-1 rounded-xl bg-encre/[0.04] p-4 flex flex-col justify-center">
                    <p className="stat-number text-xl text-encre">
                      98%
                    </p>
                    <p className="text-[10px] text-ardoise mt-0.5">
                      {t("statRecovery")}
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl bg-emeraude/[0.05] p-4 flex flex-col justify-center">
                    <p className="stat-number text-xl text-emeraude">
                      4,2M
                    </p>
                    <p className="text-[10px] text-ardoise mt-0.5">
                      {t("statFcfa")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
