import IndiaMap from "../../components/dashboard/IndiaMap.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.jsx";
import { usePdfUploadContext } from "../../components/dashboard/PdfUploadCard.jsx";
import { useState, useEffect } from "react";


export default function MapPage() {
  const [topSupporters, setTopSupporters] = useState([]);
  const [lowestSupporters, setLowestSupporters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get orchestration data
  const { result } = usePdfUploadContext();
  const dashboardData = result?.orchestrationResult;

  useEffect(() => {
    if (dashboardData?.geographicDistribution) {
      // Process orchestration data
      const stateData = dashboardData.geographicDistribution
        .map(geo => ({
          state: geo.state,
          support: Math.round(geo.supportPercentage)
        }))
        .filter(state => state.support > 0); // Filter out states with no data

      // Sort by support percentage
      const sortedBySupport = [...stateData].sort((a, b) => b.support - a.support);
      
      // Get top 5 supporters
      setTopSupporters(sortedBySupport.slice(0, 5));
      
      // Get lowest 5 supporters
      setLowestSupporters(sortedBySupport.slice(-5).reverse());
      
      setLoading(false);
    } else {
      // Fallback to default data if no orchestration data
      setTopSupporters([
        { state: "Kerala", support: 83 },
        { state: "Gujarat", support: 82 },
        { state: "Goa", support: 79 },
        { state: "Delhi", support: 78 },
        { state: "Karnataka", support: 76 },
      ]);
      
      setLowestSupporters([
        { state: "Bihar", support: 41 },
        { state: "Jammu & Kashmir", support: 45 },
        { state: "Jharkhand", support: 47 },
        { state: "Uttar Pradesh", support: 48 },
        { state: "Madhya Pradesh", support: 51 },
      ]);
      
      setLoading(false);
    }
  }, [dashboardData]);
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Interactive Map View</h1>
        <p className="text-muted-foreground">
          Explore policy support data across all Indian states
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <IndiaMap />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Top Supporters
                {dashboardData && (
                  <span className="ml-2 text-xs text-accent">
                    (Live Data)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : topSupporters.length > 0 ? (
                topSupporters.map((item, index) => (
                  <div
                    key={item.state}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">#{index + 1}</span>
                      <span>{item.state}</span>
                    </div>
                    <span className="text-accent font-medium">
                      {item.support}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Lowest Support
                {dashboardData && (
                  <span className="ml-2 text-xs text-accent">
                    (Live Data)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : lowestSupporters.length > 0 ? (
                lowestSupporters.map((item, index) => (
                  <div
                    key={item.state}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">#{lowestSupporters.length - index}</span>
                      <span>{item.state}</span>
                    </div>
                    <span className="text-destructive font-medium">
                      {item.support}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
