'use client';

import { InvoiceData } from '@/lib/parser';
import { generateExcel, generateCSV } from '@/lib/excel';
import { Download } from 'lucide-react';

interface DownloadButtonsProps {
  results: InvoiceData[];
}

export default function DownloadButtons({ results }: DownloadButtonsProps) {
  const handleExcel = () => {
    const blob = generateExcel(results);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_invoices_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCSV = () => {
    const csv = generateCSV(results);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_invoices_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-4 mt-8 justify-center">
      <button
        onClick={handleExcel}
        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow-sm transition-colors"
      >
        <Download className="w-5 h-5" />
        Download Excel (.xlsx)
      </button>
      <button
        onClick={handleCSV}
        className="flex items-center gap-2 px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium shadow-sm transition-colors"
      >
        <Download className="w-5 h-5" />
        Download CSV
      </button>
    </div>
  );
}
