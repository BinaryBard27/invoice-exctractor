'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import UploadZone from '@/components/UploadZone';
import ResultsTable from '@/components/ResultsTable';
import PaywallModal from '@/components/PaywallModal';
import { Download } from 'lucide-react';
import { InvoiceData } from '@/lib/parser';
import { generateExcel, generateXeroCSV, generateQuickBooksCSV, generateSageCSV } from '@/lib/excel';

export type InvoiceToolKind = 'excel' | 'xero' | 'quickbooks' | 'sage';

interface InvoiceToolPageProps {
  kind: InvoiceToolKind;
  title: string;
  answer: string;
  exportLabel: string;
  fileExtension: string;
  lastUpdated: string;
}

const tools = [
  ['excel', '/tools/invoice-pdf-to-excel', 'Invoice PDF to Excel'],
  ['xero', '/tools/invoice-to-xero', 'Invoice to Xero'],
  ['quickbooks', '/tools/invoice-to-quickbooks', 'Invoice to QuickBooks'],
  ['sage', '/tools/invoice-to-sage', 'Invoice to Sage'],
] as const;

const paidProductUrl = `https://gumroad.com/l/${process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_ID || ''}`;

export default function InvoiceToolPage({ kind, title, answer, exportLabel, fileExtension, lastUpdated }: InvoiceToolPageProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [results, setResults] = useState<InvoiceData[] | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (files: File[]) => {
    setIsExtracting(true); setError(null); setResults(null);
    const formData = new FormData(); files.forEach((file) => formData.append('files', file));
    try {
      const response = await fetch('/api/extract', { method: 'POST', body: formData });
      const failure = await response.clone().json().catch(() => null);
      if (!response.ok) {
        if (response.status === 402 || failure?.code === 'PAYWALL') { setShowPaywall(true); return; }
        throw new Error(failure?.error || 'Extraction failed');
      }
      setResults(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong during extraction.');
    } finally { setIsExtracting(false); }
  };

  const download = () => {
    if (!results) return;
    const date = new Date().toISOString().slice(0, 10);
    if (kind === 'excel') {
      const blob = generateExcel(results);
      triggerDownload(blob, `invoice-extraction-${date}.xlsx`);
      return;
    }
    const generators = { xero: generateXeroCSV, quickbooks: generateQuickBooksCSV, sage: generateSageCSV };
    triggerDownload(new Blob([generators[kind](results)], { type: 'text/csv;charset=utf-8;' }), `invoice-${kind}-${date}.csv`);
  };

  return <div className="min-h-screen bg-[#f7f7f8] font-sans"><Navbar /><main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
    <div className="mb-10 text-center"><p className="text-sm font-bold uppercase tracking-widest text-slate-950">Invoice conversion tool</p>
      <h1 className="mb-4 mt-3 text-4xl font-extrabold tracking-tight text-slate-950">{title}</h1>
      <p className="mx-auto max-w-2xl text-left text-base leading-7 text-slate-600">{answer}</p>
      <p className="mt-4 text-sm text-slate-500">Last updated: {lastUpdated}</p>
    </div>
    <UploadZone onExtract={handleExtract} isExtracting={isExtracting} />
    {error && <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">{error}</div>}
    {results && results.length > 0 && <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in"><ResultsTable results={results} /><div className="mt-8 flex justify-center"><button onClick={download} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"><Download className="h-5 w-5" />Download {exportLabel} ({fileExtension})</button></div></div>}
    <div className="mt-16 rounded-2xl bg-slate-950 p-8 text-center text-white"><h2 className="text-2xl font-bold">Need unlimited invoice processing?</h2><p className="mx-auto mt-2 max-w-xl text-slate-300">Pull Invoice&apos;s paid plan unlocks unlimited PDF extractions for a one-time payment.</p><a href={paidProductUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-lg bg-white px-5 py-3 font-bold text-slate-950 hover:bg-slate-200">Get Pull Invoice Pro</a></div>
    <nav aria-label="Invoice tools" className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm"><Link href="/tools" className="font-semibold text-slate-950 underline">All invoice tools</Link>{tools.filter(([tool]) => tool !== kind).map(([, href, label]) => <Link key={href} href={href} className="text-slate-600 underline hover:text-slate-950">{label}</Link>)}</nav>
  </main>{showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}</div>;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}
