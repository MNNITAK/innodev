import { useState, useEffect } from "react";

import WorldMapSimulation from "../../components/dashboard/WorldMapSimulation.jsx";
import IndiaMap from "../../components/dashboard/IndiaMap.jsx";
import MetricsCards from "../../components/dashboard/MetricsCards.jsx";
import PolicySelector from "../../components/dashboard/PolicySelector.jsx";
import DemographicBreakdown from "../../components/dashboard/DemographicBreakdown.jsx";
import OpinionTimeline from "../../components/dashboard/OpinionTimeline.jsx";

function DashboardHome() {
  const [selectedPolicy, setSelectedPolicy] = useState("digital");
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Load state from THIS session only
  useEffect(() => {
    const stored = window.sessionStorage.getItem("dashboardHasRun");
    if (stored === "true") {
      setHasRun(true);
    }
    setLoadingInitial(false);
  }, []);

  const runSimulation = async () => {
    if (isRunning) return;

    setIsRunning(true);

    try {
      // 🔮 Dummy delay (simulate backend)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 🧠 Later replace with real backend
      // const response = await fetch("/api/simulations/run", { ... });
      // const data = await response.json();
      // update charts/maps with data

      // Mark simulation as completed THIS session
      setHasRun(true);
      window.sessionStorage.setItem("dashboardHasRun", "true");

    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // Avoid flicker while reading sessionStorage
  if (loadingInitial) return null;


  // BEFORE FIRST SIMULATION → World map background + centered selector
  if (!hasRun) {
    return (
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
        {/* Background world simulation */}
        <WorldMapSimulation />

        {/* Centered simulation selector */}
        <div className="relative z-10 w-full max-w-md px-4 animate-in fade-in zoom-in duration-500 ">
          <PolicySelector
            selectedPolicy={selectedPolicy}
            onChangePolicy={setSelectedPolicy}
            onRun={runSimulation}
            isRunning={isRunning}
            hasRun={hasRun}
          />
        </div>
      </div>
    );
  }


  // AFTER FIRST SIMULATION → Full Dashboard
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

      {/* Top controls */}
      <PolicySelector
        selectedPolicy={selectedPolicy}
        onChangePolicy={setSelectedPolicy}
        onRun={runSimulation}
        isRunning={isRunning}
        hasRun={hasRun}
      />

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
