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

function PdfUploadCard({ onRun, isRunning }) {
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Memorandum
        </CardTitle>
        <CardDescription>
          Upload a memorandum PDF to extract and analyze its content
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* File Input */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="pdf-upload"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {file ? file.name : "Click to select memorandum PDF"}
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
            - Before parse success: Upload Memorandum
            - After parse success: Run Simulation
        */}
        {file && !result && (
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Memorandum
              </>
            )}
          </Button>
        )}

        {file && result && (
          <Button
            onClick={handleRunClick}
            disabled={isRunning}
            className="w-full"
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

        {/* Success Message */}
        {result && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-500">
                  Memorandum Parsed Successfully!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Extracted {result.textLength} characters
                </p>
                {result.textPreview && (
                  <div className="mt-3 p-3 bg-background rounded text-xs font-mono overflow-auto max-h-40">
                    {result.textPreview}...
                  </div>
                )}
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
