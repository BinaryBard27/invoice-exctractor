'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

function SuccessContent() {
  const searchParams = useSearchParams();
  const licenseKey = searchParams.get('license_key') || '';
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!licenseKey) {
      setStatus('error');
      return;
    }

    // Checking Gumroad license
    fetch(`/api/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ license_key: licenseKey })
    })
      .then(res => res.json())
      .then(async data => {
        if (data.verified) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [licenseKey]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 max-w-lg mx-auto text-center mt-20">
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <h2 className="text-2xl font-bold text-slate-900">Verifying payment...</h2>
          <p className="text-slate-500">Please wait while we confirm your purchase.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 text-success rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Payment confirmed</h2>
            <p className="text-slate-600 text-lg">
              Thank you! You now have unlimited invoice extractions forever.
            </p>
          </div>
          <Link 
            href="/extract"
            className="w-full py-4 mt-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2"
          >
            Back to Tool <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 bg-red-50 text-error rounded-full flex items-center justify-center mb-2">
            <XCircle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Payment Verification Failed</h2>
            <p className="text-slate-600">
              We couldn&apos;t verify your payment. If you believe this is an error, please try again or contact support.
            </p>
          </div>
          <Link 
            href="/extract"
            className="w-full py-4 mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors"
          >
            Return to App
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="px-4">
        <Suspense fallback={<div className="mt-32 text-center text-slate-500">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
