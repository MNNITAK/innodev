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
  Activity,
  Wallet,
  Smartphone,
  Trees,
  Bus,
  ArrowLeft,
  MapPin,
  Landmark,
} from "lucide-react";
import MetricsCards from "@/components/dashboard/MetricsCards";
import { INDIAN_STATES, ALL_STATES_ANALYTICS } from "@/data/statesData";

// Component to display a single factor's current status
const StatusIndicator = ({ label, value, type, inverse = false }) => {
  // Value is expected to be 0-1
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
            {type === "ordinal" ? "Index Score" : "Population %"}
          </p>
        </div>
        <div className={`font-mono font-bold text-lg ${textColor}`}>
           {type === 'ordinal' ? (value * 10).toFixed(1) + "/10" : percentage + "%"}
        </div>
      </div>

      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden relative">
        <div 
            className={`h-full ${colorClass} transition-all duration-1000 ease-out relative`}
            style={{ width: `${percentage}%` }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>
        
        {/* Markers for context */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-black/20 left-[33%] mix-blend-overlay"></div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-black/20 left-[66%] mix-blend-overlay"></div>
      </div>
    </div>
  );
};

export default function StateAnalytics() {
  const { stateCode } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("socioEconomic");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const stateInfo = INDIAN_STATES.find(
    (s) => s.code === stateCode?.toUpperCase()
  );

  useEffect(() => {
    // Simulate API Fetch
    setLoading(true);
    setTimeout(() => {
        const mockData = ALL_STATES_ANALYTICS[stateCode?.toUpperCase()];
        setAnalyticsData(mockData);
        setLoading(false);
    }, 600);
  }, [stateCode]);

  if (loading || !stateInfo || !analyticsData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
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
    <div className="space-y-6 p-1 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/analytics")} className="h-10 w-10 rounded-full border border-white/10 hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">{stateInfo.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/60 border border-white/5 uppercase tracking-wider">
                {stateInfo.type}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/50 mt-1">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {stateInfo.capital}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Metrics Cards specific to State */}
      <MetricsCards 
 />

      {/* Main Analysis Card */}
      <Card className="border-white/10 bg-card/50 backdrop-blur-md shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Current Factor Analysis
              </CardTitle>
              <CardDescription>
                Real-time assessment of key development indicators
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col md:flex-row gap-6">
            
            {/* Sidebar Tabs */}
            <TabsList className="flex md:flex-col h-auto bg-transparent space-y-1 p-0 justify-start w-full md:w-64">
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
                        <p className="text-sm text-white/40">Current metric standings based on latest census & survey data.</p>
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
                        <strong>Analysis:</strong> {stateInfo.name}'s {category.title.toLowerCase()} indicators suggest a 
                        {Math.random() > 0.5 ? " strong upward trajectory" : " need for targeted intervention"} in 
                        key areas. The data indicates {Math.random() > 0.5 ? "high" : "moderate"} correlation with 
                        national development goals.
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