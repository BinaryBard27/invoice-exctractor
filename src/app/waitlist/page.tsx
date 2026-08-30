import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = { title: 'Join the PullInvoice waitlist', description: 'Be the first to hear about new PullInvoice features.' };

export default function WaitlistPage() {
  return <div className="min-h-screen bg-[#f7f7f8] text-slate-900"><Navbar /><main className="py-10 sm:py-16"><Breadcrumbs current="Waitlist" /><section className="mx-auto max-w-xl px-4 text-center"><p className="text-sm font-bold uppercase tracking-widest text-slate-950">Coming soon</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight">Get product updates first.</h1><p className="mt-4 text-slate-600">Join the waitlist for new workflows, integrations, and early access.</p><form action="mailto:hello@pullinvoice.com" method="post" encType="text/plain" className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"><input name="email" type="email" required placeholder="you@example.com" aria-label="Email address" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3" /><button className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800">Join waitlist</button></form></section></main></div>;
}
