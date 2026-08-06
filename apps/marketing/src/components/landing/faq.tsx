"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function Faq() {
  const t = useTranslations("faq");

  const faqs = [
    { question: t("q1"), answer: t("a1") },
    { question: t("q2"), answer: t("a2") },
    { question: t("q3"), answer: t("a3") },
    { question: t("q4"), answer: t("a4") },
    { question: t("q5"), answer: t("a5") },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="display-heading text-center text-3xl text-encre sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-14 divide-y divide-fil/60">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-base font-medium text-encre group-open:text-emeraude transition-colors">
                  {faq.question}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-ardoise/40 transition-all group-open:rotate-180 group-open:text-emeraude" />
              </summary>
              <div className="mt-4 animate-fade-in pr-8">
                <p className="text-sm leading-relaxed text-ardoise">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-ardoise">
          {t("moreQuestions")}{" "}
          <a
            href="#"
            className="font-medium text-emeraude transition-colors hover:text-emeraude/80"
          >
            {t("contactWhatsapp")}
          </a>
        </p>
      </div>
    </section>
  );
}
