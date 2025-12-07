

import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileText, Download, Eye, Calendar } from "lucide-react";

const reports = [
  {
    id: 1,
    name: "Healthcare Policy Impact Analysis",
    date: "Dec 5, 2025",
    status: "completed",
    pages: 24,
  },
  {
    id: 2,
    name: "Education Reform Simulation Results",
    date: "Dec 3, 2025",
    status: "completed",
    pages: 18,
  },
  {
    id: 3,
    name: "Tax Policy Public Sentiment Report",
    date: "Dec 1, 2025",
    status: "completed",
    pages: 32,
  },
  {
    id: 4,
    name: "Infrastructure Development Analysis",
    date: "Nov 28, 2025",
    status: "completed",
    pages: 21,
  },
  {
    id: 5,
    name: "Environmental Policy Study",
    date: "Nov 25, 2025",
    status: "in-progress",
    pages: 15,
  },
  {
    id: 6,
    name: "Monthly Simulation Summary - November",
    date: "Nov 30, 2025",
    status: "completed",
    pages: 45,
  },
];

export default function ReportsPage() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generated simulation reports and analysis documents
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          Generate New Report
        </Button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-accent/10 p-3">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium">{report.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.date}
                    </span>
                    <span>{report.pages} pages</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        report.status === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {report.status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
