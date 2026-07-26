'use client';

import React from 'react';
import { RevenueAnalyticsSummary } from '@/types/billing';
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
import { TrendingUp, Users, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';

interface RevenueAnalyticsChartsProps {
  data: RevenueAnalyticsSummary | null;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export const RevenueAnalyticsCharts: React.FC<RevenueAnalyticsChartsProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Monthly Recurring (MRR)</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">${data.mrr.toLocaleString()}</div>
          <div className="mt-1 text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.4% vs last month
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Annual Run-Rate (ARR)</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">${data.arr.toLocaleString()}</div>
          <div className="mt-1 text-xs text-slate-400">Projected annualized revenue</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Customer Lifetime Value</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">${data.lifetimeValueAverage.toLocaleString()}</div>
          <div className="mt-1 text-xs text-slate-400">Avg LTV per subscriber</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Monthly Churn Rate</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">{data.churnRatePercentage}%</div>
          <div className="mt-1 text-xs text-emerald-400 font-medium">Below 3.0% SaaS benchmark</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MRR Growth Trend (AreaChart) */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-base font-bold text-slate-100 mb-4">MRR Trajectory & Expansion</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyTrend}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Distribution by Plan (PieChart) */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-base font-bold text-slate-100 mb-4">Revenue by Commercial Plan</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.revenueByPlan}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                  nameKey="planName"
                >
                  {data.revenueByPlan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {data.revenueByPlan.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{item.planName}</span>
                </div>
                <span className="font-semibold">${item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
