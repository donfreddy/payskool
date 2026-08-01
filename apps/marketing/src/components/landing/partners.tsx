"use client";

import { useTranslations } from "next-intl";

export function Partners() {
  const t = useTranslations("partners");

  const partners = [
    { name: "Wave", color: "#1DC9CE" },
    { name: "Orange Money", color: "#FF6600" },
    { name: "MTN MoMo", color: "#FFCC00" },
    { name: "CinetPay", color: "#0F172A" },
    { name: "Paystack", color: "#0BA4DB" },
    { name: "Flutterwave", color: "#F5A623" },
  ];

  return (
    <section className="border-y border-fil bg-white py-5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-ardoise/60 mb-4">
          {t("label")}
        </p>
        {/* Desktop: static row */}
        <div className="hidden sm:flex items-center justify-center gap-10 flex-wrap">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2.5 opacity-50 hover:opacity-100 transition-opacity duration-200"
            >
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: partner.color }}
              />
              <span className="text-sm font-semibold text-encre tracking-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
        {/* Mobile: scrolling ticker */}
        <div className="sm:hidden relative">
          <div className="flex animate-ticker w-max gap-10">
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex items-center gap-2.5 shrink-0 opacity-60"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: partner.color }}
                />
                <span className="text-sm font-semibold text-encre tracking-tight">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
