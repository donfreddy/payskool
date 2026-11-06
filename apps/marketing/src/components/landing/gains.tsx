import { useTranslations } from "next-intl";

import { DashboardPhone } from "@/components/mocks/dashboard-phone";

import { frame, sectionTitle } from "./styles";

type Item = { title: string; text: string };

export function Gains() {
  const t = useTranslations("gains");
  const items = t.raw("items") as Item[];
  const caption = useTranslations("mocks.dashboard")("caption");

  return (
    <section id="avantages" aria-labelledby="gains-title" className="scroll-mt-16 py-20 sm:py-28">
      <div
        className={`${frame} grid items-center gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16`}
      >
        <div>
          <h2 id="gains-title" className={sectionTitle}>
            {t("title")}
          </h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-x-10">
            {items.map((item) => (
              <li key={item.title} className="border-t border-fil pt-5">
                <h3 className="text-[19px] font-bold text-encre">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-encre/75">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <DashboardPhone />
          <p className="mt-5 text-center text-[13px] text-encre/65">{caption}</p>
        </div>
      </div>
    </section>
  );
}
