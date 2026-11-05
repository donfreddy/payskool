import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { whatsappUrl } from "@/lib/whatsapp";

import { frame, sectionTitle } from "./styles";

type Item = { q: string; a: string };

export function Faq() {
  const t = useTranslations("faq");
  const wa = useTranslations("whatsapp");
  const items = t.raw("items") as Item[];

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <div
        className={`${frame} grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16`}
      >
        <div>
          <h2 id="faq-title" className={sectionTitle}>
            {t("title")}
          </h2>
          <p className="mt-5 text-encre/75">
            {t("more")}{" "}
            <a
              href={whatsappUrl(wa("question"))}
              className="font-semibold text-emerald-700 underline decoration-emeraude/40 underline-offset-4 hover:decoration-emeraude"
            >
              {t("contact")}
            </a>
          </p>
        </div>

        <div className="divide-y divide-fil border-y border-fil">
          {items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer items-start justify-between gap-4 py-5 text-[17px] font-semibold text-encre focus-visible:ring-2 focus-visible:ring-emeraude focus-visible:outline-none">
                {item.q}
                <ChevronDown
                  className="mt-1 h-5 w-5 shrink-0 text-encre/50 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="-mt-1 pb-5 leading-relaxed text-encre/75">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
