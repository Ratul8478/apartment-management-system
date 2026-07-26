'use client';

import React from 'react';
import { Lock, ShieldCheck, Layers } from 'lucide-react';

export function SecuritySection() {
  return (
    <section id="security" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/60">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest font-mono text-sky-400 font-bold">Bank-Grade Compliance</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white">Enterprise Security Architecture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <Lock className="w-6 h-6 text-sky-400" />
            <h3 className="font-bold text-white">Bcrypt Password Hashing</h3>
            <p className="text-xs text-slate-400">Zero plaintext storage. NextAuth JWT session encryption across all endpoints.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <h3 className="font-bold text-white">Service-Layer Audit Trail</h3>
            <p className="text-xs text-slate-400">Centralized audit log tracking who altered figures, uploaded CSVs, or generated reports.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <Layers className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white">Role-Based Access Guard</h3>
            <p className="text-xs text-slate-400">Strict separation between Admin, Finance Manager, Analyst, and Auditor permissions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
