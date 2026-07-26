'use client';

import React from 'react';
import { PlanDTO, BillingCycle, ProrationCalculation } from '@/types/billing';
import { X, ArrowRight, ShieldAlert, CreditCard } from 'lucide-react';

interface ProrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlan: PlanDTO | null;
  currentPlanCode: string;
  billingCycle: BillingCycle;
  proration: ProrationCalculation | null;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const ProrationModal: React.FC<ProrationModalProps> = ({
  isOpen,
  onClose,
  targetPlan,
  currentPlanCode,
  billingCycle,
  proration,
  onConfirm,
  isSubmitting,
}) => {
  if (!isOpen || !targetPlan || !proration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Confirm Plan Modification</h3>
            <p className="text-xs text-slate-400">Financial Proration & Line-Item Breakdown</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between p-4 bg-slate-850 border border-slate-800 rounded-xl">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase">From Plan</span>
            <div className="text-base font-bold text-slate-200">{currentPlanCode}</div>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-400" />
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase">To Plan</span>
            <div className="text-base font-bold text-indigo-400">{targetPlan.name}</div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Billing Frequency:</span>
            <span className="font-semibold text-slate-200 uppercase">{billingCycle}</span>
          </div>

          <div className="flex justify-between text-sm text-slate-400">
            <span>Remaining Period Days:</span>
            <span className="font-semibold text-slate-200">
              {proration.daysRemainingInPeriod} of {proration.daysTotalInPeriod} Days
            </span>
          </div>

          <div className="flex justify-between text-sm text-slate-400">
            <span>Unused Credit ({currentPlanCode}):</span>
            <span className="font-semibold text-emerald-400">-${proration.unusedCurrentPlanCredit}</span>
          </div>

          <div className="flex justify-between text-sm text-slate-400">
            <span>Prorated Charge ({targetPlan.name}):</span>
            <span className="font-semibold text-slate-200">+${proration.newPlanProratedCharge}</span>
          </div>

          <div className="flex justify-between text-sm text-slate-400">
            <span>Applicable Tax (GST 18%):</span>
            <span className="font-semibold text-slate-200">+${proration.taxAmount}</span>
          </div>

          <hr className="border-slate-800 my-2" />

          <div className="flex justify-between text-base font-bold text-white">
            <span>Net Payable Today:</span>
            <span className="text-indigo-400 text-lg">${proration.netPayableAmount}</span>
          </div>
        </div>

        <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/90 leading-relaxed">
            Your new quotas and entitlements will take effect immediately upon confirmation. An immutable invoice
            and audit record will be automatically generated.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/40 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Processing...</span>
            ) : (
              <span>Confirm & Activate (${proration.netPayableAmount})</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
