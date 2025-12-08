import { async_handler } from "../utils/async_handler.js";
import { api_res } from "../utils/api_res.js";
import Api_err from "../utils/err.js";

// In-memory store for reports (use database in production)
let reports = [
  {
    id: "report_1733789234567",
    policyName: "Healthcare Policy Impact Analysis",
    createdAt: new Date("2025-12-05T10:30:00").toISOString(),
    status: "completed",
    pages: 24,
    fileSize: "2.4 MB",
    downloadUrl: "/api/reports/download/report_1733789234567",
  },
  {
    id: "report_1733616234567",
    policyName: "Education Reform Simulation Results",
    createdAt: new Date("2025-12-03T14:20:00").toISOString(),
    status: "completed",
    pages: 18,
    fileSize: "1.8 MB",
    downloadUrl: "/api/reports/download/report_1733616234567",
  },
  {
    id: "report_1733443034567",
    policyName: "Tax Policy Public Sentiment Report",
    createdAt: new Date("2025-12-01T09:15:00").toISOString(),
    status: "completed",
    pages: 32,
    fileSize: "3.2 MB",
    downloadUrl: "/api/reports/download/report_1733443034567",
  },
];

// Get all reports (sorted by newest first)
export const getAllReports = async_handler(async (req, res) => {
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return res
    .status(200)
    .json(
      new api_res(
        200,
        { reports: sortedReports },
        "Reports fetched successfully"
      )
    );
});

// Get single report by ID
export const getReportById = async_handler(async (req, res) => {
  const { reportId } = req.params;
  const report = reports.find((r) => r.id === reportId);

  if (!report) {
    throw new Api_err("Report not found", 404);
  }

  return res
    .status(200)
    .json(new api_res(200, { report }, "Report fetched successfully"));
});

// Create new report (triggered after simulation)
export const createReport = async_handler(async (req, res) => {
  const { policyName, pdfText } = req.body;

  if (!policyName) {
    throw new Api_err("Policy name is required", 400);
  }

  // Generate unique report ID
  const reportId = `report_${Date.now()}`;

  // Create new report with "in-progress" status
  const newReport = {
    id: reportId,
    policyName,
    createdAt: new Date().toISOString(),
    status: "in-progress",
    pages: null,
    fileSize: null,
    downloadUrl: null,
  };

  // Add to beginning of array (newest first)
  reports.unshift(newReport);

  // Simulate report generation (in production, this would be async job)
  setTimeout(() => {
    const reportIndex = reports.findIndex((r) => r.id === reportId);
    if (reportIndex !== -1) {
      reports[reportIndex] = {
        ...reports[reportIndex],
        status: "completed",
        pages: Math.floor(Math.random() * 30) + 15, // Random 15-45 pages
        fileSize: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        downloadUrl: `/api/reports/download/${reportId}`,
      };
    }
  }, 5000); // Complete after 5 seconds

  return res
    .status(201)
    .json(
      new api_res(
        201,
        { report: newReport },
        "Report generation started successfully"
      )
    );
});

// Download report (mock implementation)
export const downloadReport = async_handler(async (req, res) => {
  const { reportId } = req.params;
  const report = reports.find((r) => r.id === reportId);

  if (!report) {
    throw new Api_err("Report not found", 404);
  }

  if (report.status !== "completed") {
    throw new Api_err("Report is not ready for download yet", 400);
  }

  // In production, this would stream the actual PDF file
  // For now, return a mock PDF response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${report.policyName.replace(
      /\s+/g,
      "_"
    )}_Report.pdf"`
  );

  // Mock PDF content (in production, read from storage)
  const mockPdfContent = Buffer.from(
    `%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(${report.policyName}) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000262 00000 n\n0000000341 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n435\n%%EOF`
  );

  return res.send(mockPdfContent);
});

// Preview report (mock implementation)
export const previewReport = async_handler(async (req, res) => {
  const { reportId } = req.params;
  const report = reports.find((r) => r.id === reportId);

  if (!report) {
    throw new Api_err("Report not found", 404);
  }

  if (report.status !== "completed") {
    throw new Api_err("Report is not ready for preview yet", 400);
  }

  // Return report preview data
  const previewData = {
    id: report.id,
    policyName: report.policyName,
    createdAt: report.createdAt,
    pages: report.pages,
    sections: [
      {
        title: "Executive Summary",
        content:
          "This policy simulation analyzed the impact across multiple demographics and regions...",
      },
      {
        title: "Key Findings",
        content:
          "Overall support: 67.8%, Major concerns: Economic impact (32%), implementation timeline (18%)...",
      },
      {
        title: "Regional Analysis",
        content:
          "Northern regions show 72% support, Southern regions 64%, Eastern 69%, Western 66%...",
      },
      {
        title: "Demographic Breakdown",
        content:
          "Age 18-30: 71% support, Age 31-50: 68% support, Age 51+: 64% support...",
      },
      {
        title: "Risk Assessment",
        content:
          "Low risk: Implementation feasibility, Medium risk: Budget allocation, High risk: Public resistance in certain sectors...",
      },
    ],
    charts: [
      {
        type: "pie",
        title: "Overall Sentiment Distribution",
        data: { support: 67.8, oppose: 22.4, neutral: 9.8 },
      },
      {
        type: "bar",
        title: "Regional Support Comparison",
        data: { north: 72, south: 64, east: 69, west: 66 },
      },
    ],
  };

  return res
    .status(200)
    .json(
      new api_res(
        200,
        { preview: previewData },
        "Preview generated successfully"
      )
    );
});

// Delete report
export const deleteReport = async_handler(async (req, res) => {
  const { reportId } = req.params;
  const reportIndex = reports.findIndex((r) => r.id === reportId);

  if (reportIndex === -1) {
    throw new Api_err("Report not found", 404);
  }

  reports.splice(reportIndex, 1);

  return res
    .status(200)
    .json(new api_res(200, null, "Report deleted successfully"));
});
