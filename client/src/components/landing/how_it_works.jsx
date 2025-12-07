import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    number: "01",
    title: "Define Policy",
    description:
      "Input your proposed policy with parameters like affected demographics, economic impact areas, and implementation timeline.",
  },
  {
    number: "02",
    title: "Generate Population",
    description:
      "Our system creates synthetic citizens with realistic parameters spanning demographics, socioeconomic status, and behavioral traits.",
  },
  {
    number: "03",
    title: "Run Simulation",
    description:
      "Each virtual citizen processes the policy through our multi-layered cognitive model analyzing economic impact and social identity.",
  },
  {
    number: "04",
    title: "Analyze Results",
    description:
      "Get comprehensive reports with support percentages, demographic breakdowns, risk assessments, and actionable recommendations.",
  },
];

export function HowItWorks() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  return (
    <section id="how-it-works" className="bg-[oklch(0.10_0_0)]/30 py-24">
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
            How It <span className="text-[oklch(0.75_0.18_165)]">Works</span>
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">
            From policy input to actionable insights in four simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const { ref, isVisible } = useScrollAnimation({
              threshold: 0.2,
              rootMargin: "0px 0px -50px 0px",
            });
            return (
              <div
                key={index}
                ref={ref}
                className={`relative transition-all duration-600 ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <span className="text-6xl font-bold text-[oklch(0.75_0.18_165)]/20">
                  {step.number}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/70">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-px w-12 bg-white/10 lg:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
