import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  PlayCircle,
} from "lucide-react";

function PdfUploadCard({ onRun, isRunning, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Hydrate from sessionStorage on mount
  useEffect(() => {
    const storedResult = window.sessionStorage.getItem("pdfResult");
    const storedFileName = window.sessionStorage.getItem("pdfFileName");

    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        setResult(parsed);
      } catch (e) {
        console.error("Failed to parse stored pdfResult:", e);
      }
    }

    if (storedFileName) {
      // we only need name for display
      setFile({ name: storedFileName });
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResult(null);
      setError(null);

      // ❌ Clear old stored result when new file is selected
      window.sessionStorage.removeItem("pdfResult");
      window.sessionStorage.setItem("pdfFileName", selectedFile.name);
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
      setResult(null);
      window.sessionStorage.removeItem("pdfResult");
      window.sessionStorage.removeItem("pdfFileName");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("http://localhost:8000/api/pdf/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);

        // ✅ Persist parsed result & filename for dashboard
        window.sessionStorage.setItem("pdfResult", JSON.stringify(data));
        window.sessionStorage.setItem(
          "pdfFileName",
          file.name || window.sessionStorage.getItem("pdfFileName") || ""
        );

        // Notify parent component about upload completion
        if (typeof onUploadComplete === "function") {
          onUploadComplete();
        }
      } else {
        setError(data.message || "Upload failed");
        window.sessionStorage.removeItem("pdfResult");
      }
    } catch (err) {
      setError("Failed to upload file: " + err.message);
      window.sessionStorage.removeItem("pdfResult");
    } finally {
      setUploading(false);
    }
  };

  const handleRunClick = () => {
    if (typeof onRun === "function") {
      onRun();
    } else {
      console.warn("onRun prop not provided to PdfUploadCard");
    }
  };

  return (
    <div className="w-full relative group">
      {/* Ambient glow effect */}
      <div className="absolute -inset-1 bg-linear-to-r from-accent/20 via-accent/30 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Card className="relative border border-white/10 bg-linear-to-br from-[oklch(0.20_0_0)]/95 to-[oklch(0.16_0_0)]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

        <CardContent className="relative p-6 space-y-4">
          {/* Compact header with icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/10 backdrop-blur-sm">
              <FileText className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mt-4">
                Policy Document
              </h3>
              <p className="text-xs text-white/50">
                Upload PDF to begin simulation
              </p>
            </div>
          </div>

          {/* Compact File Input */}
          <label
            htmlFor="pdf-upload"
            className="group/upload relative flex items-center gap-3 px-4 py-4 border border-dashed border-white/20 rounded-xl cursor-pointer overflow-hidden transition-all duration-300 hover:border-accent/50 hover:bg-white/5"
          >
            {/* Hover gradient effect */}
            <div className="absolute inset-0 bg-linear-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 group-hover/upload:bg-accent/10 transition-colors duration-300">
              <Upload className="h-5 w-5 text-white/60 group-hover/upload:text-accent transition-colors duration-300" />
            </div>
            <div className="relative flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {file ? file.name : "Choose policy document"}
              </p>
              <p className="text-xs text-white/40 mt-0.5">
                {file ? "PDF selected" : "Click or drag to upload"}
              </p>
            </div>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Elegant Action Buttons */}
          {file && !result && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="group/btn relative w-full px-6 py-3.5 rounded-xl font-medium text-sm overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-linear-to-r from-accent via-accent/90 to-accent transition-all duration-300 group-hover/btn:scale-105" />
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 group-hover/btn:animate-shimmer" />

              {/* Button content */}
              <span className="relative flex items-center justify-center gap-2 text-black">
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing document...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload & Analyze</span>
                  </>
                )}
              </span>
            </button>
          )}

          {file && result && (
            <button
              onClick={handleRunClick}
              disabled={isRunning}
              className="group/btn relative w-full px-6 py-3.5 rounded-xl font-medium text-sm overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-linear-to-r from-accent via-accent/90 to-accent" />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />

              {/* Pulsing effect for ready state */}
              {!isRunning && (
                <div className="absolute inset-0 bg-accent/50 animate-pulse" />
              )}

              {/* Button content */}
              <span className="relative flex items-center justify-center gap-2 text-black">
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Simulation in progress...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    <span>Start Simulation</span>
                    <span className="ml-2 text-xs opacity-75">→</span>
                  </>
                )}
              </span>
            </button>
          )}

          {/* Success Message - Elegant compact design */}
          {result && (
            <div className="relative p-3 bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl overflow-hidden backdrop-blur-sm">
              {/* Animated success glow */}
              <div className="absolute inset-0 bg-linear-to-r from-green-500/5 via-green-500/10 to-green-500/5 animate-pulse" />

              <div className="relative flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-400">
                    Analysis Complete
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">
                    Ready to begin simulation
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Message - Elegant compact design */}
          {error && (
            <div className="relative p-3 bg-linear-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="relative flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-red-400">
                    Upload Failed
                  </p>
                  <p className="text-xs text-white/50 mt-0.5 truncate">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { PdfUploadCard };
