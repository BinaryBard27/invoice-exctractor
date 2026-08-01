import Link from 'next/link';
import { UserButton, Show, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight text-slate-950">
            <span className="rounded-lg bg-slate-950 p-1.5 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </span>
            InvoiceParser
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/extract" className="hidden text-sm font-semibold text-slate-600 hover:text-slate-950 sm:block">
              Invoice tool
            </Link>
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
}
