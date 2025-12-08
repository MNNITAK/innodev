import { CheckCircle, Circle } from "lucide-react";

function SimulationCheckpoints({ currentStep, compact = false }) {
  const steps = [
    { id: 1, label: "Upload Policy", key: "upload" },
    { id: 2, label: "Run Simulation", key: "simulate" },
    { id: 3, label: "Generate Report", key: "report" },
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "active";
    return "pending";
  };

  return (
    <div className={compact ? "w-full" : "w-full max-w-3xl mx-auto"}>
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div
          className={`absolute ${
            compact ? "top-3" : "top-5"
          } left-0 right-0 h-0.5 bg-white/10`}
        >
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          return (
            <div
              key={step.id}
              className="relative flex flex-col items-center z-10"
              style={{ flex: 1 }}
            >
              {/* Circle Icon */}
              <div
                className={`
                  ${
                    compact ? "w-6 h-6" : "w-10 h-10"
                  } rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    status === "completed"
                      ? "bg-green-500 text-white"
                      : status === "active"
                      ? "bg-white/10 text-white border-2 border-white"
                      : "bg-white/5 text-white/40 border-2 border-white/10"
                  }
                `}
              >
                {status === "completed" ? (
                  <CheckCircle className={compact ? "w-3 h-3" : "w-5 h-5"} />
                ) : (
                  <Circle className={compact ? "w-3 h-3" : "w-5 h-5"} />
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  ${
                    compact ? "mt-1 text-xs" : "mt-3 text-sm"
                  } font-medium transition-colors duration-300
                  ${
                    status === "completed" || status === "active"
                      ? "text-white"
                      : "text-white/40"
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SimulationCheckpoints;
