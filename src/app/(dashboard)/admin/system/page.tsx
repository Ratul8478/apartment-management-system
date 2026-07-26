'use client';

import React from 'react';
import { FreeTierStatusWidget } from '@/components/FreeTierStatusWidget';
import { ShieldCheck, Server, Key, Terminal, Cpu } from 'lucide-react';

export default function AdminSystemPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Server className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System & Free-Tier Infrastructure</h1>
            <p className="text-sm text-slate-400">
              Live monitoring, health diagnostics, security configurations, and free-tier cloud service integrations.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Free Tier Status Widget */}
      <FreeTierStatusWidget />

      {/* Deployment & Environment Diagnostic Commands */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
            <Terminal className="w-4 h-4" />
            Config Audit & Audit Script
          </div>
          <p className="text-xs text-slate-400">
            Runs automated environment schema validation across all active environment variables.
          </p>
          <code className="block bg-slate-950 p-2.5 rounded-lg text-xs font-mono text-indigo-300 border border-slate-800">
            npm run config:audit
          </code>
        </div>

        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Cpu className="w-4 h-4" />
            Database Platform Diagnostic
          </div>
          <p className="text-xs text-slate-400">
            Verifies dual Supabase PostgreSQL connections (Pooled + Direct URL) & PGlite offline fallback.
          </p>
          <code className="block bg-slate-950 p-2.5 rounded-lg text-xs font-mono text-emerald-300 border border-slate-800">
            npm run db:platform-check
          </code>
        </div>

        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4" />
            Production Build & Bundle Check
          </div>
          <p className="text-xs text-slate-400">
            Generates optimized Next.js serverless bundles ready for zero-downtime Vercel/Render deployment.
          </p>
          <code className="block bg-slate-950 p-2.5 rounded-lg text-xs font-mono text-purple-300 border border-slate-800">
            npm run build
          </code>
        </div>
      </div>
    </div>
  );
}
