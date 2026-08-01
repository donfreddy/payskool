"use client";

import { Menu, ShieldCheck, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Fonctionnalités", href: "#features-school" },
  { label: "Pour les Parents", href: "#features-parents" },
  { label: "Tarifs", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
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
          ? "bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-payskool-navy text-white transition-transform group-hover:scale-105">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-payskool-navy">
            PAYS<span className="text-payskool-emerald">KOOL</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-payskool-muted transition-colors hover:bg-slate-100 hover:text-payskool-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-payskool-navy transition-colors hover:bg-slate-50"
          >
            Connexion
          </a>
          <a
            href="#cta"
            className="glow-btn rounded-lg bg-payskool-emerald px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-payskool-emerald/90"
          >
            Demander un accès pilote
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-payskool-navy hover:bg-slate-100 md:hidden"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-6 pt-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-payskool-muted transition-colors hover:bg-slate-100 hover:text-payskool-navy"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="#"
              className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-medium text-payskool-navy"
            >
              Connexion
            </a>
            <a
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-payskool-emerald px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Demander un accès pilote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
