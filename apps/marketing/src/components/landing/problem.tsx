import { useTranslations } from "next-intl";

import { frame } from "./styles";

type Item = { title: string; text: string };

export function Problem() {
  const t = useTranslations("problem");
  const items = t.raw("items") as Item[];

  return (
    <section aria-labelledby="problem-title" className="bg-encre py-20 text-white sm:py-24">
      <div className={frame}>
        <h2 id="problem-title" className="display-heading max-w-3xl text-[2.1rem] sm:text-[3rem]">
          {t("title")}
        </h2>

        <ul className="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-12 lg:grid-cols-4 lg:gap-8">
          {items.map((item) => (
            <li key={item.title} className="border-t border-white/15 pt-5">
              <h3 className="text-[19px] font-bold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-white/70">{item.text}</p>
            </li>
          ))}
        </ul>

        <p className="mt-14 max-w-3xl border-l-2 border-emeraude pl-5 text-[19px] leading-relaxed font-medium text-white sm:text-[21px]">
          {t("turn")}
        </p>
      </div>
    </section>
  );
}
