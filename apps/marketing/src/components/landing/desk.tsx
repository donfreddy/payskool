import { useTranslations } from "next-intl";

import { AppFrame } from "@/components/mocks/primitives";
import { CashierMock } from "@/components/mocks/school-mocks";

import { Receipt } from "./receipt";
import { frame, sectionTitle } from "./styles";

type Point = { title: string; text: string };

/** Cash desk control: second to collection, but the reason a register beats a receipt book. */
export function Desk() {
  const t = useTranslations("desk");
  const label = useTranslations("mocks")("frameLabel");
  const points = t.raw("points") as Point[];

  return (
    <section
      id="caisse"
      aria-labelledby="desk-title"
      className="scroll-mt-16 bg-white py-20 sm:py-28"
    >
      <div className={frame}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="desk-title" className={sectionTitle}>
              {t("title")}
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-encre/75">{t("text")}</p>
          </div>
          <ul className="space-y-6 lg:pt-2">
            {points.map((point) => (
              <li key={point.title} className="border-l-2 border-emeraude/40 pl-4">
                <h3 className="text-[17px] font-bold text-encre">{point.title}</h3>
                <p className="mt-1 leading-relaxed text-encre/75">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* The cash desk and the receipt it prints, side by side: the payment taken, then its proof. */}
        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-12">
          <div>
            <AppFrame path="/caisse" label={`${label}, ${points[0]?.title ?? ""}`}>
              <CashierMock />
            </AppFrame>
          </div>
          <div className="mx-auto w-full max-w-[19rem] lg:max-w-none lg:rotate-[1.5deg]">
            <Receipt />
          </div>
        </div>
      </div>
    </section>
  );
}
