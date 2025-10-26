import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Logos from "@/components/landing/logos";
import FeatureGrid from "@/components/landing/feature-grid";
import LiveDemo from "@/components/landing/live-demo";
import TemplatesMarquee from "@/components/landing/templates-marquee";
import Steps from "@/components/landing/steps";
import Footer from "@/components/landing/footer";
import StickyCTA from "@/components/landing/sticky-cta";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Logos />
      <FeatureGrid />
      <LiveDemo />
      <TemplatesMarquee />
      <Steps />
      <Footer />
      <StickyCTA />
    </>
  );
}
