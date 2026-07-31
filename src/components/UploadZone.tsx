'use client';

import { useState, useCallback } from 'react';
import { UploadCloud, FileType } from 'lucide-react';

interface UploadZoneProps {
  onExtract: (files: File[]) => void;
  isExtracting: boolean;
}

export default function UploadZone({ onExtract, isExtracting }: UploadZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isExtracting) return;

    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles].slice(0, 10));
    }
  }, [isExtracting]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      setFiles(prev => [...prev, ...selectedFiles].slice(0, 10));
    }
  };

  const handleExtract = () => {
    if (files.length > 0) {
      onExtract(files);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50">
      <div
        className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors
          ${isDragging ? 'border-slate-950 bg-slate-100' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}
          ${isExtracting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isExtracting && document.getElementById('file-upload')?.click()}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept=".pdf"
          onChange={handleFileInput}
          disabled={isExtracting}
        />
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <UploadCloud className={`h-12 w-12 ${isDragging ? 'text-slate-950' : 'text-slate-700'}`} />
          <div className="space-y-1">
            <p className="text-lg font-medium text-slate-700">
              Drop invoice PDFs here or click to browse
            </p>
            <p className="text-sm text-slate-500">
              Accepts .pdf files only (up to 10 at once)
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 flex flex-col items-center space-y-4">
          <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <FileType className="w-4 h-4 text-primary" />
            {files.length} invoice{files.length > 1 ? 's' : ''} selected
          </div>
          <button
            onClick={handleExtract}
            disabled={isExtracting}
            className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isExtracting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Extracting {files.length} invoices...
              </>
            ) : (
              'Extract Now'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
