import { useTranslations } from "next-intl";

import { AppFrame } from "@/components/mocks/primitives";
import { CashierMock, CollectionMock, PaymentsMock } from "@/components/mocks/school-mocks";

import { frame, sectionTitle } from "./styles";

type Block = { title: string; text: string };

const screens = [
  { path: "/caisse", Mock: CashierMock },
  { path: "/paiements", Mock: PaymentsMock },
  { path: "/recouvrement", Mock: CollectionMock },
];

export function School() {
  const t = useTranslations("school");
  const label = useTranslations("mocks")("frameLabel");
  const blocks = t.raw("blocks") as Block[];

  return (
    <section
      id="ecole"
      aria-labelledby="school-title"
      className="scroll-mt-16 bg-white py-20 sm:py-28"
    >
      <div className={frame}>
        <h2 id="school-title" className={`${sectionTitle} max-w-3xl`}>
          {t("title")}
        </h2>

        <div className="mt-14 flex flex-col gap-16 lg:gap-24">
          {blocks.map((block, index) => {
            const { path, Mock } = screens[index]!;
            return (
              <article
                key={block.title}
                className={`grid items-center gap-8 lg:gap-14 ${
                  index % 2 === 1
                    ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
                    : "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                  <h3 className="text-[22px] leading-tight font-bold text-encre sm:text-[26px]">
                    {block.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[17px] leading-relaxed text-encre/75">
                    {block.text}
                  </p>
                </div>
                <AppFrame path={path} label={`${label}, ${block.title}`}>
                  <Mock />
                </AppFrame>
              </article>
            );
          })}
        </div>

        <p className="mt-16 max-w-2xl rounded-2xl bg-craie px-6 py-5 text-[16px] leading-relaxed text-encre/80">
          {t("group")}
        </p>
      </div>
    </section>
  );
}
