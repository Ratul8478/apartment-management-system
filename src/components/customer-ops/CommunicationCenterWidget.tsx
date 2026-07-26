'use client';

import React from 'react';
import { CommunicationCampaignDTO } from '@/types/customerOps';
import { Mail, Send, CheckCircle2, BarChart2 } from 'lucide-react';

interface CommunicationCenterWidgetProps {
  campaigns: CommunicationCampaignDTO[];
  onDispatch: (campaignKey: string) => void;
}

export const CommunicationCenterWidget: React.FC<CommunicationCenterWidgetProps> = ({ campaigns, onDispatch }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Communication Automation Engine</h3>
          <p className="text-xs text-slate-400 mt-1">
            Automated onboarding drips, proactive tips, renewal notices, and delivery metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((camp) => (
          <div key={camp.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                {camp.channel} • {camp.triggerType}
              </span>
              <span className="text-xs font-semibold text-emerald-400">{camp.openRatePercentage}% Open Rate</span>
            </div>

            <h4 className="text-base font-bold text-slate-100">{camp.title}</h4>
            <p className="text-xs text-slate-400 font-mono bg-slate-850 p-2.5 rounded-xl border border-slate-800">
              "{camp.subject}"
            </p>

            <div className="flex justify-between text-xs text-slate-400">
              <span>Total Sent: <strong className="text-slate-200">{camp.sentCount}</strong></span>
              <span>Opened: <strong className="text-slate-200">{camp.openCount}</strong></span>
            </div>

            <button
              onClick={() => onDispatch(camp.campaignKey)}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Test Campaign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
