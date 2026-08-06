"use client";

import { Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useTransition, type ChangeEvent } from "react";


import { usePathname, useRouter, Link } from "@/i18n/navigation";

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
  ];

  const legalLinks = [
    { label: t("linkLegal"), href: "/legal/mentions" },
    { label: t("linkPrivacy"), href: "/legal/privacy" },
    { label: t("linkTerms"), href: "/legal/terms" },
    { label: t("linkCookies"), href: "/legal/cookies" },
  ];

  return (
    <footer className="border-t border-fil/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto_auto_auto]">
          {/* Brand */}
          <div>
            <span className="text-xl font-extrabold tracking-tight text-encre">
              PAYS<span className="text-emeraude">KOOL</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ardoise">
              {t("description")}
            </p>
          </div>

          {[
            { title: t("columnProduct"), links: productLinks },
            { title: t("columnCompany"), links: companyLinks },
            { title: t("columnLegal"), links: legalLinks },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-ardoise">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-encre/70 transition-colors hover:text-encre"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-fil/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ardoise/60">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>

          <div className="flex items-center gap-5 text-xs text-ardoise">
            <a href="#" className="hover:text-encre transition-colors">
              {t("whatsapp")}
            </a>
            <a href="#" className="hover:text-encre transition-colors">
              {t("email")}
            </a>
            <div className="relative inline-flex items-center gap-1.5 transition-colors hover:text-encre">
              <Globe className="h-3.5 w-3.5 pointer-events-none" />
              <select
                value={locale}
                onChange={handleLocaleChange}
                disabled={isPending}
                className="appearance-none bg-transparent py-1 pl-1 pr-4 font-medium outline-none cursor-pointer"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
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
