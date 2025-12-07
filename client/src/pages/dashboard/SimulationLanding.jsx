import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../utils/logout.js";
import WorldMapSimulation from "../../components/dashboard/WorldMapSimulation.jsx";
import { PdfUploadCard } from "../../components/dashboard/PdfUploadCard.jsx";
import { Button } from "@/components/ui/button";

function Simulation() {
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();
  const handleLogout = useLogout();

  const goToDashboard = async () => {
    if (isRunning) return;
    setIsRunning(true);

    try {
      // Read parsed PDF from sessionStorage (if already uploaded)
      const storedResult = window.sessionStorage.getItem("pdfResult");
      let pdfData = null;

      if (storedResult) {
        try {
          pdfData = JSON.parse(storedResult);
          console.log("[Simulation] Using parsed PDF for fake API:", pdfData);
        } catch (e) {
          console.error("[Simulation] Failed to parse pdfResult:", e);
        }
      } else {
        console.log("[Simulation] No pdfResult found, running simulation anyway");
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

      // 🔮 Fake API call to a simulation backend
      console.log("[Simulation] Hitting fake /api/simulations/run endpoint...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // later you can replace this with:
      // const res = await fetch("/api/simulations/run", { method: "POST", body: JSON.stringify({ pdfData }) });

      console.log("[Simulation] Fake simulation complete, navigating to /dashboard");

      // Now go to dashboard
      navigate("/dashboard");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground">
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
                <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none" />
                <circle cx="8" cy="8" r="2" stroke="currentColor" fill="none" opacity="0.7" />
                <circle cx="16" cy="8" r="2" stroke="currentColor" fill="none" opacity="0.7" />
                <circle cx="8" cy="16" r="2" stroke="currentColor" fill="none" opacity="0.7" />
                <circle cx="16" cy="16" r="2" stroke="currentColor" fill="none" opacity="0.7" />
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

          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </nav>
      </header>

      {/* Background */}
      <WorldMapSimulation />

      {/* Center content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <PdfUploadCard onRun={goToDashboard} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
}

export default Simulation;
