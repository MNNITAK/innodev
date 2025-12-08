import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="w-full border-white/10 bg-[oklch(0.18_0_0)]/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="h-5 w-5" />
          Select Your Policy
        </CardTitle>
        <CardDescription className="text-white/60">
          Upload a policy PDF to extract and analyze its content
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* File Input */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="pdf-upload"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 hover:bg-white/5 transition-colors"
          >
            <Upload className="h-5 w-5 text-white/60" />
            <span className="text-sm text-white/60">
              {file ? file.name : "Click to select policy PDF"}
            </span>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Primary button: 
            - Before parse success: Upload Policy
            - After parse success: Run Simulation
        */}
        {file && !result && (
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-white text-black hover:bg-white/90"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Policy
              </>
            )}
          </Button>
        )}

        {file && result && (
          <Button
            onClick={handleRunClick}
            disabled={isRunning}
            className="w-full bg-white text-black hover:bg-white/90"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running simulation...
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
        )}

        {/* Success Message - without text preview */}
        {result && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-500">
                  Policy Parsed Successfully!
                </p>
                <p className="text-xs text-white/60 mt-1">
                  Ready to run simulation
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-500">
                  Upload Failed
                </p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { PdfUploadCard };
