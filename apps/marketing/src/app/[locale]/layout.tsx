import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Site-wide metadata. Canonical and hreflang are set per page (pageAlternates):
 * set here, every page without its own would claim to be the home page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(site.url),
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    robots: site.indexable ? undefined : { index: false, follow: false },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      siteName: site.name,
      locale: locale === "fr" ? "fr_CM" : "en_CM",
      images: [{ url: `/og-${locale}.png`, width: 1200, height: 630, alt: t("ogTitle") }],
    },
    twitter: { card: "summary_large_image" },
  };
}

/** Only the namespaces client components read are serialised into the page. */
const CLIENT_NAMESPACES = ["nav", "whatsapp", "verify", "receipt"] as const;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as never)) {
    notFound();
  }

  setRequestLocale(locale);

  const allMessages = await getMessages();
  const messages = Object.fromEntries(
    CLIENT_NAMESPACES.map((namespace) => [namespace, allMessages[namespace]]),
  );

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-craie text-encre">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
