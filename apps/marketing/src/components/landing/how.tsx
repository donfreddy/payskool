import { Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

import { frame, sectionTitle } from "./styles";

type Step = { title: string; text: string };

/** One instalment from first reminder to last follow-up: a real sequence, hence the numbers. */
export function How() {
  const t = useTranslations("how");
  const steps = t.raw("steps") as Step[];

  return (
    <section
      id="fonctionnement"
      aria-labelledby="how-title"
      className="scroll-mt-16 bg-white py-20 sm:py-28"
    >
      <div className={frame}>
        <h2 id="how-title" className={`${sectionTitle} max-w-3xl`}>
          {t("title")}
        </h2>

        <ol className="relative mt-14 grid gap-10 lg:grid-cols-5 lg:gap-6">
          {/* The thread that ties the steps together, behind the numbers. */}
          <span
            aria-hidden="true"
            className="absolute top-5 bottom-5 left-5 w-px bg-fil lg:top-5 lg:right-10 lg:bottom-auto lg:left-10 lg:h-px lg:w-auto"
          />
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-4">
              <span
                aria-hidden="true"
                className="mono-data relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-encre text-[15px] font-bold text-white ring-8 ring-white"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-[18px] leading-snug font-bold text-encre">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-encre/75">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-14 flex max-w-2xl gap-3 rounded-2xl bg-craie px-5 py-4 text-[16px] leading-relaxed text-encre/80">
          <Smartphone className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
          {t("soon")}
        </p>
      </div>
    </section>
  );
}
