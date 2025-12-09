
import { Card, CardContent } from "../../components/ui/card";
import { Clock, PlayCircle, CheckCircle, XCircle } from "lucide-react";

const historyData = [
  {
    id: 1,
    policy: "Healthcare Subsidy Increase",
    date: "Dec 5, 2025 14:32",
    duration: "45 min",
    status: "success",
    result: "67% support",
  },
  {
    id: 2,
    policy: "Education Tax Credit",
    date: "Dec 4, 2025 11:15",
    duration: "38 min",
    status: "success",
    result: "72% support",
  },
  {
    id: 3,
    policy: "Carbon Tax Implementation",
    date: "Dec 3, 2025 16:48",
    duration: "52 min",
    status: "success",
    result: "45% support",
  },
  {
    id: 4,
    policy: "Agricultural Loan Waiver",
    date: "Dec 2, 2025 09:22",
    duration: "41 min",
    status: "failed",
    result: "Error in model",
  },
  {
    id: 5,
    policy: "Infrastructure Investment Plan",
    date: "Dec 1, 2025 13:05",
    duration: "48 min",
    status: "success",
    result: "68% support",
  },
  {
    id: 6,
    policy: "Digital India Initiative v2",
    date: "Nov 30, 2025 10:30",
    duration: "35 min",
    status: "success",
    result: "81% support",
  },
  {
    id: 7,
    policy: "Minimum Wage Revision",
    date: "Nov 29, 2025 15:18",
    duration: "44 min",
    status: "success",
    result: "58% support",
  },
  {
    id: 8,
    policy: "Public Transport Subsidy",
    date: "Nov 28, 2025 12:45",
    duration: "39 min",
    status: "success",
    result: "74% support",
  },
];

function HistoryPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Simulation History</h1>
        <p className="text-muted-foreground">
          Past policy simulations and their outcomes
        </p>
      </div>

      <div className="space-y-3">
        {historyData.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-2 ${
                    item.status === "success"
                      ? "bg-green-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  {item.status === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{item.policy}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-3 w-3" />
                      {item.duration}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={`text-sm font-medium ${
                  item.status === "success" ? "text-accent" : "text-red-500"
                }`}
              >
                {item.result}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export default HistoryPage;
