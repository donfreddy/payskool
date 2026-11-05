import { useTranslations } from "next-intl";

import { ParentPhone } from "@/components/mocks/parent-phone";

import { frame, sectionTitle } from "./styles";

type Point = { title: string; text: string };

export function Parents() {
  const t = useTranslations("parents");
  const points = t.raw("points") as Point[];

  return (
    <section
      id="parents"
      aria-labelledby="parents-title"
      className="scroll-mt-16 bg-white py-20 sm:py-28"
    >
      <div
        className={`${frame} grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20`}
      >
        <div>
          <h2 id="parents-title" className={`${sectionTitle} max-w-2xl`}>
            {t("title")}
          </h2>
          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {points.map((point) => (
              <div key={point.title}>
                <dt className="text-[17px] font-bold text-encre">{point.title}</dt>
                <dd className="mt-1.5 leading-relaxed text-encre/70">{point.text}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ParentPhone />
      </div>
    </section>
  );
}
