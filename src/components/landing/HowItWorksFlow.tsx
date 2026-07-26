'use client';

import React from 'react';

export function HowItWorksFlow() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/60">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest font-mono text-sky-400 font-bold">Conversion & Activation Flow</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white">How FinTrack Pro Works</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 font-mono font-bold flex items-center justify-center border border-sky-500/20">01</div>
            <h3 className="font-bold text-white text-lg">Create Organization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Setup your company account, select base currency, and invite team members.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 font-mono font-bold flex items-center justify-center border border-indigo-500/20">02</div>
            <h3 className="font-bold text-white text-lg">Import Finance Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Bulk upload monthly turnover CSVs or use manual entry forms.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 font-mono font-bold flex items-center justify-center border border-purple-500/20">03</div>
            <h3 className="font-bold text-white text-lg">Analyze & AI Query</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Explore interactive daily/monthly chart rollups & query Claude AI.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-mono font-bold flex items-center justify-center border border-emerald-500/20">04</div>
            <h3 className="font-bold text-white text-lg">Export Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Download executive PowerPoint decks & Power BI structured datasets.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
