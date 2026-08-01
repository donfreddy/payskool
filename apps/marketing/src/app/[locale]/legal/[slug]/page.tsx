import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default async function LegalPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  
  const validSlugs = ["mentions", "privacy", "terms", "cookies"];
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main className="bg-craie min-h-screen py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <ShieldCheck className="w-12 h-12 text-emeraude mx-auto mb-6" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-encre mb-4">
              {t(`${slug}.title` as any)}
            </h1>
            <p className="text-sm text-ardoise/70">
              {t("lastUpdated")}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-fil shadow-sm space-y-10">
            <div>
              <h2 className="text-xl font-bold text-encre mb-4">{t(`${slug}.p1` as any)}</h2>
              <p className="text-ardoise leading-relaxed">{t(`${slug}.p2` as any)}</p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-encre mb-4">{t(`${slug}.p3` as any)}</h2>
              <p className="text-ardoise leading-relaxed">{t(`${slug}.p4` as any)}</p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-encre mb-4">{t(`${slug}.p5` as any)}</h2>
              <p className="text-ardoise leading-relaxed">{t(`${slug}.p6` as any)}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
