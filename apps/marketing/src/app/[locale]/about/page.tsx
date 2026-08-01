import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { useTranslations } from "next-intl";
import { ShieldCheck, MapPin, Target, TrendingUp, Handshake, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

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
            <span className="inline-flex items-center rounded-full border border-emeraude/20 bg-emeraude/[0.06] px-3 py-1 text-xs font-medium text-emeraude mb-6">
              {t("heroEyebrow")}
            </span>
            <h1 className="display-heading text-4xl text-encre sm:text-5xl lg:text-6xl mx-auto max-w-4xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg text-ardoise max-w-2xl mx-auto leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Manifesto Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-encre">{t("manifestoEyebrow")}</h2>
            </div>
            <div className="space-y-6 text-lg text-ardoise leading-relaxed">
              <p>{t("manifestoP1")}</p>
              <p>{t("manifestoP2")}</p>
              <p className="font-medium text-encre">{t("manifestoP3")}</p>
            </div>
          </div>
        </section>

        {/* Commitments Section */}
        <section className="py-24 bg-craie">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-encre sm:text-4xl">{t("commitmentsTitle")}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-fil">
                <div className="w-12 h-12 bg-emeraude/10 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-emeraude" />
                </div>
                <h3 className="text-xl font-bold text-encre mb-3">{t("commitment1Title")}</h3>
                <p className="text-ardoise leading-relaxed">{t("commitment1Desc")}</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-fil">
                <div className="w-12 h-12 bg-emeraude/10 rounded-xl flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6 text-emeraude" />
                </div>
                <h3 className="text-xl font-bold text-encre mb-3">{t("commitment2Title")}</h3>
                <p className="text-ardoise leading-relaxed">{t("commitment2Desc")}</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-fil">
                <div className="w-12 h-12 bg-emeraude/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-emeraude" />
                </div>
                <h3 className="text-xl font-bold text-encre mb-3">{t("commitment3Title")}</h3>
                <p className="text-ardoise leading-relaxed">{t("commitment3Desc")}</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-fil">
                <div className="w-12 h-12 bg-emeraude/10 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-emeraude" />
                </div>
                <h3 className="text-xl font-bold text-encre mb-3">{t("commitment4Title")}</h3>
                <p className="text-ardoise leading-relaxed">{t("commitment4Desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-24 bg-encre text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold sm:text-4xl">{t("impactTitle")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              <div>
                <div className="text-5xl font-extrabold text-emeraude mb-4">{t("impact1Val")}</div>
                <h4 className="text-lg font-semibold mb-2">{t("impact1Title")}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{t("impact1Desc")}</p>
              </div>
              <div>
                <div className="text-5xl font-extrabold text-emeraude mb-4">{t("impact2Val")}</div>
                <h4 className="text-lg font-semibold mb-2">{t("impact2Title")}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{t("impact2Desc")}</p>
              </div>
              <div>
                <div className="text-5xl font-extrabold text-emeraude mb-4">{t("impact3Val")}</div>
                <h4 className="text-lg font-semibold mb-2">{t("impact3Title")}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{t("impact3Desc")}</p>
              </div>
              <div>
                <div className="text-5xl font-extrabold text-emeraude mb-4">{t("impact4Val")}</div>
                <h4 className="text-lg font-semibold mb-2">{t("impact4Title")}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{t("impact4Desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-craie">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Handshake className="w-16 h-16 text-emeraude mx-auto mb-8" />
            <h2 className="display-heading text-3xl text-encre sm:text-5xl mb-6">{t("ctaTitle")}</h2>
            <p className="text-lg text-ardoise mb-10 leading-relaxed max-w-2xl mx-auto">
              {t("ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#cta" className="glow-btn inline-flex items-center gap-2 rounded-xl bg-emeraude px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-emeraude/90 w-full sm:w-auto justify-center">
                {t("ctaBtn1")}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#cta" className="inline-flex items-center gap-2 rounded-xl bg-white border border-fil px-8 py-4 text-sm font-semibold text-encre transition-colors hover:bg-encre/[0.03] w-full sm:w-auto justify-center">
                {t("ctaBtn2")}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
