import { Check, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { whatsappUrl } from "@/lib/whatsapp";

import { frame, primaryButton, sectionTitle } from "./styles";

type Step = { title: string; text: string };

export function Pilot() {
  const t = useTranslations("pilot");
  const wa = useTranslations("whatsapp");
  const offer = t.raw("offer") as string[];
  const steps = t.raw("steps") as Step[];

  return (
    <section id="pilote" aria-labelledby="pilot-title" className="scroll-mt-16 py-20 sm:py-28">
      <div className={frame}>
        <h2 id="pilot-title" className={sectionTitle}>
          {t("title")}
        </h2>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-encre/75">{t("intro")}</p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emeraude/30 bg-white p-6 sm:p-8">
            <h3 className="text-[19px] font-bold text-encre">{t("offerTitle")}</h3>
            <ul className="mt-5 space-y-3">
              {offer.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed text-encre/85">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-emeraude" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-fil pt-5 text-[15px] leading-relaxed text-encre/70">
              {t("after")}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-fil sm:p-8">
            <h3 className="text-[19px] font-bold text-encre">{t("stepsTitle")}</h3>
            <ol className="mt-5 space-y-5">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    className="mono-data grid h-8 w-8 shrink-0 place-items-center rounded-full bg-encre text-[14px] font-bold text-white"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-encre">{step.title}</p>
                    <p className="mt-1 leading-relaxed text-encre/70">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a href={whatsappUrl(wa("intro"))} className={`${primaryButton} mt-7 w-full sm:w-auto`}>
              <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
              {t("cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
