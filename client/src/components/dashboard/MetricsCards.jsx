import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, AlertTriangle, Activity } from "lucide-react";

const defaultMetrics = [
  { label: "Overall Support", value: "67.4%", change: "+2.3%", trend: "up", icon: TrendingUp },
  { label: "Opposition", value: "24.8%", change: "-1.2%", trend: "down", icon: TrendingDown },
  { label: "Population Simulated", value: "1.2M", change: "250 households", trend: "neutral", icon: Users },
  { label: "Risk Level", value: "Medium", change: "Stable", trend: "warning", icon: AlertTriangle },
];

function MetricsCards({ data }) {
  // If data is provided, map it to the UI structure, otherwise use default
  const displayMetrics = data ? [
    { 
      label: data[0].label, 
      value: data[0].value, 
      change: data[0].change, 
      trend: data[0].trend, 
      icon: Activity 
    },
    { 
      label: data[1].label, 
      value: data[1].value, 
      change: data[1].change, 
      trend: data[1].trend, 
      icon: AlertTriangle 
    },
    { 
      label: data[2].label, 
      value: data[2].value, 
      change: data[2].change, 
      trend: data[2].trend, 
      icon: TrendingUp 
    },
    { 
      label: data[3].label, 
      value: data[3].value, 
      change: data[3].change, 
      trend: data[3].trend, 
      icon: Users 
    },
  ] : defaultMetrics;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {displayMetrics.map((metric, idx) => (
        <Card key={idx} className="p-4 border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{metric.value}</p>
              <p className={`mt-1 text-xs font-medium flex items-center gap-1 ${
                metric.trend === "up" ? "text-emerald-400" : 
                metric.trend === "down" ? "text-rose-400" : 
                metric.trend === "warning" ? "text-amber-400" : "text-muted-foreground"
              }`}>
              </p>
            </div>
            <div className={`rounded-lg p-2.5 ${
                metric.trend === "up" ? "bg-emerald-500/10 text-emerald-500" : 
                metric.trend === "down" ? "bg-rose-500/10 text-rose-500" : 
                metric.trend === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-white/10 text-white/60"
            }`}>
              <metric.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default MetricsCards;