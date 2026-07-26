'use client';

import React from 'react';
import { ProductAnalyticsSummary } from '@/types/customerOps';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, Activity, Zap, Sparkles } from 'lucide-react';

interface ProductAnalyticsDashboardProps {
  analytics: ProductAnalyticsSummary | null;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export const ProductAnalyticsDashboard: React.FC<ProductAnalyticsDashboardProps> = ({ analytics }) => {
  if (!analytics) return null;

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Daily Active Users (DAU)</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">{analytics.dau}</div>
          <div className="mt-1 text-xs text-emerald-400 font-semibold">Active team members today</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Monthly Active Users (MAU)</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">{analytics.mau}</div>
          <div className="mt-1 text-xs text-slate-400">DAU/MAU Stickiness: {analytics.dauMauRatioPercentage}%</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Product Events Ingested</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">{analytics.totalEventsLogged.toLocaleString()}</div>
          <div className="mt-1 text-xs text-slate-400">Real-time interaction log stream</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>AI Token Ingestion Rate</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">420k</div>
          <div className="mt-1 text-xs text-emerald-400 font-medium">Tokens / month</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Usage Trend Over 7 Days */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-base font-bold text-slate-100 mb-4">Grounded AI Utilization Trend (7 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.aiFeatureUsageTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="aiTokenCount" name="AI Tokens" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ocrScanCount" name="OCR Scans" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Adoption Breakdown */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-base font-bold text-slate-100 mb-4">Top Feature Adoption</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.topFeaturesUsed}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                >
                  {analytics.topFeaturesUsed.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {analytics.topFeaturesUsed.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.count} ops</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
