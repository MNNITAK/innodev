import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IndiaMap from "../../components/dashboard/IndiaMap.jsx";
import MetricsCards from "../../components/dashboard/MetricsCards.jsx";
import { PdfUploadCard } from "../../components/dashboard/PdfUploadCard.jsx";
import IndiaAnalytics from "../../components/dashboard/IndiaAnalytics.jsx";
import { Button } from "../../components/ui/button.jsx";
import { BarChart3 } from "lucide-react";

function DashboardHome() {
  const [isRunning, setIsRunning] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [hasPolicyUploaded, setHasPolicyUploaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = window.sessionStorage.getItem("dashboardHasRun");
    if (stored !== "true") {
      navigate("/simulation");
      return;
    }

    // Check if policy has been uploaded
    const pdfResult = window.sessionStorage.getItem("pdfResult");
    setHasPolicyUploaded(!!pdfResult);

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
    <div className="relative w-full space-y-6 pb-12">
      {/* 1. HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Policy Simulation Dashboard
        </h1>
        <p className="text-zinc-400">
          Analyze public sentiment across India&apos;s states.
        </p>
      </div>

      {/* 2. BAR ON TOP (Metrics) */}
      <MetricsCards />

      {/* 3. MAIN CONTENT: Map (Left) & PDF Parser (Right) */}
      <div
        className={`flex flex-col ${
          !hasPolicyUploaded ? "xl:flex-row" : ""
        } gap-6`}
      >
        {/* LEFT COLUMN: MAP */}
        <div className="flex-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 min-h-[500px] h-full shadow-inner">
            <IndiaMap />
          </div>
        </div>

        {/* RIGHT COLUMN: PDF upload / memorandum parser - Only show if policy not uploaded */}
        {!hasPolicyUploaded && (
          <div className="w-full xl:w-1/3">
            <PdfUploadCard onRun={runSimulation} isRunning={isRunning} />
          </div>
        )}
      </div>

      {/* 4. ANALYTICS (Tabs Only) */}
      <div className="pt-6 border-t border-zinc-800">
        <IndiaAnalytics />
      </div>
    </div>
  );
}

export default DashboardHome;