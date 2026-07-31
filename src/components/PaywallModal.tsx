'use client';

import { Lock, X } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface PaywallModalProps {
  onClose: () => void;
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const { user } = useUser();

  const handleVerify = async () => {
    if (!licenseKey.trim()) {
      setError('Please enter a license key.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license_key: licenseKey.trim(),
        }),
      });

      const data = await res.json();

      if (data.verified) {
        // It's valid
        localStorage.setItem('invoice_paid', 'true');
        if (user) {
          await user.update({ unsafeMetadata: { invoice_paid: true } });
        }
        window.location.reload();
      } else {
        setError('Invalid or expired license key.');
      }
    } catch (err) {
      console.error('Failed to verify license key', err);
      setError('An error occurred while verifying. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-slate-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">You&apos;ve used your free extractions</h2>
            <p className="text-slate-600">
              Unlock unlimited extractions for a one-time $19 payment.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <a
              href={`https://gumroad.com/l/${process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-lg shadow-md transition-colors flex justify-center items-center gap-2"
            >
              Pay $19 — Get License Key
            </a>
            
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3 text-left font-medium">Already paid? Enter your license key:</p>
              <input
                type="text"
                placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow mb-3"
              />
              {error && <p className="text-red-500 text-sm mb-3 text-left">{error}</p>}
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-md transition-colors disabled:opacity-70"
              >
                {loading ? 'Verifying...' : 'Verify License'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
