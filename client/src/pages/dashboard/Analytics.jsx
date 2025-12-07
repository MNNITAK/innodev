import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.jsx";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

// ... [Copy the trendData, policyComparison, sentimentData constants here] ...
const trendData = [
  { month: "Jan", support: 45, opposition: 35, neutral: 20 },
  { month: "Feb", support: 48, opposition: 32, neutral: 20 },
  { month: "Mar", support: 52, opposition: 30, neutral: 18 },
  { month: "Apr", support: 58, opposition: 28, neutral: 14 },
  { month: "May", support: 62, opposition: 25, neutral: 13 },
  { month: "Jun", support: 65, opposition: 23, neutral: 12 },
];

const policyComparison = [
  { policy: "Healthcare", support: 78 },
  { policy: "Education", support: 72 },
  { policy: "Tax Reform", support: 45 },
  { policy: "Infrastructure", support: 68 },
  { policy: "Environment", support: 61 },
];

const sentimentData = [
  { name: "Positive", value: 62, color: "#22c55e" },
  { name: "Neutral", value: 23, color: "#6b7280" },
  { name: "Negative", value: 15, color: "#ef4444" },
];

export default function AnalyticsPage() {
  return (
     // ... [Copy the exact Return JSX from the analytics/page.jsx file] ...
     // (The JSX content is identical to the file you provided, just ensure imports match)
     <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed analysis of policy simulations and citizen responses
        </p>
      </div>
      {/* ... Rest of the JSX ... */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader><CardTitle>Support Trends Over Time</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} labelStyle={{ color: "#fff" }} />
                  <Line type="monotone" dataKey="support" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="opposition" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Policy Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={policyComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="policy" type="category" stroke="#666" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} labelStyle={{ color: "#fff" }} />
                  <Bar dataKey="support" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
            <CardHeader><CardTitle>Overall Sentiment</CardTitle></CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {sentimentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="flex justify-center gap-4 mt-4">
                  {sentimentData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Key Insights</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="rounded-lg bg-accent/10 p-4">
                        <h4 className="font-medium text-accent mb-1">High Support Detected</h4>
                        <p className="text-sm text-muted-foreground">Healthcare policy shows 78% support across all demographics. Consider accelerating implementation.</p>
                    </div>
                    <div className="rounded-lg bg-yellow-500/10 p-4">
                        <h4 className="font-medium text-yellow-500 mb-1">Mixed Reactions</h4>
                        <p className="text-sm text-muted-foreground">Tax Reform policy has polarized opinions. Urban areas show 60% support vs 35% in rural regions.</p>
                    </div>
                    <div className="rounded-lg bg-blue-500/10 p-4">
                        <h4 className="font-medium text-blue-500 mb-1">Trending Upward</h4>
                        <p className="text-sm text-muted-foreground">Overall policy support has increased by 20% over the past 6 months across all simulations.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
     </>
  );
}