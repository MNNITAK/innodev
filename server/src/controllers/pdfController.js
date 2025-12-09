import { extractText } from "../utils/extract_text.js";
import { runOrchestration } from "../../run_orchestrator.js";



export const uploadPdf = async (req, res) => {
  try {
    console.log("Upload PDF request received");
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const text = await extractText(req.file);

    const orchestrationResult = await runOrchestration(10000, text);

    console.log("Orchestration Result:", orchestrationResult);

    

    res.json({
      success: true,
      orchestrationResult,
    });
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
