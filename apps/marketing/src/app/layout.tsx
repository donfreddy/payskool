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
  title: "PAYSKOOL | Recouvrement de scolarité automatisé par Mobile Money",
  description:
    "Sécurisez et automatisez le recouvrement des frais de scolarité. Wave, Orange Money, MTN MoMo. Reçus WhatsApp automatiques. 100% traçabilité.",
  keywords: [
    "paiement scolarité",
    "mobile money école",
    "recouvrement frais scolaires",
    "PAYSKOOL",
    "Wave",
    "Orange Money",
    "MTN MoMo",
  ],
  openGraph: {
    title: "PAYSKOOL | Recouvrement de scolarité automatisé",
    description:
      "La solution n°1 de recouvrement de scolarité par Mobile Money en Afrique.",
    type: "website",
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
      <body className="min-h-full flex flex-col bg-payskool-bg text-payskool-navy">
        {children}
      </body>
    </html>
  );
}
