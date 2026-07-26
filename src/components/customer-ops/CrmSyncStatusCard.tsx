'use client';

import React, { useState } from 'react';
import { CrmSyncStatusDTO } from '@/types/customerOps';
import { RefreshCw, CheckCircle2, Cloud, Database } from 'lucide-react';

interface CrmSyncStatusCardProps {
  status: CrmSyncStatusDTO | null;
  onTriggerSync: (provider: 'SALESFORCE' | 'HUBSPOT' | 'ZOHO' | 'MOCK') => void;
  isSyncing?: boolean;
}

export const CrmSyncStatusCard: React.FC<CrmSyncStatusCardProps> = ({ status, onTriggerSync, isSyncing }) => {
  const [selectedProvider, setSelectedProvider] = useState<'SALESFORCE' | 'HUBSPOT' | 'ZOHO' | 'MOCK'>('MOCK');

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Enterprise CRM Integration Layer</h3>
            <p className="text-xs text-slate-400">Bi-directional contact & customer health score synchronization</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Connected ({status?.crmProvider || 'MOCK'})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">CRM Platform Provider</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as any)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="MOCK">Enterprise Sandbox (Mock)</option>
            <option value="SALESFORCE">Salesforce CRM</option>
            <option value="HUBSPOT">HubSpot CRM</option>
            <option value="ZOHO">Zoho CRM</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Last Synchronized</label>
          <div className="px-3 py-2 bg-slate-850 border border-slate-800 rounded-xl text-slate-200 text-xs font-semibold">
            {status ? new Date(status.syncedAt).toLocaleString() : 'Never'}
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => onTriggerSync(selectedProvider)}
            disabled={isSyncing}
            className="w-full py-2 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-900/30 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : 'Sync CRM Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
