'use client';

import React from 'react';
import { PlanDTO, BillingCycle } from '@/types/billing';
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface PlanCardProps {
  plan: PlanDTO;
  billingCycle: BillingCycle;
  currentPlanCode?: string;
  onSelectPlan: (plan: PlanDTO) => void;
  isLoading?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  billingCycle,
  currentPlanCode,
  onSelectPlan,
  isLoading,
}) => {
  const isCurrent = currentPlanCode === plan.code;
  const price = billingCycle === 'YEARLY' ? plan.priceYearly : plan.priceMonthly;
  const isPopular = plan.code === 'PROFESSIONAL';

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 ${
        isPopular
          ? 'bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/80 shadow-2xl shadow-indigo-500/20'
          : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-xs font-semibold text-white shadow-md flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Most Popular Enterprise Choice
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-100">{plan.name}</h3>
          {isCurrent && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Plan
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-slate-400 min-h-[40px]">{plan.description}</p>

        <div className="mt-5 flex items-baseline">
          <span className="text-4xl font-extrabold text-white">${price}</span>
          <span className="ml-1.5 text-sm font-medium text-slate-400">
            /{billingCycle === 'YEARLY' ? 'year' : 'month'}
          </span>
        </div>

        {billingCycle === 'YEARLY' && plan.priceMonthly > 0 && (
          <p className="mt-1 text-xs text-indigo-400 font-medium">
            Save ${plan.priceMonthly * 12 - plan.priceYearly} / year (Annual discount applied)
          </p>
        )}

        <hr className="my-6 border-slate-800" />

        <div className="space-y-3">
          <div className="flex items-center text-xs text-slate-300 font-semibold uppercase tracking-wider">
            Included Quotas & Features
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-300">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{(plan.features.aiTokenQuotaMonthly / 1000).toLocaleString()}k Monthly AI Tokens</span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-300">
            <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>{plan.features.apiRequestsMonthly.toLocaleString()} API Requests</span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-300">
            <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>{plan.features.ocrDocumentsMonthly} OCR Document Scans</span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-300">
            <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>{plan.features.userLimit} User Accounts</span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{plan.features.slaPercentage}% Guaranteed SLA</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => onSelectPlan(plan)}
          disabled={isCurrent || isLoading}
          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg ${
            isCurrent
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : isPopular
              ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/25'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
          }`}
        >
          {isCurrent ? 'Current Subscription' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
};
