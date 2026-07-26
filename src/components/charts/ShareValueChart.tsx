'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatDate } from '@/lib/utils';
import { ShareValueItem } from '@/types';

interface ShareValueChartProps {
  data: ShareValueItem[];
}

export function ShareValueChart({ data }: ShareValueChartProps) {
  const [range, setRange] = useState<'1D' | '1W' | '1M' | '1Y' | '5Y'>('1Y');

  // Filter data based on range toggle
  const getFilteredData = () => {
    if (!data || data.length === 0) return [];
    if (range === '1D') return data.slice(-2);
    if (range === '1W') return data.slice(-4);
    if (range === '1M') return data.slice(-6);
    if (range === '1Y') return data.slice(-12);
    return data;
  };

  const chartData = getFilteredData().map((item) => ({
    date: formatDate(item.recordDate),
    price: item.price,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-navy-700/80 text-xs">
          <p className="text-slate-300 font-semibold mb-1">{label}</p>
          <p className="text-base font-extrabold font-mono text-blue-400">
            ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Range Selector Controls */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-700/80 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-navy-950 p-1.5 rounded-xl border border-slate-200/60 dark:border-navy-800">
          {(['1D', '1W', '1M', '1Y', '5Y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                range === r
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <span className="text-xs font-medium text-text-secondary dark:text-slate-400">
          Historical Share Performance (INR ₹)
        </span>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="shareGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" strokeOpacity={0.4} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} axisLine={{ stroke: '#E2E8F0' }} />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(val) => `₹${val}`}
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#4F46E5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#shareGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
