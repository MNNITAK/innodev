
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, AlertTriangle } from "lucide-react";

const metrics = [
  {
    label: "Overall Support",
    value: "67.4%",
    change: "+2.3%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Opposition",
    value: "24.8%",
    change: "-1.2%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    label: "Population Simulated",
    value: "1.2M",
    change: "250 households",
    trend: "neutral",
    icon: Users,
  },
  {
    label: "Risk Level",
    value: "Medium",
    change: "3 states flagged",
    trend: "warning",
    icon: AlertTriangle,
  },
];

function MetricsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-1 text-2xl font-bold">{metric.value}</p>
              <p
                className={`mt-1 text-xs ${
                  metric.trend === "up"
                    ? "text-green-500"
                    : metric.trend === "down"
                    ? "text-red-500"
                    : metric.trend === "warning"
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              >
                {metric.change}
              </p>
            </div>
            <div
              className={`rounded-lg p-2 ${
                metric.trend === "up"
                  ? "bg-green-500/10"
                  : metric.trend === "down"
                  ? "bg-red-500/10"
                  : metric.trend === "warning"
                  ? "bg-accent/10"
                  : "bg-muted"
              }`}
            >
              <metric.icon
                className={`h-5 w-5 ${
                  metric.trend === "up"
                    ? "text-green-500"
                    : metric.trend === "down"
                    ? "text-red-500"
                    : metric.trend === "warning"
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default MetricsCards;
