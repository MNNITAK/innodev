import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const technologies = [
  { name: "Node.js", category: "Backend" },
  { name: "Express.js", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "React", category: "Frontend" },
  { name: "Langchain", category: "AI/ML" },
  { name: "Docker", category: "DevOps" },
];

export function Technologies() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  return (
    <section id="technology" className="py-24">
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
            Built with <span className="text-[oklch(0.75_0.18_165)]">Modern Tech</span>
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">
            Powered by cutting-edge technologies and statistical models
            including DeGroot Consensus and Hegselmann-Krause models.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {technologies.map((tech, index) => {
            const { ref, isVisible } = useScrollAnimation({
              threshold: 0.2,
              rootMargin: "0px 0px -50px 0px",
            });
            return (
              <div
                key={index}
                ref={ref}
                className={`rounded-full border border-white/10 bg-[oklch(0.15_0_0)]/50 backdrop-blur-sm px-6 py-3 text-sm transition-all hover:border-[oklch(0.75_0.18_165)]/50 hover:bg-[oklch(0.18_0_0)]/70 ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95"
                }`}
                style={{
                  transitionDelay: `${index * 80}ms`,
                  transitionDuration: "500ms",
                }}
              >
                <span className="font-medium text-white">{tech.name}</span>
                <span className="ml-2 text-white/60">
                  • {tech.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
