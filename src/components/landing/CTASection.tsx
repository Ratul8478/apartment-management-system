'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onOpenModal: (modal: 'DEMO' | 'CREATE_ORG' | 'CONSULTATION' | 'WATCH_DEMO' | 'CONTACT_SALES') => void;
}

export function CTASection({ onOpenModal }: CTASectionProps) {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto p-12 rounded-3xl bg-gradient-to-r from-sky-900/60 via-indigo-900/60 to-purple-900/60 border border-sky-500/30 text-center space-y-8 relative z-10 backdrop-blur-xl shadow-2xl">
        <h2 className="text-4xl md:text-5xl font-black text-white">
          Ready to Automate Your Corporate Finance Engine?
        </h2>
        <p className="text-slate-200 text-base max-w-2xl mx-auto">
          Join modern finance leaders managing turnover, margins, share valuation, and board decks with FinTrack Pro.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onOpenModal('CREATE_ORG')}
            className="px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold text-base hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2"
          >
            Create Organization Free Trial <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onOpenModal('CONSULTATION')}
            className="px-8 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-700 font-semibold text-base text-white transition-all"
          >
            Book 1-on-1 Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
