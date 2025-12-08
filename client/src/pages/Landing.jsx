import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how_it_works";
import { Technologies } from "@/components/landing/technologies";
import { CTA } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Central Glowing Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Technologies />
        <CTA />
      </div>
    </div>
  );
}
