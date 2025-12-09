import express from "express";
import upload from "../middleware/upload.js";
import { uploadPdf } from "../controllers/pdfController.js";

const router = express.Router();

router.post("/upload-pdf", upload.single("pdf"), uploadPdf);

export default router;
