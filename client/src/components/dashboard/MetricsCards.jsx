
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, AlertTriangle, Minus } from "lucide-react";

import {usePdfUploadContext} from "./PdfUploadCard.jsx";

function MetricsCards() {
  const { result, uploading, error } = usePdfUploadContext();
  
  // Extract data from the orchestration result
  const dashboardData = result?.orchestrationResult;
  
  // Helper function to format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Create metrics array with real data
  const metrics = dashboardData ? [
    {
      label: "Overall Support",
      value: `${dashboardData.overallMetrics.support.percentage}%`,
      change: dashboardData.overallMetrics.support.trend || "+0%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      label: "Opposition", 
      value: `${dashboardData.overallMetrics.opposition.percentage}%`,
      change: dashboardData.overallMetrics.opposition.trend || "0%",
      trend: "down",
      icon: TrendingDown,
    },
    {
      label: "Neutral",
      value: `${dashboardData.overallMetrics.neutral.percentage}%`,
      change: dashboardData.overallMetrics.neutral.trend || "0%",
      trend: "neutral", 
      icon: Minus,
    },
    {
      label: "Population Simulated",
      value: formatNumber(dashboardData.overallMetrics.populationSimulated),
      change: `${dashboardData.metadata.totalPopulation} total`,
      trend: "neutral",
      icon: Users,
    },
    {
      label: "Risk Level",
      value: dashboardData.overallMetrics.riskLevel,
      change: dashboardData.overallMetrics.riskTrend || "Stable",
      trend: dashboardData.overallMetrics.riskLevel === "High" ? "warning" : 
             dashboardData.overallMetrics.riskLevel === "Medium" ? "warning" : "neutral",
      icon: AlertTriangle,
    },
  ] : [
    // Fallback data when no result is available
    {
      label: "Overall Support",
      value: "No data",
      change: "Upload PDF to analyze",
      trend: "neutral",
      icon: TrendingUp,
    },
    {
      label: "Opposition",
      value: "No data",
      change: "Upload PDF to analyze",
      trend: "neutral",
      icon: TrendingDown,
    },
    {
      label: "Neutral",
      value: "No data",
      change: "Upload PDF to analyze",
      trend: "neutral",
      icon: Minus,
    },
    {
      label: "Population Simulated",
      value: "No data",
      change: "Upload PDF to analyze",
      trend: "neutral",
      icon: Users,
    },
    {
      label: "Risk Level",
      value: "No data",
      change: "Upload PDF to analyze",
      trend: "neutral",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {uploading && (
        <div className="col-span-full text-center p-4">
          <p className="text-muted-foreground">Processing PDF and running analysis...</p>
        </div>
      )}
      {error && (
        <div className="col-span-full text-center p-4">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}
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
