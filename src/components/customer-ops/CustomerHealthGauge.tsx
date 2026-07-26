'use client';

import React from 'react';
import { CustomerHealthScoreDTO } from '@/types/customerOps';
import { ShieldCheck, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface CustomerHealthGaugeProps {
  health: CustomerHealthScoreDTO | null;
}

export const CustomerHealthGauge: React.FC<CustomerHealthGaugeProps> = ({ health }) => {
  if (!health) return null;

  const isExcellent = health.score >= 90;
  const isHealthy = health.score >= 70 && health.score < 90;
  const isAtRisk = health.score >= 50 && health.score < 70;

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Customer Health Score & Index</h3>
          <p className="text-xs text-slate-400 mt-1">
            Measurable 7-factor health index evaluated in real time.
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
            isExcellent
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : isHealthy
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              : isAtRisk
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          {health.category} ({health.score}/100)
        </span>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center gap-6 p-4 bg-slate-850 border border-slate-800 rounded-xl">
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-indigo-500/30 bg-slate-900">
          <span className="text-3xl font-black text-white">{health.score}</span>
        </div>

        <div className="flex-1 space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Onboarding Completion:</span>
            <strong className="text-slate-100">{health.scoreFactors.onboardingCompletion}%</strong>
          </div>
          <div className="flex justify-between">
            <span>Active Days / Week:</span>
            <strong className="text-slate-100">{health.scoreFactors.loginFrequencyDaysPerWeek} Days</strong>
          </div>
          <div className="flex justify-between">
            <span>AI Token Quota Usage:</span>
            <strong className="text-indigo-400">{health.scoreFactors.aiTokenUtilizationPercentage}%</strong>
          </div>
          <div className="flex justify-between">
            <span>Billing Standing:</span>
            <strong className="text-emerald-400">{health.scoreFactors.billingStanding}</strong>
          </div>
        </div>
      </div>

      {/* CS Recommendations */}
      {health.recommendations.length > 0 && (
        <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-400" /> Proactive Success Recommendations
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {health.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
