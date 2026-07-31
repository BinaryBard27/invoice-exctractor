import Link from 'next/link';
import { ArrowRight, Check, FileSpreadsheet, FileText, LockKeyhole, Sparkles, UploadCloud, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';

const tools = [
  {
    title: 'Invoice PDF to Excel',
    description: 'Extract invoice fields, totals, and line items into a clean spreadsheet.',
    href: '/extract',
    icon: FileSpreadsheet,
    featured: true,
  },
  {
    title: 'Invoice PDF to CSV',
    description: 'Turn multiple invoices into a lightweight CSV ready for your workflow.',
    href: '/extract',
    icon: FileText,
  },
  {
    title: 'Batch invoice extraction',
    description: 'Upload up to 10 invoice PDFs and receive one combined export.',
    href: '/extract',
    icon: Zap,
  },
];

const steps = [
  ['1', 'Upload', 'Drop your invoice PDFs into the secure upload area.'],
  ['2', 'Extract', 'We identify dates, vendors, totals, tax, and line items.'],
  ['3', 'Export', 'Download a tidy Excel workbook or CSV in seconds.'],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f8] text-slate-900">
      <Navbar />

      <main>
        <section className="px-4 pb-16 pt-16 sm:pb-24 sm:pt-24">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">
              <Sparkles className="h-4 w-4" /> Built for invoice workflows
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
              The simplest way to turn invoices into <span className="text-slate-950">Excel</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Extract structured invoice data from PDFs in seconds. No templates, no subscriptions, and no manual copy-pasting.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/extract" className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-7 py-4 text-base font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800">
                Start extracting <ArrowRight className="h-5 w-5" />
              </Link>
              <span className="text-sm text-slate-500">10 invoices free · no signup required</span>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60 sm:p-5">
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center sm:px-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/25">
                <UploadCloud className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-slate-900">Drop invoice PDFs here</h2>
              <p className="mt-2 text-slate-500">Upload up to 10 files at once. Digital PDFs work best.</p>
              <Link href="/extract" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800">
                Choose files <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5" /> Secure processing</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> Excel and CSV output</span>
                <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> Results in seconds</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-950">One product. Three ways to work.</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Everything you need for invoice data</h2>
              </div>
                <Link href="/extract" className="text-sm font-bold text-slate-950 hover:text-slate-700">Open the tool <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {tools.map(({ title, description, href, icon: Icon, featured }) => (
                <Link key={title} href={href} className={`group rounded-xl border p-6 transition hover:-translate-y-0.5 hover:shadow-lg ${featured ? 'border-slate-300 bg-slate-100' : 'border-slate-200 bg-slate-50/60'}`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${featured ? 'bg-slate-950 text-white' : 'bg-white text-slate-900 shadow-sm'}`}><Icon className="h-6 w-6" /></div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  <span className="mt-5 inline-flex items-center text-sm font-bold text-slate-950">Use tool <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center"><p className="text-sm font-bold uppercase tracking-widest text-slate-950">How it works</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">From PDF to spreadsheet in three steps</h2></div>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {steps.map(([number, title, text]) => <div key={number} className="text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-lg font-extrabold text-white">{number}</div><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600">{text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div><p className="text-sm font-bold uppercase tracking-widest text-slate-300">Simple pricing</p><h2 className="mt-3 text-3xl font-extrabold">Start free. Upgrade once.</h2><p className="mt-3 max-w-xl text-slate-300">Your first 10 invoices are free. Unlock unlimited invoice extraction forever with a one-time $19 payment.</p></div>
            <Link href="/extract" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-slate-100">Try it free <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white px-4 py-14">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left"><div><h2 className="text-2xl font-extrabold">Ready to clear your invoice backlog?</h2><p className="mt-1 text-slate-600">Upload your first PDF and see the result before you pay.</p></div><Link href="/extract" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800">Open InvoiceExtractor <ArrowRight className="h-4 w-4" /></Link></div>
        </section>
      </main>

      <footer className="bg-white px-4 py-10 text-center text-sm text-slate-500"><p>InvoiceExtractor · Secure PDF invoice extraction to Excel and CSV</p><p className="mt-2">Your files are processed for extraction and not stored.</p></footer>
    </div>
  );
}
