'use client';

import React, { useState } from 'react';
import { Calculator, Percent } from 'lucide-react';

export const TaxCalculatorWidget: React.FC = () => {
  const [country, setCountry] = useState('IN');
  const [subtotal, setSubtotal] = useState(199);
  const [isExempt, setIsExempt] = useState(false);

  const getTaxRate = () => {
    if (isExempt) return 0;
    if (country === 'IN') return 18;
    if (country === 'GB') return 20;
    if (country === 'DE') return 19;
    if (country === 'US') return 8.25;
    return 0;
  };

  const rate = getTaxRate();
  const taxAmount = Math.round(subtotal * (rate / 100) * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
          <Calculator className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-slate-100">Regional Taxation Simulator</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Customer Jurisdiction</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="IN">India (GST 18%)</option>
            <option value="GB">United Kingdom (VAT 20%)</option>
            <option value="DE">Germany (VAT 19%)</option>
            <option value="US">United States (Sales Tax 8.25%)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Subtotal Amount ($)</label>
          <input
            type="number"
            value={subtotal}
            onChange={(e) => setSubtotal(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={isExempt}
              onChange={(e) => setIsExempt(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Tax Exempt Org</span>
          </label>
        </div>
      </div>

      <div className="mt-4 p-4 bg-slate-850 border border-slate-800 rounded-xl flex items-center justify-between text-sm">
        <div className="text-slate-400">
          Applied Rate: <strong className="text-slate-200">{rate}%</strong> | Tax Amount:{' '}
          <strong className="text-indigo-400">${taxAmount.toFixed(2)}</strong>
        </div>
        <div className="text-base font-bold text-white">
          Total Payable: <span className="text-emerald-400">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
