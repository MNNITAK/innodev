import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const timelineData = [
  { round: "R1", support: 45, opposition: 40 },
  { round: "R2", support: 52, opposition: 38 },
  { round: "R3", support: 58, opposition: 32 },
  { round: "R4", support: 62, opposition: 28 },
  { round: "R5", support: 65, opposition: 26 },
  { round: "R6", support: 67, opposition: 25 },
];

function OpinionTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Opinion Evolution (DeGroot Model)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <XAxis dataKey="round" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="support"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", r: 3 }}
                name="Support %"
              />
              <Line
                type="monotone"
                dataKey="opposition"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", r: 3 }}
                name="Opposition %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Simulation converged after 6 rounds using bounded confidence model
        </p>
      </CardContent>
    </Card>
  );
}

export default OpinionTimeline;
