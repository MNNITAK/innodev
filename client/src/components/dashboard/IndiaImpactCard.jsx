import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Wallet,
  Smartphone,
  Trees,
  Bus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Reusable Components
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

// India-level analytics data
const INDIA_ANALYTICS = {
  socioEconomic: {
    title: "Socio-Economic",
    metrics: [
      {
        id: "income",
        label: "National Avg. Annual Income",
        type: "continuous",
        unit: "₹",
        oldValue: 125000,
        newValue: 138500,
        max: 250000,
      },
      {
        id: "poverty",
        label: "National Poverty Rate",
        type: "continuous",
        unit: "%",
        oldValue: 21.9,
        newValue: 18.7,
        max: 100,
        inverse: true,
      },
      {
        id: "employment",
        label: "Employment Distribution",
        type: "categorical",
        data: [
          { label: "Formal Sector", old: 32, new: 38 },
          { label: "Informal Sector", old: 52, new: 48 },
          { label: "Unemployed", old: 16, new: 14 },
        ],
      },
      {
        id: "literacy",
        label: "Literacy Rate",
        type: "continuous",
        unit: "%",
        oldValue: 77.7,
        newValue: 81.2,
        max: 100,
      },
    ],
  },
  health: {
    title: "Health",
    metrics: [
      {
        id: "healthcare",
        label: "Healthcare Access Index",
        type: "continuous",
        unit: "%",
        oldValue: 62.5,
        newValue: 71.3,
        max: 100,
      },
      {
        id: "infant",
        label: "Infant Mortality Rate",
        type: "continuous",
        unit: "/1000",
        oldValue: 28.3,
        newValue: 24.1,
        max: 100,
        inverse: true,
      },
      {
        id: "insurance",
        label: "Health Insurance Coverage",
        type: "continuous",
        unit: "%",
        oldValue: 34.2,
        newValue: 42.8,
        max: 100,
      },
      {
        id: "facilities",
        label: "Hospital Beds per 1000",
        type: "continuous",
        unit: "",
        oldValue: 0.7,
        newValue: 0.9,
        max: 5,
      },
    ],
  },
  digital: {
    title: "Digital Inclusion",
    metrics: [
      {
        id: "internet",
        label: "Internet Penetration",
        type: "continuous",
        unit: "%",
        oldValue: 54.3,
        newValue: 64.7,
        max: 100,
      },
      {
        id: "smartphone",
        label: "Smartphone Ownership",
        type: "continuous",
        unit: "%",
        oldValue: 46.2,
        newValue: 58.9,
        max: 100,
      },
      {
        id: "digital_literacy",
        label: "Digital Literacy Rate",
        type: "continuous",
        unit: "%",
        oldValue: 38.5,
        newValue: 49.3,
        max: 100,
      },
      {
        id: "ecommerce",
        label: "E-commerce Adoption",
        type: "continuous",
        unit: "%",
        oldValue: 28.7,
        newValue: 39.2,
        max: 100,
      },
    ],
  },
  environment: {
    title: "Environment",
    metrics: [
      {
        id: "aqi",
        label: "National Avg. Air Quality Index",
        type: "continuous",
        unit: "",
        oldValue: 132,
        newValue: 118,
        max: 500,
        inverse: true,
      },
      {
        id: "renewable",
        label: "Renewable Energy Share",
        type: "continuous",
        unit: "%",
        oldValue: 24.3,
        newValue: 31.7,
        max: 100,
      },
      {
        id: "forest",
        label: "Forest Cover",
        type: "continuous",
        unit: "%",
        oldValue: 21.7,
        newValue: 22.4,
        max: 100,
      },
      {
        id: "water",
        label: "Clean Water Access",
        type: "continuous",
        unit: "%",
        oldValue: 87.3,
        newValue: 92.1,
        max: 100,
      },
    ],
  },
  mobility: {
    title: "Mobility",
    metrics: [
      {
        id: "public_transport",
        label: "Public Transport Coverage",
        type: "continuous",
        unit: "%",
        oldValue: 42.8,
        newValue: 54.3,
        max: 100,
      },
      {
        id: "road_quality",
        label: "Road Quality Index",
        type: "continuous",
        unit: "%",
        oldValue: 58.4,
        newValue: 68.9,
        max: 100,
      },
      {
        id: "ev_adoption",
        label: "EV Adoption Rate",
        type: "continuous",
        unit: "%",
        oldValue: 2.8,
        newValue: 6.4,
        max: 50,
      },
      {
        id: "commute",
        label: "Avg. Commute Time",
        type: "continuous",
        unit: " min",
        oldValue: 47,
        newValue: 39,
        max: 120,
        inverse: true,
      },
    ],
  },
};

export default function IndiaImpactCard() {
  const [activeTab, setActiveTab] = useState("socioEconomic");
  const [isSimulated, setIsSimulated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSimulated(true), 500);
    return () => clearTimeout(timer);
  }, []);

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
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              National Impact Analytics - India
            </CardTitle>
            <CardDescription>
              Pre vs. Post Policy Factor Analysis (Nationwide)
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
              const category = INDIA_ANALYTICS[key];
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
              const category = INDIA_ANALYTICS[key];
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
                          Based on nationwide simulation parameters
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                        High Confidence
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
                      AI Insight for India
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The policy demonstrates nationwide impact across all{" "}
                      {category.title.toLowerCase()} parameters. Key metrics
                      indicate {category.metrics[0]?.label.toLowerCase()} as the
                      primary driver of change.
                      {key === "mobility" &&
                        " Improved mobility infrastructure will enhance connectivity across urban and rural areas."}
                      {key === "digital" &&
                        " Digital transformation is accelerating across all demographics and regions."}
                      {key === "health" &&
                        " Healthcare accessibility and quality improvements are reaching underserved populations."}
                      {key === "socioEconomic" &&
                        " Economic growth is becoming more inclusive with reduced inequality."}
                      {key === "environment" &&
                        " Environmental sustainability measures show positive trends in air quality and renewable adoption."}
                    </p>
                  </div>
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
