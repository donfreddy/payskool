"use client";

import { Menu, ShieldCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

const navLinkHrefs = [
  { href: "#features-school" },
  { href: "#features-parents" },
  { href: "#pricing" },
  { href: "#faq" },
];

const navLinkKeys = ["features", "parents", "pricing", "faq"] as const;

export function Nav() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/75 backdrop-blur-xl border-b border-fil shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2 group">
          <ShieldCheck className="h-6 w-6 text-emeraude transition-transform group-hover:scale-110" />
          <span className="text-[17px] font-extrabold tracking-tight text-encre">
            PAYS<span className="text-emeraude">KOOL</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinkHrefs.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-ardoise transition-colors hover:bg-encre/[0.04] hover:text-encre"
            >
              {t(navLinkKeys[i]!)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#"
            className="rounded-lg border border-fil px-4 py-2 text-[13px] font-medium text-encre transition-colors hover:bg-encre/[0.03]"
          >
            {t("login")}
          </a>
          <a
            href="#cta"
            className="glow-btn rounded-lg bg-emeraude px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-emeraude/90"
          >
            {t("cta")}
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-encre hover:bg-encre/[0.04] md:hidden"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-fil bg-white px-4 pb-6 pt-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1">
            {navLinkHrefs.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ardoise transition-colors hover:bg-encre/[0.04] hover:text-encre"
              >
                {t(navLinkKeys[i]!)}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="#"
              className="rounded-lg border border-fil px-4 py-3 text-center text-sm font-medium text-encre"
            >
              {t("login")}
            </a>
            <a
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-emeraude px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {t("cta")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
