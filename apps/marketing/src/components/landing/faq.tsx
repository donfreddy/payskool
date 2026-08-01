"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function Faq() {
  const t = useTranslations("faq");

  const faqs = [
    {
      question: t("q1"),
      answer: t("a1"),
    },
    {
      question: t("q2"),
      answer: t("a2"),
    },
    {
      question: t("q3"),
      answer: t("a3"),
    },
    {
      question: t("q4"),
      answer: t("a4"),
    },
    {
      question: t("q5"),
      answer: t("a5"),
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emeraude">
            {t("eyebrow")}
          </p>
          <h2 className="display-heading mt-4 text-3xl text-encre sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-fil">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-base font-medium text-encre group-open:text-emeraude transition-colors">
                  {faq.question}
                </span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-craie text-ardoise transition-all group-open:bg-emeraude/10 group-open:text-emeraude group-open:rotate-180">
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </span>
              </summary>
              <div className="mt-4 animate-fade-in">
                <p className="text-sm leading-relaxed text-ardoise">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-fil bg-white p-6 text-center">
          <p className="text-sm text-ardoise">
            {t("moreQuestions")}
          </p>
          <a
            href="#"
            className="mt-2 inline-block text-sm font-semibold text-emeraude hover:underline"
          >
            {t("contactWhatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
