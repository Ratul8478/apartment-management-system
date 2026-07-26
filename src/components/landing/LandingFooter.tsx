'use client';

import React from 'react';
import { Building2 } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="py-12 border-t border-slate-800 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-slate-300">FinTrack Pro Enterprise OS</span>
        </div>
        <div>© 2026 FinTrack Pro Inc. All rights reserved.</div>
      </div>
    </footer>
  );
}
