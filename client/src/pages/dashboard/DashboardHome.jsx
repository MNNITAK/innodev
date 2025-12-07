import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IndiaMap from "../../components/dashboard/IndiaMap.jsx";
import MetricsCards from "../../components/dashboard/MetricsCards.jsx";
import DemographicBreakdown from "../../components/dashboard/DemographicBreakdown.jsx";
import OpinionTimeline from "../../components/dashboard/OpinionTimeline.jsx";
import { PdfUploadCard } from "../../components/dashboard/PdfUploadCard.jsx";

function DashboardHome() {
  const [isRunning, setIsRunning] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = window.sessionStorage.getItem("dashboardHasRun");
    if (stored !== "true") {
      // If user somehow hits /dashboard without running simulation, send back
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
      // could refresh charts from backend here later
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  if (loadingInitial) return null;

  return (
    <div className="relative h-full w-full overflow-auto p-6">
      {/* Header text */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Policy Simulation Dashboard</h1>
          <p className="text-muted-foreground">
            Analyze public sentiment across India&apos;s states and demographics
          </p>
        </div>
      </div>

      <div className="mb-6">
        <PdfUploadCard onRun={runSimulation} isRunning={isRunning} />
      </div>

      {/* Metrics */}
      <MetricsCards />

      {/* Main content: India Map + right-side panels */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IndiaMap />
        </div>

        <div className="space-y-6">
          <DemographicBreakdown />
          <OpinionTimeline />
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
