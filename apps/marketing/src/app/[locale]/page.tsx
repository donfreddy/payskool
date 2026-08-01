import { BeforeAfter } from "@/components/landing/before-after";
import { BottomCta } from "@/components/landing/bottom-cta";
import { Comparison } from "@/components/landing/comparison";
import { Faq } from "@/components/landing/faq";
import { FeaturesParents } from "@/components/landing/features-parents";
import { FeaturesSchool } from "@/components/landing/features-school";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Metrics } from "@/components/landing/metrics";
import { Nav } from "@/components/landing/nav";
import { Partners } from "@/components/landing/partners";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Partners />
        <Metrics />
        <Testimonials />
        <FeaturesSchool />
        <FeaturesParents />
        <BeforeAfter />
        <HowItWorks />
        <Comparison />
        <Pricing />
        <Faq />
        <BottomCta />
      </main>
      <Footer />
    </>
  );
}
