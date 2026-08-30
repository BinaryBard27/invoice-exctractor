'use client';

import { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(localStorage.getItem('pullinvoice_cookie_consent') !== 'accepted'), []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
      <p>We use essential cookies to keep PullInvoice secure and remember your preferences. <a href="/contact" className="font-semibold text-slate-950 underline">Learn more</a>.</p>
      <button onClick={() => { localStorage.setItem('pullinvoice_cookie_consent', 'accepted'); setVisible(false); }} className="shrink-0 rounded-lg bg-slate-950 px-4 py-2 font-bold text-white hover:bg-slate-800">Got it</button>
    </div>
  );
}
