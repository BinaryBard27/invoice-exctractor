import Link from 'next/link';
import Navbar from '@/components/Navbar';

const tools = [
  ['/tools/invoice-pdf-to-excel', 'Invoice PDF to Excel', 'Extract invoice data into a clean XLSX workbook.'],
  ['/tools/invoice-to-xero', 'Invoice to Xero', 'Prepare invoice line items for Xero CSV import.'],
  ['/tools/invoice-to-quickbooks', 'Invoice to QuickBooks', 'Prepare bills for QuickBooks CSV import.'],
  ['/tools/invoice-to-sage', 'Invoice to Sage', 'Prepare purchase invoices for Sage CSV import.'],
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-950">Pull Invoice tools</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Convert invoice PDFs for the tools you use</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Extract vendors, dates, totals, and line items from invoice PDFs, then download a workbook or an accounting-system-ready CSV.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {tools.map(([href, title, description]) => (
            <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <h2 className="text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-2 text-slate-600">{description}</p>
              <span className="mt-5 inline-block text-sm font-bold text-slate-950 underline">Open tool</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
