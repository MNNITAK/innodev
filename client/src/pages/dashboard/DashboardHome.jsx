import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IndiaMap from "../../components/dashboard/IndiaMap.jsx";
import MetricsCards from "../../components/dashboard/MetricsCards.jsx";
import IndiaAnalytics from "../../components/dashboard/IndiaAnalytics.jsx";
import { PdfUploadCard } from "../../components/dashboard/PdfUploadCard.jsx";

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

      {/* IMPACT ANALYSIS PANEL BELOW BOTH COLUMNS */}
      <div className="pt-6 border-t border-zinc-800">
        <IndiaAnalytics />
      </div>
    </div>
  );
}

export default DashboardHome;
