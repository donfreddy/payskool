import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Money } from "@/components/landing/money";
import { Nav } from "@/components/landing/nav";
import { Parents } from "@/components/landing/parents";
import { Pilot } from "@/components/landing/pilot";
import { Problem } from "@/components/landing/problem";
import { School } from "@/components/landing/school";
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
        <School />
        <Money />
        <Parents />
        <Pilot />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
