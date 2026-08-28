"use client";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Home,
  MessageCircle,
  Receipt,
  ShieldCheck,
  Users,
} from "lucide-react";
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
    { key: "navHome", icon: Home, active: true },
    { key: "navStudents", icon: Users, active: false },
    { key: "navReceipts", icon: Receipt, active: false },
    { key: "navSupport", icon: MessageCircle, active: false },
  ];

  return (
    <section id="features-parents" className="bg-craie py-24 sm:py-32">
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
                  {/* App header — logo + student selector + notifications */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-emeraude" />
                      <span className="text-[11px] font-extrabold tracking-tight text-encre">
                        PAYS<span className="text-emeraude">KOOL</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1 rounded-full border border-fil bg-white px-2 py-1 shadow-sm">
                        <span className="max-w-20 truncate text-[9px] font-bold text-encre">
                          {t("studentName")}
                        </span>
                        <ChevronDown className="h-3 w-3 shrink-0 text-ardoise/60" />
                      </div>
                      <div className="relative p-1">
                        <Bell className="h-3.5 w-3.5 text-encre" />
                        <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full border border-white bg-red-500" />
                      </div>
                    </div>
                  </div>

                  {/* Greeting */}
                  <div className="mb-3">
                    <p className="text-[11px] font-medium text-ardoise">
                      {t("phoneGreeting")}
                    </p>
                    <p className="text-[9px] text-ardoise/70">
                      {t("phoneChildren")}
                    </p>
                  </div>

                  {/* Hero card — total remaining to pay */}
                  <div className="relative overflow-hidden rounded-2xl bg-encre shadow-lg shadow-encre/20">
                    <div className="pointer-events-none absolute -top-10 left-1/2 h-20 w-32 -translate-x-1/2 rounded-full bg-emeraude/30 blur-2xl" />
                    <div className="relative p-3.5">
                      <div className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-[7.5px] font-bold text-white/90">
                        {t("schoolName")}
                        <span className="ml-1 font-medium text-white/50">
                          • {t("academicYear")}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="text-[7.5px] font-bold uppercase tracking-[0.15em] text-emeraude/80">
                          {t("heroLabel")}
                        </div>
                        <div className="mt-1 text-2xl font-extrabold leading-none tracking-tighter text-white">
                          {t("heroAmount")}{" "}
                          <span className="text-sm font-bold text-white/50">FCFA</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-emeraude py-2 text-[10px] font-bold text-white shadow-lg shadow-emeraude/30">
                        <CreditCard className="h-3 w-3" />
                        {t("heroCta")}
                      </div>
                    </div>
                  </div>

                  {/* Installments timeline */}
                  <div className="mt-3 rounded-2xl border border-fil bg-white p-3">
                    <h3 className="text-xs font-bold text-encre">{t("scheduleTitle")}</h3>
                    <div className="relative ml-1.5 mt-2 space-y-3 border-l-2 border-fil pb-1 pl-3">
                      {/* Tranche 1 — paid */}
                      <div className="relative">
                        <div className="absolute -left-[18px] top-0 rounded-full bg-white p-0.5 text-emeraude">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-[9.5px] font-semibold text-encre">
                            {t("inst1Title")}
                          </p>
                          <span className="shrink-0 rounded-md bg-emeraude/10 px-1.5 py-0.5 text-[7px] font-bold uppercase text-emeraude">
                            {t("inst1Status")}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center justify-between gap-1">
                          <p className="text-[8px] font-semibold text-ardoise/70">
                            {t("inst1Meta")}
                          </p>
                          <p className="mono-data shrink-0 text-[9px] font-semibold text-encre">
                            {t("inst1Amount")}
                          </p>
                        </div>
                      </div>

                      {/* Tranche 2 — overdue, pay with Wave */}
                      <div className="relative">
                        <div className="absolute -left-[18px] top-0 rounded-full bg-white p-0.5 text-red-500">
                          <AlertTriangle className="h-3 w-3" />
                        </div>
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-[9.5px] font-semibold text-encre">
                            {t("inst2Title")}
                          </p>
                          <span className="flex shrink-0 items-center gap-1 rounded-md bg-red-500/10 px-1.5 py-0.5 text-[7px] font-bold uppercase text-red-600">
                            <span className="h-1 w-1 rounded-full bg-red-500" />
                            {t("inst2Status")}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center justify-between gap-1">
                          <p className="text-[8px] font-semibold text-red-500">
                            {t("inst2Meta")}
                          </p>
                          <p className="mono-data shrink-0 text-[9px] font-semibold text-encre">
                            {t("inst2Amount")}
                          </p>
                        </div>
                        <div className="mt-1.5 flex items-center justify-center gap-1 rounded-lg bg-emeraude py-1.5 text-[9px] font-bold text-white shadow-sm shadow-emeraude/30">
                          {t("instPay")}
                        </div>
                      </div>

                      {/* Tranche 3 — upcoming */}
                      <div className="relative">
                        <div className="absolute -left-[18px] top-0 rounded-full bg-white p-0.5 text-ardoise/50">
                          <Clock className="h-3 w-3" />
                        </div>
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-[9.5px] font-semibold text-encre">
                            {t("inst3Title")}
                          </p>
                          <span className="shrink-0 rounded-md bg-craie px-1.5 py-0.5 text-[7px] font-bold uppercase text-ardoise">
                            {t("inst3Status")}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center justify-between gap-1">
                          <p className="text-[8px] font-semibold text-ardoise/70">
                            {t("inst3Meta")}
                          </p>
                          <p className="mono-data shrink-0 text-[9px] font-semibold text-encre">
                            {t("inst3Amount")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom nav bar */}
                  <div className="mt-3 flex items-center justify-between rounded-2xl bg-craie px-4 py-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.key}
                          className="flex flex-col items-center gap-0.5"
                        >
                          <Icon
                            className={
                              item.active ? "h-3.5 w-3.5 text-emeraude" : "h-3.5 w-3.5 text-ardoise/50"
                            }
                            strokeWidth={item.active ? 2.5 : 2}
                          />
                          <span
                            className={
                              item.active
                                ? "text-[7.5px] font-bold text-emeraude"
                                : "text-[7.5px] font-bold text-ardoise/60"
                            }
                          >
                            {t(item.key)}
                          </span>
                        </div>
                      );
                    })}
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