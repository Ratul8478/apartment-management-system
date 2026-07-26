'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, FileSpreadsheet } from 'lucide-react';

export function DashboardPreviewSection() {
  const [previewTab, setPreviewTab] = useState<'ANALYTICS' | 'AI_CHAT' | 'REPORTS' | 'SHARE'>('ANALYTICS');

  return (
    <section id="preview" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest font-mono text-sky-400 font-bold">Interactive UI Preview</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white">Experience the FinTrack Pro Interface</p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-2 max-w-lg mx-auto p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setPreviewTab('ANALYTICS')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              previewTab === 'ANALYTICS' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard KPIs
          </button>
          <button
            onClick={() => setPreviewTab('AI_CHAT')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              previewTab === 'AI_CHAT' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setPreviewTab('REPORTS')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              previewTab === 'REPORTS' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            PPT Studio
          </button>
          <button
            onClick={() => setPreviewTab('SHARE')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              previewTab === 'SHARE' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Share Tracking
          </button>
        </div>

        {/* Interactive Component Frame */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl max-w-5xl mx-auto min-h-[380px] flex flex-col justify-center">
          {previewTab === 'ANALYTICS' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Total Turnover</span>
                  <p className="text-2xl font-bold text-sky-400">₹7,29,00,000</p>
                  <span className="text-[10px] text-emerald-400">▲ +18.4% vs T12M</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Net Profit / Loss</span>
                  <p className="text-2xl font-bold text-emerald-400">₹2,09,00,000</p>
                  <span className="text-[10px] text-emerald-400">28.6% Margin</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Operational Cost</span>
                  <p className="text-2xl font-bold text-rose-400">₹4,66,00,000</p>
                  <span className="text-[10px] text-slate-400">Controlled Overhead</span>
                </div>
              </div>

              <div className="h-40 rounded-2xl bg-slate-950 border border-slate-800 p-4 flex items-end justify-between gap-3">
                {[45, 52, 58, 49, 64, 72, 81].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-sky-500/20 hover:bg-sky-500 rounded-t-lg transition-all" style={{ height: `${val * 1.5}px` }} />
                    <span className="text-[10px] text-slate-500 font-mono">M{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewTab === 'AI_CHAT' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold">
                  <Bot className="w-4 h-4" /> User Question:
                </div>
                <p className="text-sm text-slate-200">"Summarize Q2 turnover growth and net margin performance."</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <Sparkles className="w-4 h-4" /> Anthropic Claude AI Grounded Response:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Based on your verified database ledger: Q2 Turnover reached <strong>₹2.52 Crores</strong> (+14.2% QoQ growth). Net profit expanded to <strong>₹72 Lakhs</strong> (net margin of 28.5%), outperforming target baseline targets.
                </p>
              </div>
            </div>
          )}

          {previewTab === 'REPORTS' && (
            <div className="text-center space-y-6 py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">PowerPoint & Power BI Exporter</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Export structured `.pptx` presentations and `.csv` Power BI dataset templates instantly.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <span className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-400">.pptx Slide Deck</span>
                <span className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">Power BI CSV Schema</span>
              </div>
            </div>
          )}

          {previewTab === 'SHARE' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">Company Share Price Valuation</h4>
                  <p className="text-xs text-slate-400">Historical valuation trends & quarterly growth metrics</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold">
                  ₹450.00 / Share
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">52-Wk High</span>
                  <p className="font-bold text-amber-400 text-sm">₹485.00</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">52-Wk Low</span>
                  <p className="font-bold text-slate-300 text-sm">₹310.00</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">YoY Valuation Gain</span>
                  <p className="font-bold text-emerald-400 text-sm">+24.5%</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Peer Comparison Benchmark</span>
                  <p className="font-bold text-sky-400 text-sm">Top 5%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
