import { Router } from "express";
import {
  getAllReports,
  getReportById,
  createReport,
  downloadReport,
  previewReport,
  deleteReport,
} from "../controllers/report.controller.js";

const router = Router();

// Get all reports (sorted by newest first)
router.get("/", getAllReports);

// Get single report by ID
router.get("/:reportId", getReportById);

// Create new report (triggered after simulation)
router.post("/", createReport);

// Download report PDF
router.get("/download/:reportId", downloadReport);

// Preview report content
router.get("/preview/:reportId", previewReport);

// Delete report
router.delete("/:reportId", deleteReport);

export default router;
