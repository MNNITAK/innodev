

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

const populationData = {
  total: 250000,
  active: 198500,
  inactive: 51500,
  growth: 12.5,
  demographics: [
    { category: "Urban", count: 145000, percentage: 58 },
    { category: "Rural", count: 105000, percentage: 42 },
  ],
  ageGroups: [
    { group: "18-25", count: 52500, percentage: 21 },
    { group: "26-35", count: 70000, percentage: 28 },
    { group: "36-45", count: 57500, percentage: 23 },
    { group: "46-55", count: 42500, percentage: 17 },
    { group: "55+", count: 27500, percentage: 11 },
  ],
  incomeGroups: [
    { group: "Low Income", count: 75000, percentage: 30 },
    { group: "Middle Income", count: 125000, percentage: 50 },
    { group: "High Income", count: 50000, percentage: 20 },
  ],
};

export default function PopulationPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Population Analytics</h1>
        <p className="text-muted-foreground">
          Synthetic citizen distribution and demographics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-accent/10 p-3">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Population
                </p>
                <p className="text-2xl font-bold">
                  {populationData.total.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-3">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Citizens</p>
                <p className="text-2xl font-bold">
                  {populationData.active.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-500/10 p-3">
                <UserX className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Inactive Citizens
                </p>
                <p className="text-2xl font-bold">
                  {populationData.inactive.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">+{populationData.growth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {populationData.demographics.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between mb-1 text-sm">
                  <span>{item.category}</span>
                  <span className="text-muted-foreground">
                    {item.count.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {populationData.ageGroups.map((item) => (
              <div key={item.group}>
                <div className="flex justify-between mb-1 text-sm">
                  <span>{item.group}</span>
                  <span className="text-muted-foreground">
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income Groups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {populationData.incomeGroups.map((item) => (
              <div key={item.group}>
                <div className="flex justify-between mb-1 text-sm">
                  <span>{item.group}</span>
                  <span className="text-muted-foreground">
                    {item.count.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
