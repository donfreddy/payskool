import { useTranslations } from "next-intl";

import { PilotRequestForm } from "./pilot-request-form";
import { frame } from "./styles";

export function FinalCta() {
  const t = useTranslations("finalCta");

  return (
    <section id="demande" aria-labelledby="final-title" className="scroll-mt-16 py-20 sm:py-28">
      <div className={frame}>
        <div className="rounded-3xl bg-encre px-6 py-14 text-center sm:px-14 sm:py-16">
          <h2
            id="final-title"
            className="display-heading mx-auto max-w-2xl text-[2rem] text-white sm:text-[2.6rem]"
          >
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-white/70">
            {t("text")}
          </p>
          <div className="mx-auto max-w-3xl">
            <PilotRequestForm />
          </div>
          <p className="mt-5 text-[13px] text-white/55">{t("note")}</p>
        </div>
      </div>
    </section>
  );
}
