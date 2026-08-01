"use client";

import { Globe, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useTransition, ChangeEvent } from "react";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  const productLinks = [
    { label: t("linkFeatures"), href: "/#features-school" },
    { label: t("linkPricing"), href: "/#pricing" },
    { label: t("linkIntegrations"), href: "/#features-parents" },
  ];

  const companyLinks = [
    { label: t("linkAbout"), href: "/about" },
    { label: t("linkCareers"), href: "/careers" },
    { label: t("linkPress"), href: "/press" },
  ];

  const legalLinks = [
    { label: t("linkLegal"), href: "/legal" },
    { label: t("linkPrivacy"), href: "/privacy" },
    { label: t("linkTerms"), href: "/terms" },
    { label: t("linkCookies"), href: "/cookies" },
  ];

  return (
    <footer className="border-t border-fil bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 group">
              <ShieldCheck className="h-6 w-6 text-emeraude transition-transform group-hover:scale-110" />
              <span className="text-xl font-extrabold tracking-tight text-encre">
                PAYS<span className="text-emeraude">KOOL</span>
              </span>
            </a>
            <p className="mt-5 text-sm leading-relaxed text-ardoise max-w-xs">
              {t("description")}
            </p>
            <p className="mt-4 text-xs text-ardoise/60">
              {t("madeWith")}
            </p>
          </div>

          {/* Produit */}
          <div>
            <h4 className="text-sm font-semibold text-encre">{t("columnProduct")}</h4>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ardoise transition-colors hover:text-encre"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="text-sm font-semibold text-encre">{t("columnCompany")}</h4>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ardoise transition-colors hover:text-encre"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-sm font-semibold text-encre">{t("columnLegal")}</h4>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ardoise transition-colors hover:text-encre"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-fil pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ardoise">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs text-ardoise hover:text-encre transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {t("whatsapp")}
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs text-ardoise hover:text-encre transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              {t("email")}
            </a>
            <div className="relative inline-flex items-center gap-1.5 text-xs text-ardoise transition-colors hover:text-encre">
              <Globe className="h-3.5 w-3.5 pointer-events-none" />
              <select
                value={locale}
                onChange={handleLocaleChange}
                disabled={isPending}
                className="appearance-none bg-transparent py-1 pl-1 pr-4 font-medium outline-none cursor-pointer"
              >
                <option value="fr">Français (FR)</option>
                <option value="en">English (EN)</option>
              </select>
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
