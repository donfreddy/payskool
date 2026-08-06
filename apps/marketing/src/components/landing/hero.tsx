"use client";

import { Button } from "@payskool/ui/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative pt-14 pb-24 sm:pt-24 sm:pb-36">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-160 w-160 translate-x-1/4 -translate-y-1/4 rounded-full bg-emeraude/6 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-125 w-125 -translate-x-1/4 translate-y-1/4 rounded-full bg-encre/3 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Text — centered */}
        <div className="flex flex-col items-center text-center gap-6">
          <h1 className="display-heading animate-fade-up-2 text-4xl text-encre sm:text-5xl lg:text-[3.5rem]">
            {t("headline")}
            <br />
            <span className="text-emeraude">{t("headlineRest")}</span>
          </h1>

          <p className="animate-fade-up-3 mx-auto max-w-lg text-[17px] leading-relaxed text-ardoise">
            {t("subheadline")}
          </p>

          <div className="animate-fade-up-4 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="emerald" className="py-6">
              {t("primaryCta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
             <Button size="lg" variant="outline" className="py-6">
               <Play className="h-4 w-4 text-emeraude" />
                {t("secondaryCta")}
            </Button>
          </div>

          {/* Social proof */}
          <div className="animate-fade-up-4 mt-2 flex items-center justify-center gap-5 border-t border-fil pt-6">
            <div className="flex -space-x-2">
              {["PT", "AD", "JK", "SN"].map((initials, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-encre/6 text-[10px] font-bold text-ardoise"
                >
                  {initials}
                </div>
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-encre text-[9px] font-semibold text-white">
                +50
              </div>
            </div>
            <p className="text-sm text-ardoise">
              {t("trustLabel")} <strong className="text-encre">50+</strong>{" "}
              {t("trustSuffix")}
            </p>
          </div>
        </div>

        {/* Dashboard Screenshot — full width below text */}
        <div className="relative mx-auto mt-16 w-full max-w-7xl sm:mt-20">
          {/* Subtle glow behind the image */}
          <div className="pointer-events-none absolute -inset-x-8 -inset-y-8 rounded-3xl bg-emeraude/3 blur-3xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/screenshot-light.png"
            alt={t("dashboardAlt")}
            className="relative w-full rounded-2xl ring-1 ring-inset ring-encre/6 shadow-2xl shadow-encre/4"
            style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}
          />
        </div>
      </div>
    </section>
  );
}
