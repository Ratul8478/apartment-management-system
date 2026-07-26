'use client';

import React from 'react';
import { InvoiceDTO } from '@/types/billing';
import { X, Download, Printer, CheckCircle2, AlertCircle } from 'lucide-react';

interface InvoiceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceDTO | null;
}

export const InvoiceViewerModal: React.FC<InvoiceViewerModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl print:bg-white print:text-black">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-6 print:border-gray-200">
          <div>
            <h2 className="text-2xl font-black text-white print:text-black tracking-tight">FINTRACK PRO</h2>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
              Enterprise AI Finance & Billing Platform
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> {invoice.status}
            </span>
            <h3 className="mt-2 text-lg font-bold text-slate-200 print:text-gray-900">{invoice.invoiceNumber}</h3>
          </div>
        </div>

        {/* Invoice Info Metadata */}
        <div className="grid grid-cols-2 gap-6 my-6 text-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Billed To</span>
            <div className="mt-1 font-semibold text-slate-200 print:text-gray-900">Enterprise Tenant Admin</div>
            <div className="text-xs text-slate-400 print:text-gray-600">Org ID: {invoice.organizationId}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 print:text-gray-600">
              Issue Date: <span className="font-medium text-slate-200 print:text-gray-900">{new Date(invoice.periodStart).toLocaleDateString()}</span>
            </div>
            <div className="text-xs text-slate-400 print:text-gray-600 mt-1">
              Due Date: <span className="font-medium text-slate-200 print:text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto my-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase print:border-gray-200">
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 print:divide-gray-100">
              {invoice.lineItems.map((item, idx) => (
                <tr key={idx} className="text-slate-300 print:text-gray-800">
                  <td className="py-3 font-medium">{item.description}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 text-right font-semibold">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="border-t border-slate-800 pt-4 space-y-2 text-sm text-slate-400 print:border-gray-200">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-200 print:text-gray-900">${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Applied Taxes (GST/VAT):</span>
            <span className="font-semibold text-slate-200 print:text-gray-900">${invoice.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-white print:text-gray-900 pt-2 border-t border-slate-800">
            <span>Total Paid:</span>
            <span className="text-indigo-400 print:text-indigo-600">${invoice.total.toFixed(2)} {invoice.currency}</span>
          </div>
        </div>

        {/* Print / Action Footer */}
        <div className="mt-8 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
