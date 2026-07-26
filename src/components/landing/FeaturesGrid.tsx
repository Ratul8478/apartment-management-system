'use client';

import React from 'react';
import { BarChart3, Bot, FileSpreadsheet, TrendingUp, Users, ShieldCheck } from 'lucide-react';

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest font-mono text-sky-400 font-bold">Enterprise Capabilities</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white">Built for CFOs, Analysts & Leadership Teams</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all space-y-4 group">
            <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-400 w-fit border border-sky-500/20 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Real-Time Financial Dashboard</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Daily, monthly, and yearly turnover rollups, profit-loss tracking, and margin benchmarks rendered in dynamic responsive charts.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-4 group">
            <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 w-fit border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Financial Assistant</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Prompt-scoped Anthropic Claude AI assistant grounded strictly in your database records to answer variance and margin questions safely.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4 group">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">PowerPoint & Power BI Exports</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate executive-ready `.pptx` presentation slide decks and Power BI structured dataset schemas in a single click.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all space-y-4 group">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 w-fit border border-amber-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Share Value & Peer Tracking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track historical company share valuation trends and compare performance against peer market benchmarks.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4 group">
            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Employee Roster Directory</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Centralized staff directory for finance leadership, managers, and analysts linked directly to system logins.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all space-y-4 group">
            <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 w-fit border border-rose-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Audit Log & RBAC Guard</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Immutable change tracking layer recording all finance additions, CSV imports, and user status toggles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
