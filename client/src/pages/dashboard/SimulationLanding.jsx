import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../utils/logout.js";
import WorldMapSimulation from "../../components/dashboard/WorldMapSimulation.jsx";
import { PdfUploadCard } from "../../components/dashboard/PdfUploadCard.jsx";
import SimulationCheckpoints from "../../components/dashboard/SimulationCheckpoints.jsx";
import { Button } from "@/components/ui/button";

function Simulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Simulate, 3: Report
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const handleLogout = useLogout();

  const handleUploadComplete = () => {
    // Move to step 2 when upload is complete
    setCurrentStep(2);
  };

  const goToDashboard = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(2); // Show "Running simulation" state

    try {
      // Read parsed PDF from sessionStorage (if already uploaded)
      const storedResult = window.sessionStorage.getItem("pdfResult");
      let pdfData = null;
      let policyName = "Policy Simulation Report";

      if (storedResult) {
        try {
          pdfData = JSON.parse(storedResult);
          // Extract policy name from the first line or use first 50 chars
          const firstLine = pdfData.text?.split("\n")[0] || "";
          policyName = firstLine.substring(0, 80) || "Policy Simulation Report";
          console.log("[Simulation] Using parsed PDF for fake API:", pdfData);
        } catch (e) {
          console.error("[Simulation] Failed to parse pdfResult:", e);
        }
      } else {
        console.log(
          "[Simulation] No pdfResult found, running simulation anyway"
        );
      }

      console.log(
        "[Simulation] Before setItem, dashboardHasRun =",
        window.sessionStorage.getItem("dashboardHasRun")
      );

      // ✅ Mark that simulation was started in this session
      window.sessionStorage.setItem("dashboardHasRun", "true");

      console.log(
        "[Simulation] After setItem, dashboardHasRun =",
        window.sessionStorage.getItem("dashboardHasRun")
      );

      // 🔮 Simulation backend call
      console.log("[Simulation] Running simulation...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Move to step 3 - generating report
      setCurrentStep(3);

      // Create report via backend API
      try {
        const response = await fetch("http://localhost:8000/api/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            policyName: policyName,
            pdfText: pdfData?.text || "",
          }),
        });

        const result = await response.json();
        console.log("[Simulation] Report created:", result);
      } catch (error) {
        console.error("[Simulation] Failed to create report:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, 400));

      console.log(
        "[Simulation] Fake simulation complete, navigating to /dashboard"
      );

      // Start transition animation
      setIsTransitioning(true);

      // Navigate after fade out
      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-background text-foreground transition-opacity duration-500 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Header */}
      <header className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-full max-w-5xl px-6">
        <nav className="flex h-14 items-center justify-between rounded-2xl border border-white/10 bg-[oklch(0.18_0_0)]/90 backdrop-blur-md px-6 shadow-lg shadow-black/20">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  fill="none"
                />
                <circle
                  cx="8"
                  cy="8"
                  r="2"
                  stroke="currentColor"
                  fill="none"
                  opacity="0.7"
                />
                <circle
                  cx="16"
                  cy="8"
                  r="2"
                  stroke="currentColor"
                  fill="none"
                  opacity="0.7"
                />
                <circle
                  cx="8"
                  cy="16"
                  r="2"
                  stroke="currentColor"
                  fill="none"
                  opacity="0.7"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="2"
                  stroke="currentColor"
                  fill="none"
                  opacity="0.7"
                />
                <path
                  d="M10 10 L12 12 M14 10 L12 12 M10 14 L12 12 M14 14 L12 12"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.5"
                />
              </svg>
            </div>
            <span className="text-sm font-medium tracking-[0.2em] uppercase text-white">
              CIVORA
            </span>
          </div>

          {/* Checkpoints in header center */}
          <div className="flex-1 max-w-md mx-6">
            <SimulationCheckpoints currentStep={currentStep} compact />
          </div>

          <button
            onClick={handleLogout}
            className="group/logout relative px-4 py-2 rounded-full text-sm font-medium text-white overflow-hidden transition-all duration-300 hover:scale-105"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-linear-to-r from-white/5 to-white/10 transition-all duration-300 group-hover/logout:from-white/10 group-hover/logout:to-white/15" />
            <div className="absolute inset-0 border border-white/15 rounded-full transition-colors duration-300 group-hover/logout:border-white/30" />

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/logout:translate-x-full transition-transform duration-1000" />

            <span className="relative">Log Out</span>
          </button>
        </nav>
      </header>

      {/* Background */}
      <WorldMapSimulation />

      {/* Main content area */}
      <div className="relative z-10 flex flex-col h-full px-4 pt-32 pb-8">
        {/* Compact upload section with elegant positioning */}
        <div className="w-full max-w-2xl mx-auto pb-8 mt-auto">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <PdfUploadCard
              onRun={goToDashboard}
              isRunning={isRunning}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Simulation;
