import { LogOut as LogOutIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogout } from "../../utils/logout.js";
import { useEffect, useState } from "react";
import SimulationCheckpoints from "./SimulationCheckpoints.jsx";

function DashboardHeader() {
  const [currentStep, setCurrentStep] = useState(3);

  useEffect(() => {
    // Check if we have completed simulation (dashboardHasRun should be true)
    const hasRun = window.sessionStorage.getItem("dashboardHasRun");
    if (hasRun === "true") {
      setCurrentStep(3); // All steps completed
    }
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search policies..."
          className="pl-9 bg-background"
        />
      </div>

      {/* Checkpoints in header center */}
      <div className="flex-1 max-w-md mx-6">
        <SimulationCheckpoints currentStep={currentStep} compact />
      </div>

      <div className="flex items-center gap-4">
        <Button className="gap-2" onClick={useLogout()}>
          <LogOutIcon className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default DashboardHeader;
