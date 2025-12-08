import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Wallet,
  Smartphone,
  Trees,
  Bus,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INDIAN_STATES, ALL_STATES_ANALYTICS } from "@/data/statesData";

// Reusable Components (same as IndiaAnalytics)
const ContinuousBar = ({
  label,
  oldVal,
  newVal,
  unit,
  max,
  inverse = false,
}) => {
  const diff = newVal - oldVal;
  const isPositiveChange = diff > 0;
  const isImprovement = inverse ? diff < 0 : diff > 0;

  const oldPercent = (oldVal / max) * 100;
  const newPercent = (newVal / max) * 100;
  const diffWidth = Math.abs(newPercent - oldPercent);

  const diffColor = isImprovement ? "bg-emerald-500" : "bg-rose-500";
  const textColor = isImprovement ? "text-emerald-400" : "text-rose-400";
  const Icon = isImprovement
    ? inverse
      ? TrendingDown
      : TrendingUp
    : inverse
    ? TrendingUp
    : TrendingDown;

  return (
    <div className="group mb-5">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-sm font-medium text-white/90">{label}</p>
          <div className="flex items-center gap-2 text-xs text-white/50 font-mono mt-0.5">
            <span>
              PRE: {oldVal.toLocaleString()}
              {unit}
            </span>
            <span>→</span>
            <span className="text-white/80">
              POST: {newVal.toLocaleString()}
              {unit}
            </span>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-bold ${textColor}`}
        >
          <Icon className="h-4 w-4" />
          {Math.abs(diff).toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}
          {unit}
        </div>
      </div>

      <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden relative">
        {isPositiveChange ? (
          <div className="h-full flex items-center w-full">
            <div
              className="h-full bg-white/80 transition-all duration-1000 ease-out"
              style={{ width: `${oldPercent}%` }}
            />
            <div
              className={`h-full ${
                isImprovement ? "bg-emerald-500" : "bg-rose-500"
              } relative animate-pulse-subtle`}
              style={{ width: `${diffWidth}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center w-full">
            <div
              className="h-full bg-white/80 transition-all duration-1000 ease-out"
              style={{ width: `${newPercent}%` }}
            />
            <div
              className={`h-full ${
                isImprovement ? "bg-emerald-500/50" : "bg-rose-500"
              } relative opacity-80`}
              style={{ width: `${diffWidth}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const CategoricalBar = ({ label, data }) => {
  const sortedData = [...data].sort(
    (a, b) => Math.abs(b.new - b.old) - Math.abs(a.new - a.old)
  );
  const primaryShift = sortedData[0];
  const diff = primaryShift.new - primaryShift.old;

  return (
    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-white/90">{label}</p>
        <span className="text-[10px] uppercase tracking-wider text-white/40">
          Distribution Shift
        </span>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const change = item.new - item.old;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/70">{item.label}</span>
                <div className="flex gap-2 font-mono">
                  <span className="text-white/40">{item.old}%</span>
                  <span
                    className={cn(
                      change > 0
                        ? "text-emerald-400"
                        : change < 0
                        ? "text-rose-400"
                        : "text-white/40"
                    )}
                  >
                    {item.new}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden flex relative">
                <div
                  className="absolute h-full w-0.5 bg-white/30 z-10"
                  style={{ left: `${item.old}%` }}
                />
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    change > 0 ? "bg-emerald-500" : "bg-white/60"
                  )}
                  style={{ width: `${item.new}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function StateAnalytics() {
  const { stateCode } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("socioEconomic");
  const [isSimulated, setIsSimulated] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Find state info
  const stateInfo = INDIAN_STATES.find(
    (s) => s.code === stateCode?.toUpperCase()
  );

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!stateCode) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/analytics/states/${stateCode}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch state analytics");
        }

        const result = await response.json();

        if (result.success) {
          setAnalyticsData(result.data.analytics);
          setError(null);
        } else {
          throw new Error(result.message || "Failed to load analytics");
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.message);
        // Fallback to mock data if API fails
        const mockData = ALL_STATES_ANALYTICS[stateCode.toUpperCase()];
        if (mockData) {
          setAnalyticsData(mockData);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const timer = setTimeout(() => setIsSimulated(true), 500);
    return () => clearTimeout(timer);
  }, [stateCode]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stateInfo || !analyticsData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {error || "State Not Found"}
          </h2>
          <Button onClick={() => navigate("/dashboard/analytics")}>
            Back to Analytics
          </Button>
        </div>
      </div>
    );
  }

  const categories = [
    "socioEconomic",
    "health",
    "digital",
    "environment",
    "mobility",
  ];
  const iconMap = {
    socioEconomic: Wallet,
    health: Activity,
    digital: Smartphone,
    environment: Trees,
    mobility: Bus,
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/analytics")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Analytics
          </Button>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              <h1 className="text-3xl font-bold text-white">
                {stateInfo.name}
              </h1>
            </div>
            <p className="text-sm text-white/60 mt-1">
              {stateInfo.type} • Capital: {stateInfo.capital}
            </p>
          </div>
        </div>
      </div>

      {/* Main Analytics Card */}
      <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Impact Analytics - {stateInfo.name}
              </CardTitle>
              <CardDescription>
                Pre vs. Post Policy Factor Analysis
              </CardDescription>
            </div>
            <div className="text-xs text-white/40">
              Last Updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            {/* Tabs */}
            <TabsList className="w-full justify-start bg-black/20 p-1 mb-6 overflow-x-auto no-scrollbar">
              {categories.map((key) => {
                const CategoryIcon = iconMap[key];
                const category = analyticsData[key];
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex-1 gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    <CategoryIcon className="h-4 w-4" />
                    {category.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
              {categories.map((key) => {
                const category = analyticsData[key];
                const CategoryIcon = iconMap[key];

                return (
                  <TabsContent
                    key={key}
                    value={key}
                    className="mt-0 focus-visible:outline-none"
                  >
                    {/* Summary Header */}
                    <div className="mb-6 flex items-center justify-between rounded-lg bg-white/5 p-4 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-accent/20 text-accent">
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            Projected Impact
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Based on {stateInfo.name} simulation parameters
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                          Moderate Confidence
                        </span>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-2">
                      {category.metrics.map((metric) => {
                        if (metric.type === "categorical") {
                          return (
                            <CategoricalBar
                              key={metric.id}
                              label={metric.label}
                              data={metric.data}
                            />
                          );
                        }

                        return (
                          <ContinuousBar
                            key={metric.id}
                            label={metric.label}
                            unit={metric.unit}
                            oldVal={metric.oldValue}
                            newVal={
                              isSimulated ? metric.newValue : metric.oldValue
                            }
                            max={metric.max}
                            inverse={metric.inverse}
                          />
                        );
                      })}
                    </div>

                    {/* AI Insight */}
                    <div className="mt-8 pt-4 border-t border-white/10">
                      <h5 className="text-sm font-medium mb-2 text-white/60">
                        AI Insight for {stateInfo.name}
                      </h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The policy shows regional adaptation for{" "}
                        {stateInfo.name} with focus on{" "}
                        {category.title.toLowerCase()} improvements. Key metrics
                        indicate {category.metrics[0]?.label.toLowerCase()} as
                        the primary impact driver.
                        {key === "mobility" &&
                          ` ${stateInfo.name} shows unique mobility patterns requiring targeted interventions.`}
                        {key === "digital" &&
                          ` Digital infrastructure development is crucial for ${stateInfo.name}'s growth trajectory.`}
                        {key === "health" &&
                          ` Healthcare accessibility remains a priority for ${stateInfo.name}.`}
                      </p>
                    </div>
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
