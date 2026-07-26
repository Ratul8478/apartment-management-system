'use client';

import React from 'react';
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenModal: (modal: 'DEMO' | 'CREATE_ORG' | 'CONSULTATION' | 'WATCH_DEMO' | 'CONTACT_SALES') => void;
}

export function HeroSection({ onOpenModal }: HeroSectionProps) {
  return (
    <section className="relative pt-20 pb-24 px-6 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-sky-400 shadow-xl">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Next-Gen Finance Intelligence & Automated Reporting Engine
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
          Corporate Finance Management <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Simplified & AI Grounded.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Consolidate company turnover, net profit margins, share values, and employee rosters into one real-time enterprise system with 1-click PowerPoint & Power BI report generators.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onOpenModal('CREATE_ORG')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 font-bold text-base text-white hover:opacity-95 transition-all shadow-xl shadow-indigo-500/30 flex items-center gap-3 group"
          >
            Create Organization <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onOpenModal('DEMO')}
            className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 font-semibold text-base text-slate-200 transition-all flex items-center gap-2"
          >
            Request Live Demo
          </button>

          <button
            onClick={() => onOpenModal('WATCH_DEMO')}
            className="px-6 py-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 font-medium text-sm text-sky-400 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-sky-400" /> Watch Video Tour
          </button>
        </div>

        {/* Trust Highlights */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-400 text-xs font-mono border-t border-slate-800/60 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> SOC2 Type II Security
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full Audit Log Compliance
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Grounded Anthropic Claude AI
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Native PPT & Power BI Export
          </div>
        </div>
      </div>
    </section>
  );
}
