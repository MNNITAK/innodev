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
  Activity,
  Wallet,
  Smartphone,
  Trees,
  Landmark,
} from "lucide-react";

// Component to display a single factor's current status (0-1 range)
const StatusIndicator = ({ label, value, type, inverse = false }) => {
  const percentage = Math.round(value * 100);
  
  // Color logic: High is good unless inverse is true
  let colorClass = "bg-emerald-500";
  let textColor = "text-emerald-400";
  
  if (inverse) {
    if (percentage > 66) { colorClass = "bg-rose-500"; textColor = "text-rose-400"; }
    else if (percentage > 33) { colorClass = "bg-amber-500"; textColor = "text-amber-400"; }
  } else {
    if (percentage < 33) { colorClass = "bg-rose-500"; textColor = "text-rose-400"; }
    else if (percentage < 66) { colorClass = "bg-amber-500"; textColor = "text-amber-400"; }
  }

  return (
    <div className="mb-5 group">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-sm font-medium text-white/90">{label}</p>
          <p className="text-xs text-white/40 mt-0.5">
            {type === "ordinal" ? "Index Score (0-1)" : "Population %"}
          </p>
        </div>
        <div className={`font-mono font-bold text-lg ${textColor}`}>
           {type === 'ordinal' ? value.toFixed(2) : percentage + "%"}
        </div>
      </div>

      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden relative">
        <div 
            className={`h-full ${colorClass} transition-all duration-1000 ease-out relative`}
            style={{ width: `${percentage}%` }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-black/20 left-[33%] mix-blend-overlay"></div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-black/20 left-[66%] mix-blend-overlay"></div>
      </div>
    </div>
  );
};

export default function IndiaAnalytics() {
  const [activeTab, setActiveTab] = useState("socioEconomic");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNationalData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/analytics/national');
            if (response.ok) {
                const result = await response.json();
                setAnalyticsData(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch national analytics", error);
        } finally {
            setLoading(false);
        }
    };

    fetchNationalData();
  }, []);

  if (loading || !analyticsData) {
    return (
      <div className="h-[400px] flex items-center justify-center border border-white/10 rounded-xl bg-card/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const categories = ["socioEconomic", "health", "digital", "environment", "governance"];
  const iconMap = {
    socioEconomic: Wallet,
    health: Activity,
    digital: Smartphone,
    environment: Trees,
    governance: Landmark,
  };

  return (
    <div className="space-y-6">
      {/* NOTE: MetricsCards removed from here as it is now at the top of DashboardHome */}

      <Card className="border-white/10 bg-card/50 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                National Impact Analytics
              </CardTitle>
              <CardDescription>
                Current assessment of key development indicators (Nationwide)
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col md:flex-row gap-6">
            {/* Sidebar Tabs */}
            <TabsList className="flex md:flex-col h-auto bg-transparent space-y-1 p-0 justify-start w-full md:w-64 overflow-x-auto md:overflow-visible">
              {categories.map((key) => {
                const CategoryIcon = iconMap[key];
                const category = analyticsData.categories[key];
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-accent data-[state=active]:text-white transition-all rounded-lg border border-transparent data-[state=active]:border-white/10"
                  >
                    <CategoryIcon className="h-4 w-4 opacity-70" />
                    {category.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Content Area */}
            <div className="flex-1 min-h-[400px] bg-white/5 rounded-xl border border-white/10 p-6">
              {categories.map((key) => {
                const category = analyticsData.categories[key];
                return (
                  <TabsContent key={key} value={key} className="mt-0 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-1">{category.title} Overview</h3>
                        <p className="text-sm text-white/40">National aggregated metrics based on latest survey data.</p>
                    </div>

                    <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
                        {category.metrics.map((metric) => (
                            <StatusIndicator 
                                key={metric.id}
                                label={metric.label}
                                value={metric.value}
                                type={metric.type}
                                inverse={metric.inverse}
                            />
                        ))}
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm leading-relaxed">
                        <strong>AI Insight:</strong> India's {category.title.toLowerCase()} data indicates a 
                        {analyticsData.summaryMetrics && analyticsData.summaryMetrics[0] && parseInt(analyticsData.summaryMetrics[0].value) > 60 ? " stable" : " volatile"} environment. 
                        Targeted interventions in {category.metrics[0].label} could yield significant national improvements.
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