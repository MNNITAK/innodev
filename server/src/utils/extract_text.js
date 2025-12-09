import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse-fork";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("pdf-parse-fork loaded, type:", typeof pdfParse);

const extractText = async (file) => {
  let filePath = null;

  try {
    let buffer;

    if (file.path) {
      // File is stored on disk
      filePath = path.resolve(file.path);
      console.log("Reading file from:", filePath);
      if (!fs.existsSync(filePath)) {
        throw new Error("File not found");
      }
      buffer = fs.readFileSync(filePath);
      console.log("Buffer size:", buffer.length);
    } else if (file.buffer) {
      // File is in memory
      buffer = file.buffer;
      console.log("Using memory buffer, size:", buffer.length);
    } else {
      throw new Error("No file buffer or path");
    }

    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error("File buffer is empty");
    }

    console.log("Parsing PDF...");
    // Parse PDF - pdfParse returns a promise
    const data = await pdfParse(buffer);
    console.log(
      "PDF parsed successfully, text length:",
      data.text?.length || 0
    );

    // Clean up temp file after parsing
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Temp file deleted");
    }

    // Return extracted text
    const text = data.text || "No readable text found.";
    return text;
  } catch (error) {
    console.error("PDF extraction error:", error);

    // Clean up temp file on error
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error("Failed to cleanup temp file:", cleanupError);
      }
    }

    throw new Error(`PDF parse failed: ${error.message}`);
  }
};

export { extractText };
