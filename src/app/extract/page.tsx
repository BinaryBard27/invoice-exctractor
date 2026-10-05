'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import UploadZone from '@/components/UploadZone';
import ResultsTable from '@/components/ResultsTable';
import DownloadButtons from '@/components/DownloadButtons';
import PaywallModal from '@/components/PaywallModal';
import { InvoiceData } from '@/lib/parser';

export default function ExtractPage() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [results, setResults] = useState<InvoiceData[] | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleExtract = async (files: File[]) => {
    setIsExtracting(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        if (response.status === 402 || failure?.code === 'PAYWALL') {
          setShowPaywall(true);
          return;
        }
        throw new Error(failure?.error || 'Extraction failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong during extraction.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] font-sans">
      <Navbar />
      
      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-950">Invoice extraction tool</p>
          <h1 className="mb-4 mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Turn invoice PDFs into Excel</h1>
          <p className="mx-auto max-w-2xl text-slate-600">
            Upload your PDF invoices below. We&apos;ll automatically extract the key fields and line items so you can download them to Excel.
          </p>
        </div>

        <UploadZone onExtract={handleExtract} isExtracting={isExtracting} />

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {results && results.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <ResultsTable results={results} />
            <DownloadButtons results={results} />
          </div>
        )}
      </main>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </div>
  );
}
