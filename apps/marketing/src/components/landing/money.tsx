import { ArrowRight, Landmark, ReceiptText, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

import { frame, sectionTitle } from "./styles";

type Fact = { title: string; text: string };

/** The objection every promoter raises first: who holds the money? */
export function Money() {
  const t = useTranslations("money");
  const facts = t.raw("facts") as Fact[];

  return (
    <section aria-labelledby="money-title" className="py-20 sm:py-28">
      <div className={frame}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <h2 id="money-title" className={sectionTitle}>
              {t("title")}
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-encre/75">{t("text")}</p>
          </div>

          <figure
            aria-label={t("flowLabel")}
            className="rounded-2xl border border-fil bg-white p-5 sm:p-7"
          >
            <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]" aria-hidden="true">
              <div className="rounded-xl bg-craie p-4">
                <Smartphone className="h-5 w-5 text-encre" />
                <p className="mt-2 font-bold text-encre">{t("parent")}</p>
                <p className="text-[13px] text-encre/65">{t("parentSub")}</p>
              </div>
              <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-emeraude sm:rotate-0" />
              <div className="rounded-xl bg-emerald-700 p-4 text-white">
                <Landmark className="h-5 w-5" />
                <p className="mt-2 font-bold">{t("school")}</p>
                <p className="text-[13px] text-white/90">{t("schoolSub")}</p>
              </div>
            </div>

            {/* Payskool sits off the money path: it observes and records, it never holds. */}
            <div
              className="relative mt-8 rounded-xl border-[1.5px] border-dashed border-encre/25 p-4 sm:ml-auto sm:w-[calc(50%-1.5rem)]"
              aria-hidden="true"
            >
              <span className="absolute -top-8 left-1/2 h-8 border-l-[1.5px] border-dashed border-encre/25" />
              <ReceiptText className="h-5 w-5 text-emeraude" />
              <p className="mt-2 font-bold text-encre">{t("payskool")}</p>
              <p className="text-[13px] text-encre/65">{t("payskoolSub")}</p>
            </div>
          </figure>
        </div>

        <ul className="mt-14 grid gap-8 sm:grid-cols-3">
          {facts.map((fact) => (
            <li key={fact.title} className="border-t border-encre/15 pt-4">
              <h3 className="font-bold text-encre">{fact.title}</h3>
              <p className="mt-1.5 leading-relaxed text-encre/70">{fact.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
