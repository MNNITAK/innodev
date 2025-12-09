import IndiaMap from "../../components/dashboard/IndiaMap.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.jsx";

export default function MapPage() {
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
              <CardTitle className="text-sm">Top Supporters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { state: "Kerala", support: 83 },
                { state: "Gujarat", support: 82 },
                { state: "Goa", support: 79 },
                { state: "Delhi", support: 78 },
                { state: "Karnataka", support: 76 },
              ].map((item) => (
                <div
                  key={item.state}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{item.state}</span>
                  <span className="text-accent font-medium">
                    {item.support}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Lowest Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { state: "Bihar", support: 41 },
                { state: "Jammu & Kashmir", support: 45 },
                { state: "Jharkhand", support: 47 },
                { state: "Uttar Pradesh", support: 48 },
                { state: "Madhya Pradesh", support: 51 },
              ].map((item) => (
                <div
                  key={item.state}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{item.state}</span>
                  <span className="text-destructive font-medium">
                    {item.support}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
