import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { value: "250+", label: "Synthetic Households" },
  { value: "50+", label: "Citizen Attributes" },
  { value: "28", label: "States & UTs Covered" },
  { value: "99.2%", label: "Prediction Accuracy" },
];

export function Stats() {
  return (
    <section className="border-y border-white/10 bg-[oklch(0.12_0_0)]/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
        {stats.map((stat, index) => {
          const { ref, isVisible } = useScrollAnimation({
            threshold: 0.3,
          });
          return (
            <div
              key={index}
              ref={ref}
              className={`flex flex-col items-center justify-center px-6 py-12 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-6 scale-95"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <span className="text-3xl font-bold text-[oklch(0.75_0.18_165)] md:text-4xl">
                {stat.value}
              </span>
              <span className="mt-2 text-center text-sm text-white/70">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
