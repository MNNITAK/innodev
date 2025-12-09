import { createContext, useContext, useState } from 'react';

// Create the context
const PdfUploadContext = createContext();

// Custom hook to use the PDF upload context
export const usePdfUpload = () => {
  const context = useContext(PdfUploadContext);
  if (!context) {
    throw new Error('usePdfUpload must be used within a PdfUploadProvider');
  }
  return context;
};

// Provider component
const PdfUploadProvider = ({ children }) => {
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("http://localhost:5000/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setUploadResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const clearUploadResult = () => {
    setUploadResult(null);
    setError(null);
  };

  const value = {
    uploadResult,
    isUploading,
    error,
    handleUpload,
    clearUploadResult,
  };

  return (
    <PdfUploadContext.Provider value={value}>
      {children}
    </PdfUploadContext.Provider>
  );
};

// PdfUploader component that uses the context
const PdfUploader = () => {
  const { handleUpload, isUploading, error } = usePdfUpload();

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleUpload(file);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="application/pdf" 
        onChange={onFileChange}
        disabled={isUploading}
      />
      {isUploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export { PdfUploadProvider };
export default PdfUploader;
