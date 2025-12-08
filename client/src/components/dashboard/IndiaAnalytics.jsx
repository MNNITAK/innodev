import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity, 
  Wallet, 
  Smartphone, 
  Trees, 
  Bus 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- DUMMY DATA ---
// Represents state BEFORE and AFTER a hypothetical policy implementation
const ANALYTICS_DATA = {
  socioEconomic: {
    title: "Socio-Economic",
    icon: Wallet,
    metrics: [
      {
        id: "income",
        label: "Avg. Annual Income",
        type: "continuous",
        unit: "₹",
        oldValue: 125000,
        newValue: 132500,
        max: 200000, // for scaling
      },
      {
        id: "poverty",
        label: "Poverty Line Rate",
        type: "continuous",
        unit: "%",
        oldValue: 22.4,
        newValue: 19.8,
        max: 100,
        inverse: true, // Lower is better
      },
      {
        id: "employment",
        label: "Employment Distribution",
        type: "categorical",
        data: [
          { label: "Formal", old: 18, new: 22 },
          { label: "Informal", old: 45, new: 42 },
          { label: "Agriculture", old: 28, new: 28 },
          { label: "Unemployed", old: 9, new: 8 },
        ],
      },
    ],
  },
  health: {
    title: "Health & Nutrition",
    icon: Activity,
    metrics: [
      {
        id: "access",
        label: "Healthcare Access Index",
        type: "ordinal", // 1-100 scale treated as continuous bar
        unit: "/100",
        oldValue: 58,
        newValue: 65,
        max: 100,
      },
      {
        id: "stunting",
        label: "Child Stunting Rate",
        type: "continuous",
        unit: "%",
        oldValue: 32.1,
        newValue: 31.8,
        max: 50,
        inverse: true,
      },
      {
        id: "disease",
        label: "Disease Risk Score",
        type: "continuous",
        unit: "/100",
        oldValue: 45,
        newValue: 42,
        max: 100,
        inverse: true,
      },
    ],
  },
  digital: {
    title: "Digital Inclusion",
    icon: Smartphone,
    metrics: [
      {
        id: "internet",
        label: "Internet Penetration",
        type: "continuous",
        unit: "%",
        oldValue: 45,
        newValue: 62,
        max: 100,
      },
      {
        id: "literacy",
        label: "Digital Literacy Level",
        type: "ordinal",
        unit: "Scale (1-5)",
        oldValue: 2.8,
        newValue: 3.4,
        max: 5,
      },
      {
        id: "services",
        label: "Digital Service Access",
        type: "categorical",
        data: [
          { label: "High", old: 15, new: 25 },
          { label: "Medium", old: 30, new: 35 },
          { label: "Low", old: 55, new: 40 },
        ],
      },
    ],
  },
  environment: {
    title: "Environment",
    icon: Trees,
    metrics: [
      {
        id: "aqi",
        label: "Avg. AQI Exposure",
        type: "continuous",
        unit: "AQI",
        oldValue: 145,
        newValue: 138,
        max: 300,
        inverse: true,
      },
      {
        id: "green_space",
        label: "Green Space Access",
        type: "continuous",
        unit: "%",
        oldValue: 12,
        newValue: 12.5, // Slow change
        max: 100,
      },
    ],
  },
  mobility: {
    title: "Mobility",
    icon: Bus,
    metrics: [
      {
        id: "commute",
        label: "Avg. Commute Time",
        type: "continuous",
        unit: "min",
        oldValue: 45,
        newValue: 40,
        max: 120,
        inverse: true,
      },
      {
        id: "public_transport",
        label: "Public Transport Usage",
        type: "continuous",
        unit: "%",
        oldValue: 35,
        newValue: 48, // Big jump implies policy success
        max: 100,
      },
    ],
  },
};

// --- SUB-COMPONENTS ---

// 1. Continuous Data Bar (The White + Green/Red Line Logic)
const ContinuousBar = ({ label, oldVal, newVal, unit, max, inverse = false }) => {
  const diff = newVal - oldVal;
  const isPositiveChange = diff > 0;
  
  // Logical improvement check (accounting for inverse metrics like poverty/pollution)
  const isImprovement = inverse ? diff < 0 : diff > 0;
  
  const oldPercent = (oldVal / max) * 100;
  const newPercent = (newVal / max) * 100;
  
  // Calculate widths for the stacked visual
  // If increasing: [  Base (Old)  ][  Diff (Green)  ]
  // If decreasing: [  Base (New)  ][  Diff (Red)    ][ Empty (Old-New) ] - wait, visuals need to show "what was lost"
  // Better visual for decrease: [  Base (New)  ][  Diff (Red)  ] -> Total width matches Old Value
  
  const barWidth = Math.max(oldPercent, newPercent);
  const baseWidth = Math.min(oldPercent, newPercent);
  const diffWidth = Math.abs(newPercent - oldPercent);

  // Color logic
  const diffColor = isImprovement ? "bg-emerald-500" : "bg-rose-500";
  const textColor = isImprovement ? "text-emerald-400" : "text-rose-400";
  const Icon = isImprovement ? (inverse ? TrendingDown : TrendingUp) : (inverse ? TrendingUp : TrendingDown);

  return (
    <div className="group mb-5">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-sm font-medium text-white/90">{label}</p>
          <div className="flex items-center gap-2 text-xs text-white/50 font-mono mt-0.5">
            <span>PRE: {oldVal.toLocaleString()}{unit}</span>
            <span>→</span>
            <span className="text-white/80">POST: {newVal.toLocaleString()}{unit}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold ${textColor}`}>
           <Icon className="h-4 w-4" />
           {Math.abs(diff).toLocaleString(undefined, { maximumFractionDigits: 1 })}{unit}
        </div>
      </div>

      {/* Track */}
      <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden relative">
        {/* Scenario A: Increase (Old -> New) */}
        {isPositiveChange ? (
          <div className="h-full flex items-center w-full">
            {/* Base (White) */}
            <div 
              className="h-full bg-white/80 transition-all duration-1000 ease-out"
              style={{ width: `${oldPercent}%` }}
            />
            {/* Added Value (Green/Red based on goodness) */}
            <div 
              className={`h-full ${isImprovement ? 'bg-emerald-500' : 'bg-rose-500'} relative animate-pulse-subtle`}
              style={{ width: `${diffWidth}%` }}
            >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        ) : (
          // Scenario B: Decrease (Old -> New)
          <div className="h-full flex items-center w-full">
             {/* New Base (White) */}
             <div 
              className="h-full bg-white/80 transition-all duration-1000 ease-out"
              style={{ width: `${newPercent}%` }}
            />
             {/* Lost Value (Red/Green based on goodness) - e.g. Poverty decreased (Good/Green) */}
             <div 
              className={`h-full ${isImprovement ? 'bg-emerald-500/50' : 'bg-rose-500'} relative opacity-80`}
              style={{ width: `${diffWidth}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Categorical Distribution Bar
const CategoricalBar = ({ label, data }) => {
  // Find biggest change to highlight
  const sortedData = [...data].sort((a, b) => Math.abs(b.new - b.old) - Math.abs(a.new - a.old));
  const primaryShift = sortedData[0];
  const diff = primaryShift.new - primaryShift.old;
  const isPositive = diff > 0;

  return (
    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-white/90">{label}</p>
        <span className="text-[10px] uppercase tracking-wider text-white/40">Distribution Shift</span>
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
                  <span className={cn(
                    change > 0 ? "text-emerald-400" : change < 0 ? "text-rose-400" : "text-white/40"
                  )}>
                    {item.new}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden flex relative">
                {/* Old Marker (Ghost) */}
                <div 
                  className="absolute h-full w-0.5 bg-white/30 z-10"
                  style={{ left: `${item.old}%` }}
                />
                {/* New Value Bar */}
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

// --- MAIN COMPONENT ---

export default function IndiaAnalytics() {
  const [activeTab, setActiveTab] = useState("socioEconomic");
  const [isSimulated, setIsSimulated] = useState(false);

  // Simulate "Policy Implementation" animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsSimulated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const categories = Object.keys(ANALYTICS_DATA);

  return (
    <Card className="h-full border-white/10 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Impact Analytics
            </CardTitle>
            <CardDescription>
              Pre vs. Post Policy Factor Analysis
            </CardDescription>
          </div>
          
          {/* Category Selector for Mobile */}
          <div className="md:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((key) => (
                  <SelectItem key={key} value={key}>
                    {ANALYTICS_DATA[key].title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Desktop Tabs */}
          <TabsList className="hidden md:flex w-full justify-start bg-black/20 p-1 mb-6 overflow-x-auto no-scrollbar">
            {categories.map((key) => {
              const CategoryIcon = ANALYTICS_DATA[key].icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex-1 gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <CategoryIcon className="h-4 w-4" />
                  {ANALYTICS_DATA[key].title}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
            {categories.map((key) => {
              const category = ANALYTICS_DATA[key];
              return (
                <TabsContent key={key} value={key} className="mt-0 focus-visible:outline-none">
                  {/* Summary Header for Section */}
                  <div className="mb-6 flex items-center justify-between rounded-lg bg-white/5 p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-accent/20 text-accent">
                        <category.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Projected Impact</h4>
                        <p className="text-xs text-muted-foreground">Based on current simulation parameters</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                         High Confidence
                       </span>
                    </div>
                  </div>

                  {/* Render Metrics */}
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
                      
                      // Default to Continuous/Ordinal Bar
                      return (
                        <ContinuousBar
                          key={metric.id}
                          label={metric.label}
                          unit={metric.unit}
                          oldVal={metric.oldValue}
                          newVal={isSimulated ? metric.newValue : metric.oldValue} // Animate from old to new
                          max={metric.max}
                          inverse={metric.inverse}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10">
                    <h5 className="text-sm font-medium mb-2 text-white/60">AI Insight</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The policy shows a strong positive correlation with {category.title.toLowerCase()} improvements. 
                      Primary drivers are the shifts in {category.metrics[0].label.toLowerCase()} and {category.metrics[1]?.label.toLowerCase()}.
                      {key === 'mobility' && " Public transport adoption is a key success metric here."}
                      {key === 'digital' && " Increased connectivity is unlocking new service access tiers."}
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