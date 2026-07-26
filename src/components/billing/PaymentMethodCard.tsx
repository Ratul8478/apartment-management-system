'use client';

import React from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';

interface PaymentMethodCardProps {
  method: {
    id: string;
    gateway: string;
    type: string;
    brand: string | null;
    last4: string | null;
    expMonth: number | null;
    expYear: number | null;
    isDefault: boolean;
  };
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ method }) => {
  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        method.isDefault
          ? 'bg-indigo-950/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
          : 'bg-slate-900/60 border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-800 rounded-xl text-slate-200">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-100">
              {method.brand || 'Credit Card'} •••• {method.last4 || '4242'}
            </div>
            <div className="text-xs text-slate-400">
              Expires {method.expMonth || 12}/{method.expYear || 2028} • Gateway: {method.gateway}
            </div>
          </div>
        </div>

        {method.isDefault && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Primary
          </span>
        )}
      </div>
    </div>
  );
};
