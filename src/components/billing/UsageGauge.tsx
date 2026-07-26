'use client';

import React from 'react';
import { UsageQuotaStatus } from '@/types/billing';
import { AlertTriangle } from 'lucide-react';

interface UsageGaugeProps {
  status: UsageQuotaStatus;
}

export const UsageGauge: React.FC<UsageGaugeProps> = ({ status }) => {
  const isHigh = status.percentageUsed >= 85;
  const isExceeded = status.percentageUsed >= 100;

  return (
    <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">{status.label}</span>
        {isExceeded ? (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Quota Exceeded
          </span>
        ) : isHigh ? (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {status.percentageUsed}% Used
          </span>
        ) : (
          <span className="text-xs font-medium text-slate-400">{status.percentageUsed}% Used</span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between text-xs text-slate-400">
        <span className="text-lg font-extrabold text-white">
          {status.used.toLocaleString()}
        </span>
        <span>
          Quota: <strong className="text-slate-300">{status.quota.toLocaleString()}</strong> {status.unit}
        </span>
      </div>

      <div className="mt-3 relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isExceeded
              ? 'bg-gradient-to-r from-rose-500 to-red-600'
              : isHigh
              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
          }`}
          style={{ width: `${Math.min(100, status.percentageUsed)}%` }}
        />
      </div>
    </div>
  );
};
