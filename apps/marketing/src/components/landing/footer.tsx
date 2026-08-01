import { Globe, Mail, MessageCircle, ShieldCheck } from "lucide-react";

const productLinks = [
  { label: "Fonctionnalités", href: "#features-school" },
  { label: "Tarifs", href: "#pricing" },
  { label: "Intégrations", href: "#features-parents" },
];

const companyLinks = [
  { label: "À Propos", href: "#" },
  { label: "Carrières", href: "#" },
  { label: "Presse", href: "#" },
];

const legalLinks = [
  { label: "Mentions légales", href: "#" },
  { label: "Politique de confidentialité", href: "#" },
  { label: "Conditions générales", href: "#" },
  { label: "Cookies", href: "#" },
];

export function Footer() {
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
              La plateforme de recouvrement de scolarité 100% automatisée
              pour les écoles africaines.
            </p>
            <p className="mt-4 text-xs text-ardoise/60">
              Fait avec ❤️ depuis l&apos;Afrique
            </p>
          </div>

          {/* Produit */}
          <div>
            <h4 className="text-sm font-semibold text-encre">Produit</h4>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-ardoise transition-colors hover:text-encre"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="text-sm font-semibold text-encre">Entreprise</h4>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-ardoise transition-colors hover:text-encre"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-sm font-semibold text-encre">Légal</h4>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-ardoise transition-colors hover:text-encre"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-fil pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ardoise">
            &copy; {new Date().getFullYear()} PAYSKOOL. Tous droits
            réservés.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs text-ardoise hover:text-encre transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs text-ardoise hover:text-encre transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              Email
            </a>
            <button className="inline-flex items-center gap-1.5 text-xs text-ardoise hover:text-encre transition-colors">
              <Globe className="h-3.5 w-3.5" />
              FR
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
