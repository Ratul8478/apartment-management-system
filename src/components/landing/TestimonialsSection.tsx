'use client';

import React from 'react';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-slate-900/60 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest font-mono text-sky-400 font-bold">Measured Business Impact</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white">Proven Results Across Corporate Finance Teams</p>
        </div>

        {/* Success Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="text-4xl font-black text-sky-400 font-mono">≥70%</p>
            <h4 className="text-xs font-semibold text-slate-300">Activation Rate</h4>
            <p className="text-[11px] text-slate-500">Admins complete first upload within 7 days</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="text-4xl font-black text-emerald-400 font-mono">≥50%</p>
            <h4 className="text-xs font-semibold text-slate-300">Reporting Time Saved</h4>
            <p className="text-[11px] text-slate-500">Reduction in monthly board prep time</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="text-4xl font-black text-purple-400 font-mono">≥3x</p>
            <h4 className="text-xs font-semibold text-slate-300">Weekly Usage</h4>
            <p className="text-[11px] text-slate-500">Active sessions per licensed user per week</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="text-4xl font-black text-amber-400 font-mono">99.9%</p>
            <h4 className="text-xs font-semibold text-slate-300">Audit Compliance</h4>
            <p className="text-[11px] text-slate-500">Grounded AI data precision & change logs</p>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 relative">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "FinTrack Pro completely replaced our messy Excel workflow. Generating board presentation slides now takes under 3 minutes, and our leadership team trusts every figure."
            </p>
            <div>
              <h4 className="text-sm font-bold text-white">Vikramaditya Rao</h4>
              <p className="text-[11px] text-slate-400">Chief Financial Officer, Apex Tech</p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 relative">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The prompt-grounded Claude AI assistant is a game changer. We ask complex questions about turnover variances across quarters and get instant, accurate answers."
            </p>
            <div>
              <h4 className="text-sm font-bold text-white">Priya Patel</h4>
              <p className="text-[11px] text-slate-400">VP of Finance Operations, Horizon Financial</p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 relative">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Onboarding our whole finance department took less than 10 minutes. The role-based permissions and audit trail give us total confidence in our records."
            </p>
            <div>
              <h4 className="text-sm font-bold text-white">Siddharth Sen</h4>
              <p className="text-[11px] text-slate-400">Lead Financial Analyst, Nexus Corp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
