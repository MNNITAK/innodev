import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IndiaMap from "../../components/dashboard/IndiaMap.jsx";
import MetricsCards from "../../components/dashboard/MetricsCards.jsx";
import { PdfUploadCard } from "../../components/dashboard/PdfUploadCard.jsx";
import { Button } from "../../components/ui/button.jsx";
import { BarChart3 } from "lucide-react";

function DashboardHome() {
  const [isRunning, setIsRunning] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = window.sessionStorage.getItem("dashboardHasRun");
    if (stored !== "true") {
      navigate("/simulation");
      return;
    }
    setLoadingInitial(false);
  }, [navigate]);

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  if (loadingInitial) return null;

  return (
    <div className="relative w-full space-y-8 pb-12">
      {/* TOP SECTION: LEFT (header + metrics + map) & RIGHT (PDF parser) */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* LEFT COLUMN */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Policy Simulation Dashboard
            </h1>
            <p className="text-zinc-400">
              Analyze public sentiment across India&apos;s states.
            </p>
          </div>

          {/* Metrics row */}
          <MetricsCards />

          {/* India heatmap just below metrics, narrower and card-like */}
          <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 min-h-[340px]">
            <IndiaMap />
          </div>
        </div>

        {/* RIGHT COLUMN: PDF upload / memorandum parser */}
        <div className="w-full xl:w-1/3">
          <PdfUploadCard onRun={runSimulation} isRunning={isRunning} />
        </div>
      </div>

      {/* CALL TO ACTION - Navigate to State Analytics */}
      <div className="pt-6 border-t border-zinc-800">
        <div className="bg-linear-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-accent/20">
              <BarChart3 className="h-8 w-8 text-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Detailed State-wise Impact Analysis
          </h2>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Explore comprehensive impact analytics across all 28 states and
            union territories. Analyze socio-economic, health, digital
            inclusion, environmental, and mobility metrics.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/dashboard/analytics")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            View State Analytics →
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
