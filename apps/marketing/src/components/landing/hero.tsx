import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { whatsappUrl } from "@/lib/whatsapp";

import { SmsThread } from "./sms-thread";
import { frame, primaryButton, secondaryButton } from "./styles";

export function Hero() {
  const t = useTranslations("hero");
  const wa = useTranslations("whatsapp");

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Faint ruled lines: the page of a register, fading out to the right. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(to_bottom,transparent_0_2.4rem,rgb(12_18_32/0.05)_2.4rem_calc(2.4rem+1px))] [mask-image:linear-gradient(to_right,#000_10%,transparent_75%)]"
      />

      <div
        className={`${frame} grid items-center gap-14 pt-12 pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16 lg:pt-20 lg:pb-28`}
      >
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-emeraude/25 bg-white px-3 py-1 text-[13px] font-medium text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emeraude" aria-hidden="true" />
            {t("status")}
          </p>

          <h1
            id="hero-title"
            className="display-heading mt-6 text-[2.6rem] leading-[1.04] text-encre sm:text-[3.4rem] lg:text-[4.1rem]"
          >
            {t("title")}
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-encre/75 sm:text-lg">
            {t("lead")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappUrl(wa("intro"))} className={primaryButton}>
              <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
              {t("primaryCta")}
            </a>
            <a href="#relances" className={secondaryButton}>
              {t("secondaryCta")}
            </a>
          </div>

          <p className="mt-4 text-[14px] text-encre/65">{t("note")}</p>
        </div>

        <SmsThread />
      </div>
    </section>
  );
}
