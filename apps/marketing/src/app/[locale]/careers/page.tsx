import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { useTranslations } from "next-intl";
import { ShieldCheck, MapPin, Lightbulb, Briefcase, ArrowRight, HeartPulse, Laptop, TrendingUp, Target } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const t = useTranslations("careers");

  return (
    <>
      <Nav />
      <main className="bg-craie min-h-screen">
        {/* Hero Section */}
        <section className="py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emeraude to-encre opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="display-heading text-4xl text-encre sm:text-5xl lg:text-6xl mx-auto max-w-4xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg text-ardoise max-w-2xl mx-auto leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-24 bg-white border-t border-fil">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-encre sm:text-4xl mb-6">{t("cultureTitle")}</h2>
              <p className="text-lg text-ardoise leading-relaxed">{t("cultureIntro")}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="flex gap-6">
                <div className="w-12 h-12 shrink-0 bg-emeraude/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-emeraude" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-encre mb-3">{t("culture1Title")}</h3>
                  <p className="text-ardoise leading-relaxed">{t("culture1Desc")}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 shrink-0 bg-emeraude/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emeraude" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-encre mb-3">{t("culture2Title")}</h3>
                  <p className="text-ardoise leading-relaxed">{t("culture2Desc")}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 shrink-0 bg-emeraude/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emeraude" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-encre mb-3">{t("culture3Title")}</h3>
                  <p className="text-ardoise leading-relaxed">{t("culture3Desc")}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 shrink-0 bg-emeraude/10 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-emeraude" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-encre mb-3">{t("culture4Title")}</h3>
                  <p className="text-ardoise leading-relaxed">{t("culture4Desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Perks Section */}
        <section className="py-24 bg-encre text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">{t("perksTitle")}</h2>
              <p className="text-white/70 text-lg leading-relaxed">{t("perksIntro")}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <MapPin className="w-8 h-8 text-emeraude mb-4" />
                <h4 className="text-lg font-semibold mb-2">{t("perk1Title")}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{t("perk1Desc")}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <Laptop className="w-8 h-8 text-emeraude mb-4" />
                <h4 className="text-lg font-semibold mb-2">{t("perk2Title")}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{t("perk2Desc")}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <HeartPulse className="w-8 h-8 text-emeraude mb-4" />
                <h4 className="text-lg font-semibold mb-2">{t("perk3Title")}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{t("perk3Desc")}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <TrendingUp className="w-8 h-8 text-emeraude mb-4" />
                <h4 className="text-lg font-semibold mb-2">{t("perk4Title")}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{t("perk4Desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-24 bg-craie">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-encre sm:text-4xl">{t("rolesTitle")}</h2>
            </div>
            
            <div className="space-y-12">
              {/* Engineering */}
              <div>
                <h3 className="text-xl font-bold text-encre mb-6 border-b border-fil pb-2">{t("rolesEng")}</h3>
                <div className="space-y-4">
                  {[
                    { num: 1, slug: "fullstack" },
                    { num: 2, slug: "product-designer" },
                    { num: 3, slug: "" }
                  ].map(({num, slug}) => (
                    <div key={num} className="bg-white p-6 rounded-2xl border border-fil flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow hover:shadow-md">
                      <div>
                        <h4 className="font-semibold text-encre text-lg">{t(`role${num}` as any)}</h4>
                        <div className="flex items-center gap-2 text-sm text-ardoise mt-2">
                          <MapPin className="w-4 h-4" />
                          <span>{t(`role${num}Loc` as any)}</span>
                        </div>
                      </div>
                      {slug ? (
                        <Link href={`/careers/${slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-emeraude hover:text-emeraude/80">
                          {t("viewRole")}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-ardoise/50">
                          Bientôt disponible
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Sales */}
              <div>
                <h3 className="text-xl font-bold text-encre mb-6 border-b border-fil pb-2">{t("rolesSales")}</h3>
                <div className="space-y-4">
                  {[
                    { num: 4, slug: "" },
                    { num: 5, slug: "" }
                  ].map(({num, slug}) => (
                    <div key={num} className="bg-white p-6 rounded-2xl border border-fil flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow hover:shadow-md">
                      <div>
                        <h4 className="font-semibold text-encre text-lg">{t(`role${num}` as any)}</h4>
                        <div className="flex items-center gap-2 text-sm text-ardoise mt-2">
                          <MapPin className="w-4 h-4" />
                          <span>{t(`role${num}Loc` as any)}</span>
                        </div>
                      </div>
                      {slug ? (
                        <Link href={`/careers/${slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-emeraude hover:text-emeraude/80">
                          {t("viewRole")}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-ardoise/50">
                          Bientôt disponible
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white border-t border-fil">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Briefcase className="w-16 h-16 text-emeraude mx-auto mb-8" />
            <h2 className="display-heading text-3xl text-encre sm:text-5xl mb-6">{t("ctaTitle")}</h2>
            <p className="text-lg text-ardoise mb-10 leading-relaxed max-w-2xl mx-auto">
              {t("ctaDesc")}
            </p>
            <a href="mailto:talents@payskool.africa" className="glow-btn inline-flex items-center gap-2 rounded-xl bg-emeraude px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-emeraude/90">
              {t("ctaBtn")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
