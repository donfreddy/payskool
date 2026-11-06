import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { whatsappUrl } from "@/lib/whatsapp";

import { Logo } from "./logo";
import { frame } from "./styles";

const languageKeys = { fr: "languageFr", en: "languageEn" } as const;

export function Footer() {
  const t = useTranslations("footer");
  const wa = useTranslations("whatsapp");
  const current = useLocale();

  const columns = [
    {
      title: t("columnProduct"),
      links: [
        { href: "/#relances", label: t("reminders") },
        { href: "/#fonctionnement", label: t("how") },
        { href: "/#pilote", label: t("pilot") },
        { href: "/#faq", label: t("faq") },
      ],
    },
    {
      title: t("columnLegal"),
      links: [
        { href: "/legal/mentions", label: t("mentions") },
        { href: "/legal/privacy", label: t("privacy") },
        { href: "/legal/terms", label: t("terms") },
        { href: "/legal/cookies", label: t("cookies") },
      ],
    },
  ];

  return (
    <footer className="border-t border-fil bg-white">
      <div className={`${frame} grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]`}>
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-encre/70">{t("tagline")}</p>
          <a
            href={whatsappUrl(wa("question"))}
            className="mt-4 inline-block font-semibold text-emerald-700 underline decoration-emeraude/40 underline-offset-4 hover:decoration-emeraude"
          >
            {t("contact")}
          </a>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-[13px] font-semibold text-encre/65">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-encre/80 hover:text-encre">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Language detection can send a French speaker with an English phone to /en:
            this is the way back. */}
        <nav aria-label={t("columnLanguage")}>
          <p className="text-[13px] font-semibold text-encre/65">{t("columnLanguage")}</p>
          <ul className="mt-3 space-y-2">
            {routing.locales.map((locale) => (
              <li key={locale}>
                <Link
                  href="/"
                  locale={locale}
                  lang={locale}
                  aria-current={locale === current ? "page" : undefined}
                  className="text-[15px] text-encre/80 hover:text-encre aria-[current=page]:font-semibold aria-[current=page]:text-encre"
                >
                  {t(languageKeys[locale])}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-fil">
        <p className={`${frame} py-6 text-[13px] text-encre/65`}>
          © {new Date().getFullYear()} Payskool. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
