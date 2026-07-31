"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function WelcomeToast() {
  const { user, isLoaded } = useUser();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const now = new Date().getTime();
      const createdAt = user.createdAt?.getTime() || 0;
      
      // If the user was created within the last 2 minutes, show the welcome message
      const isNewUser = now - createdAt < 2 * 60 * 1000;
      
      // We also check sessionStorage so we don't show it repeatedly on refresh
      const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
      
      if (isNewUser && !hasSeenWelcome) {
        setShow(true);
        sessionStorage.setItem("hasSeenWelcome", "true");
        
        // Auto-hide after 5 seconds
        setTimeout(() => setShow(false), 5000);
      }
    }
  }, [isLoaded, user]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-4 flex items-start gap-3 max-w-sm">
        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Welcome aboard! 🎉</h3>
          <p className="text-slate-600 text-sm mt-1">
            Thank you for signing in! You&apos;re ready to start extracting invoices.
          </p>
        </div>
        <button 
          onClick={() => setShow(false)}
          className="text-slate-400 hover:text-slate-600 ml-2"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
