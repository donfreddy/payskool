import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, MapPin, Briefcase, Building, CheckCircle2, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

export default async function JobDetailsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslations({ locale: (await params).locale, namespace: "job" });
  
  // Very basic check to ensure the slug exists in our translations
  // In a real app, this would be a CMS query
  const validSlugs = ["fullstack", "product-designer"];
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main className="bg-craie min-h-screen pb-24">
        {/* Header Section */}
        <section className="bg-white border-b border-fil py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Link 
              href="/careers" 
              className="inline-flex items-center gap-2 text-sm font-medium text-ardoise hover:text-encre transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </Link>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-encre mb-6">
              {t(`${slug}.title` as any)}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-encre/[0.04] text-encre">
                <MapPin className="w-4 h-4 text-ardoise" />
                {t(`${slug}.location` as any)}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-encre/[0.04] text-encre">
                <Briefcase className="w-4 h-4 text-ardoise" />
                {t(`${slug}.type` as any)}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-encre/[0.04] text-encre">
                <Building className="w-4 h-4 text-ardoise" />
                {t(`${slug}.department` as any)}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-fil shadow-sm">
              
              <div className="space-y-12">
                {/* About */}
                <div>
                  <h2 className="text-xl font-bold text-encre mb-4">{t("aboutRole")}</h2>
                  <p className="text-ardoise leading-relaxed">
                    {t(`${slug}.aboutText` as any)}
                  </p>
                </div>
                
                {/* Responsibilities */}
                <div>
                  <h2 className="text-xl font-bold text-encre mb-4">{t("responsibilities")}</h2>
                  <ul className="space-y-4">
                    {[1, 2, 3].map((num) => (
                      <li key={num} className="flex gap-3 text-ardoise leading-relaxed">
                        <CheckCircle2 className="w-6 h-6 text-emeraude shrink-0" />
                        <span>{t(`${slug}.resp${num}` as any)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Requirements */}
                <div>
                  <h2 className="text-xl font-bold text-encre mb-4">{t("requirements")}</h2>
                  <ul className="space-y-4">
                    {[1, 2, 3].map((num) => (
                      <li key={num} className="flex gap-3 text-ardoise leading-relaxed">
                        <CheckCircle2 className="w-6 h-6 text-emeraude shrink-0" />
                        <span>{t(`${slug}.req${num}` as any)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Benefits */}
                <div>
                  <h2 className="text-xl font-bold text-encre mb-4">{t("benefits")}</h2>
                  <ul className="space-y-4">
                    {[1, 2].map((num) => (
                      <li key={num} className="flex gap-3 text-ardoise leading-relaxed">
                        <CheckCircle2 className="w-6 h-6 text-emeraude shrink-0" />
                        <span>{t(`${slug}.ben${num}` as any)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Apply CTA */}
              <div className="mt-16 pt-12 border-t border-fil text-center">
                <h3 className="text-2xl font-bold text-encre mb-4">{t("apply")}</h3>
                <p className="text-ardoise mb-8">
                  {t("applyDesc")}
                </p>
                <a 
                  href="mailto:talents@payskool.africa" 
                  className="glow-btn inline-flex items-center gap-2 rounded-xl bg-emeraude px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-emeraude/90"
                >
                  {t("apply")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
