import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = { title: 'Contact PullInvoice', description: 'Get help with PullInvoice invoice extraction.' };

export default function ContactPage() {
  return <div className="min-h-screen bg-[#f7f7f8] text-slate-900"><Navbar /><main className="py-10 sm:py-16"><Breadcrumbs current="Contact" /><section className="mx-auto max-w-2xl px-4"><p className="text-sm font-bold uppercase tracking-widest text-slate-950">Contact</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight">We’re here to help.</h1><p className="mt-4 leading-7 text-slate-600">Questions about an extraction, exports, or your account? Send us a note and we’ll get back to you.</p><form action="mailto:hello@pullinvoice.com" method="post" encType="text/plain" className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6"><label className="block text-sm font-semibold">Your email<input name="email" type="email" required className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label><label className="block text-sm font-semibold">How can we help?<textarea name="message" required rows={6} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5" /></label><button className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800">Send message</button></form></section></main></div>;
}
