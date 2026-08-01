import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PAYSKOOL — Recouvrement de scolarité automatisé par Mobile Money",
  description:
    "Sécurisez la trésorerie de votre école. Paiements Wave, Orange Money, MTN tracés et réconciliés automatiquement. Reçus WhatsApp. Ledger infalsifiable. Essai gratuit.",
  keywords: [
    "paiement scolarité",
    "mobile money école",
    "recouvrement frais scolaires",
    "PAYSKOOL",
    "Wave",
    "Orange Money",
    "MTN MoMo",
    "frais de scolarité Afrique",
    "gestion école",
  ],
  openGraph: {
    title: "PAYSKOOL — Chaque franc de scolarité. Tracé, confirmé, réconcilié.",
    description:
      "La plateforme de recouvrement de frais scolaires par Mobile Money. Adoptée par 50+ complexes scolaires en Afrique subsaharienne.",
    type: "website",
    siteName: "PAYSKOOL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-craie text-encre">
        {children}
      </body>
    </html>
  );
}
