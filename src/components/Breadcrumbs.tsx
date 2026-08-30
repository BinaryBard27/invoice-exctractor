import Link from 'next/link';

export default function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto mb-8 max-w-6xl px-4 text-sm text-slate-500 sm:px-6">
      <Link href="/" className="hover:text-slate-950">Home</Link>
      <span className="mx-2" aria-hidden="true">/</span>
      <span aria-current="page" className="text-slate-700">{current}</span>
    </nav>
  );
}
