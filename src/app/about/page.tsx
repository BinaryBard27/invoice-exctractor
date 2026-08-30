import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = { title: 'About PullInvoice', description: 'Learn why PullInvoice makes invoice data entry faster for small teams.' };

export default function AboutPage() {
  return <div className="min-h-screen bg-[#f7f7f8] text-slate-900"><Navbar /><main className="py-10 sm:py-16"><Breadcrumbs current="About" /><section className="mx-auto max-w-4xl px-4"><p className="text-sm font-bold uppercase tracking-widest text-slate-950">About PullInvoice</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Less data entry. More time for the work that matters.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">PullInvoice was built for people who spend too much of their week moving numbers from PDFs into spreadsheets. Upload an invoice, review the extracted fields, and export a clean workbook.</p><div className="mt-12 grid gap-5 sm:grid-cols-3"><div className="rounded-xl border border-slate-200 bg-white p-6"><h2 className="font-bold">Simple by design</h2><p className="mt-2 text-sm leading-6 text-slate-600">No templates or complicated setup.</p></div><div className="rounded-xl border border-slate-200 bg-white p-6"><h2 className="font-bold">Built for teams</h2><p className="mt-2 text-sm leading-6 text-slate-600">A calm, repeatable workflow for everyday invoices.</p></div><div className="rounded-xl border border-slate-200 bg-white p-6"><h2 className="font-bold">Privacy-minded</h2><p className="mt-2 text-sm leading-6 text-slate-600">Files are processed for extraction and not stored.</p></div></div><Link href="/extract" className="mt-10 inline-flex rounded-lg bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800">Try PullInvoice</Link></section></main></div>;
}
