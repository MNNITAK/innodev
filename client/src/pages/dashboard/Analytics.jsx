import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { MapPin, Search, TrendingUp, Activity } from "lucide-react";
import { INDIAN_STATES } from "@/data/statesData";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statesData, setStatesData] = useState(INDIAN_STATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/analytics/states"
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setStatesData(result.data);
          }
        }
      } catch (err) {
        console.error("Error fetching states:", err);
        // Use fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const filteredStates = statesData.filter(
    (state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.capital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const states = filteredStates.filter((s) => s.type === "State");
  const unionTerritories = filteredStates.filter((s) => s.type === "UT");

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Activity className="h-8 w-8 text-accent" />
            State-wise Impact Analytics
          </h1>
          <p className="text-white/60 mt-2">Loading state data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white/5 border-white/10 animate-pulse">
              <CardHeader>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-white/10 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Activity className="h-8 w-8 text-accent" />
          State-wise Impact Analytics
        </h1>
        <p className="text-white/60 mt-2">
          Select a state or union territory to view detailed impact analysis
          across 5 key sectors
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          type="text"
          placeholder="Search for states or union territories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total States</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {states.length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Union Territories</p>
                <p className="text-3xl font-bold text-blue-400">
                  {unionTerritories.length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Regions</p>
                <p className="text-3xl font-bold text-purple-400">
                  {INDIAN_STATES.length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* States Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-400" />
          States ({states.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {states.map((state) => (
            <Card
              key={state.code}
              className={cn(
                "group cursor-pointer transition-all duration-200 hover:scale-105",
                "bg-linear-to-br from-white/5 to-white/10 border-white/10",
                "hover:border-accent hover:shadow-lg hover:shadow-accent/20"
              )}
              onClick={() =>
                navigate(`/dashboard/analytics/${state.code.toLowerCase()}`)
              }
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
                  {state.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <MapPin className="h-3 w-3" />
                    <span>Capital: {state.capital}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">
                      State
                    </span>
                    <span className="font-mono">{state.code}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 text-xs group-hover:bg-accent/10 group-hover:text-accent"
                >
                  View Analytics →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Union Territories Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-400" />
          Union Territories ({unionTerritories.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {unionTerritories.map((state) => (
            <Card
              key={state.code}
              className={cn(
                "group cursor-pointer transition-all duration-200 hover:scale-105",
                "bg-linear-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20",
                "hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/20"
              )}
              onClick={() =>
                navigate(`/dashboard/analytics/${state.code.toLowerCase()}`)
              }
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {state.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <MapPin className="h-3 w-3" />
                    <span>Capital: {state.capital}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded">
                      UT
                    </span>
                    <span className="font-mono">{state.code}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 text-xs group-hover:bg-blue-500/10 group-hover:text-blue-400"
                >
                  View Analytics →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
