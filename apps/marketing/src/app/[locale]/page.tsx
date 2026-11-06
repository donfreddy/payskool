import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Desk } from "@/components/landing/desk";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Gains } from "@/components/landing/gains";
import { Hero } from "@/components/landing/hero";
import { How } from "@/components/landing/how";
import { Nav } from "@/components/landing/nav";
import { Pilot } from "@/components/landing/pilot";
import { Problem } from "@/components/landing/problem";
import { Reminders } from "@/components/landing/reminders";
import { pageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: pageAlternates(locale) };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Reminders />
        <How />
        <Gains />
        <Desk />
        <Pilot />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
