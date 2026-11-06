import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { ReminderStudio } from "./reminder-studio";
import { frame, sectionTitle } from "./styles";

export function Reminders() {
  const t = useTranslations("reminders");
  const rules = t.raw("rules") as string[];

  return (
    <section
      id="relances"
      aria-labelledby="reminders-title"
      className="scroll-mt-16 py-20 sm:py-28"
    >
      <div className={frame}>
        <h2 id="reminders-title" className={`${sectionTitle} max-w-3xl`}>
          {t("title")}
        </h2>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-encre/75">{t("intro")}</p>

        <div className="mt-12">
          <ReminderStudio />
        </div>

        <div className="mt-14 rounded-2xl bg-white p-6 ring-1 ring-fil sm:p-8">
          <h3 className="flex items-center gap-2 text-[17px] font-bold text-encre">
            <ShieldCheck className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            {t("rulesTitle")}
          </h3>
          <ul className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {rules.map((rule) => (
              <li
                key={rule}
                className="border-l-2 border-emeraude/40 pl-3 leading-relaxed text-encre/80"
              >
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
