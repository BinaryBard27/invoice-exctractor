import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return <div className="min-h-screen bg-[#f7f7f8]"><Navbar /><main className="mx-auto max-w-2xl px-4 py-24 text-center"><p className="text-sm font-bold uppercase tracking-widest text-slate-500">Error 404</p><h1 className="mt-3 text-4xl font-extrabold text-slate-950">This page got lost in the paperwork.</h1><p className="mt-4 text-slate-600">The page you’re looking for doesn’t exist or may have moved.</p><Link href="/" className="mt-8 inline-flex rounded-lg bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800">Back to PullInvoice</Link></main></div>;
}
