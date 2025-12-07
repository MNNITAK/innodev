import { Users, Brain, BarChart3, Network } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Users,
    title: "Population Modeling",
    description:
      "Synthetic citizens modeled using actual 2021 Census of India data with 50+ attributes per citizen including age, gender, caste, religion, income, education, and more.",
  },
  {
    icon: Network,
    title: "Opinion Dynamics",
    description:
      "Multi-round evolution using DeGroot model with bounded confidence for realistic opinion patterns and convergence analysis of opinion stabilization.",
  },
  {
    icon: Brain,
    title: "Intelligent Analysis",
    description:
      "Rule-based cognitive model with economic calculator for direct/indirect costs. No LLM reliance means fast, offline, and reproducible results.",
  },
  {
    icon: BarChart3,
    title: "Comprehensive Reports",
    description:
      "Demographic support/opposition breakdown, geographic analysis, polarization metrics, risk assessments, and actionable recommendations.",
  },
];

export function Features() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div
          ref={sectionRef}
          className={`mb-16 text-center transition-all duration-700 ${
            sectionVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl text-white">
            Powerful <span className="text-[oklch(0.75_0.18_165)]">Features</span>
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">
            Everything you need to simulate policy outcomes and understand
            public sentiment before real-world deployment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => {
            const { ref, isVisible } = useScrollAnimation({
              threshold: 0.2,
              rootMargin: "0px 0px -50px 0px",
            });
            return (
              <div
                key={index}
                ref={ref}
                className={`group rounded-xl border border-white/10 bg-[oklch(0.15_0_0)]/50 backdrop-blur-sm p-8 transition-all hover:border-[oklch(0.75_0.18_165)]/50 hover:bg-[oklch(0.18_0_0)]/70 shadow-lg shadow-black/20 ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  transitionDuration: "600ms",
                }}
              >
                <div className="mb-4 inline-flex rounded-lg bg-[oklch(0.75_0.18_165)]/20 p-3">
                  <feature.icon className="h-6 w-6 text-[oklch(0.75_0.18_165)]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
