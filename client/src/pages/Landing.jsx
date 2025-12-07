import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how_it_works";
import { Technologies } from "@/components/landing/technologies";
import { CTA } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Technologies />
      <CTA />
    </div>
  );
}
