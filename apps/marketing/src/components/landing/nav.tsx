"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";
import { whatsappUrl } from "@/lib/whatsapp";

import { Logo } from "./logo";
import { frame } from "./styles";

/** Anchors point at the home page, so they also work from /about or /careers. */
const links = [
  { href: "/#relances", key: "reminders" },
  { href: "/#fonctionnement", key: "how" },
  { href: "/#pilote", key: "pilot" },
  { href: "/#faq", key: "faq" },
] as const;

const cta =
  "items-center justify-center gap-2 bg-emerald-700 font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 focus-visible:outline-none";

export function Nav() {
  const t = useTranslations("nav");
  const wa = useTranslations("whatsapp");
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-fil bg-craie/90 backdrop-blur-md">
      <div className={`${frame} flex h-16 items-center justify-between`}>
        <Link
          href="/"
          aria-label={t("home")}
          className="rounded-md focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:outline-none"
        >
          <Logo />
        </Link>

        <nav aria-label={t("label")} className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-encre/75 transition-colors hover:text-encre"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappUrl(wa("intro"))}
          className={`${cta} hidden min-h-10 rounded-lg px-4 text-[14px] md:inline-flex`}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {t("cta")}
        </a>

        <button
          ref={toggle}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={open ? "mobile-menu" : undefined}
          aria-label={open ? t("closeMenu") : t("openMenu")}
          className="grid h-11 w-11 place-items-center rounded-lg text-encre hover:bg-encre/5 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="animate-fade-in border-t border-fil bg-white md:hidden">
          <nav aria-label={t("mobileLabel")} className={`${frame} flex flex-col py-3`}>
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-1 py-3 text-[16px] font-medium text-encre"
              >
                {t(link.key)}
              </Link>
            ))}
            <a
              href={whatsappUrl(wa("intro"))}
              className={`${cta} mt-2 mb-2 inline-flex min-h-12 rounded-xl text-[15px]`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {t("cta")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
