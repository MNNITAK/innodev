import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Loader2,
  Trash2,
  FileDown,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  // Fetch reports from backend
  useEffect(() => {
    fetchReports();
    // Poll for updates every 3 seconds to check report status
    const interval = setInterval(fetchReports, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/reports");
      const data = await response.json();
      if (data.success) {
        setReports(data.data.reports);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNew = () => {
    navigate("/simulation");
  };

  const handleView = async (reportId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reports/preview/${reportId}`
      );
      const data = await response.json();
      if (data.success) {
        setPreviewData(data.data.preview);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Failed to fetch preview:", error);
      alert("Failed to load preview. Please try again.");
    }
  };

  const handleDownload = async (reportId, policyName) => {
    setDownloadingId(reportId);
    try {
      const response = await fetch(
        `http://localhost:8000/api/reports/download/${reportId}`
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${policyName.replace(/\s+/g, "_")}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download report:", error);
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/reports/${reportId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        setReports(reports.filter((r) => r.id !== reportId));
      }
    } catch (error) {
      console.error("Failed to delete report:", error);
      alert("Failed to delete report. Please try again.");
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generated simulation reports and analysis documents
          </p>
        </div>
        <Button
          onClick={handleGenerateNew}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No reports yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Run a simulation to generate your first policy analysis report
            </p>
            <Button
              onClick={handleGenerateNew}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Go to Simulation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="rounded-lg bg-accent/10 p-3">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{report.policyName}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(report.createdAt)}
                      </span>
                      {report.pages && <span>{report.pages} pages</span>}
                      {report.fileSize && <span>{report.fileSize}</span>}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          report.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : report.status === "in-progress"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {report.status === "completed" ? (
                          "Completed"
                        ) : report.status === "in-progress" ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 animate-pulse" />
                            In Progress
                          </span>
                        ) : (
                          "Failed"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.status === "completed" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => handleView(report.id)}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() =>
                          handleDownload(report.id, report.policyName)
                        }
                        disabled={downloadingId === report.id}
                      >
                        {downloadingId === report.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Download
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      disabled
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => handleDelete(report.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {previewData?.policyName}
            </DialogTitle>
            <DialogDescription>
              Generated on {previewData && formatDate(previewData.createdAt)} •{" "}
              {previewData?.pages} pages
            </DialogDescription>
          </DialogHeader>

          {previewData && (
            <div className="space-y-6 mt-4">
              {/* Sections */}
              {previewData.sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {section.content}
                  </p>
                </div>
              ))}

              {/* Charts */}
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Key Metrics</h3>
                {previewData.charts.map((chart, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-3">{chart.title}</h4>
                      {chart.type === "pie" && (
                        <div className="space-y-2">
                          {Object.entries(chart.data).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span className="font-medium">{value}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {chart.type === "bar" && (
                        <div className="space-y-2">
                          {Object.entries(chart.data).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">{key}:</span>
                                <span className="font-medium">{value}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-accent h-2 rounded-full transition-all"
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
