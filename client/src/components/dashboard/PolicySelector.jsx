import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, RefreshCw } from "lucide-react";

const policies = [
  { id: "gst", name: "GST Implementation" },
  { id: "farm", name: "Farm Bills 2020" },
  { id: "caa", name: "Citizenship Amendment Act" },
  { id: "reservation", name: "Reservation Policy Changes" },
  { id: "digital", name: "Digital India Initiative" },
];

function PolicySelector({
  selectedPolicy,
  onChangePolicy,
  onRun,
  isRunning,
  hasRun,
}) {
  return (
    <Card className="mb-6 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-2 block text-sm font-medium">
            Select Policy
          </label>
          <Select value={selectedPolicy} onValueChange={onChangePolicy}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a policy" />
            </SelectTrigger>
            <SelectContent>
              {policies.map((policy) => (
                <SelectItem key={policy.id} value={policy.id}>
                  {policy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-6">
          <Button
            onClick={onRun}
            disabled={isRunning}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {hasRun ? "Run Another Simulation" : "Run Simulation"}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default PolicySelector;
