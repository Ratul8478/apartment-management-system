'use client';

import React from 'react';
import { Zap, Lock, Sparkles } from 'lucide-react';

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-xs uppercase tracking-widest font-mono text-sky-400 font-bold">Why FinTrack Pro</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Transform Finance Operations From Manual Excel to Instant Intelligence
          </h3>
          <p className="text-slate-300 text-base leading-relaxed">
            Finance teams waste dozens of hours every month manually consolidating CSV files, formatting board slides, and double-checking numbers. FinTrack Pro automates the entire reporting pipeline.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <Zap className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white text-base">10x Faster Report Generation</h4>
                <p className="text-xs text-slate-400">Generate executive slide decks and Power BI datasets in seconds instead of days.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <Lock className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white text-base">Role-Based Security & Compliance</h4>
                <p className="text-xs text-slate-400">Granular access controls for Admins, Finance Managers, Analysts, and Auditors.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <Sparkles className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white text-base">Zero-Hallucination AI Insights</h4>
                <p className="text-xs text-slate-400">Claude AI is prompt-grounded strictly in your ledger database records.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-sm font-bold text-white">Impact Comparison</span>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">FINANCE BENCHMARK</span>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Traditional Excel Process</span>
                <span className="text-rose-400">18-24 Hours / Month</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[85%]" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">FinTrack Pro Engine</span>
                <span className="text-emerald-400">Under 5 Minutes</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[12%]" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed">
            "FinTrack Pro reduced our monthly board deck preparation time from 3 days to literally 3 minutes."
            <span className="block font-bold text-white mt-1">— Rajesh Sharma, Group CFO</span>
          </div>
        </div>
      </div>
    </section>
  );
}
