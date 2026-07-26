'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { ChartBucket } from '@/types';

interface TurnoverBarChartProps {
  data: ChartBucket[];
  timeRange: 'daily' | 'monthly' | 'yearly';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-navy-700/80 text-xs space-y-2">
        <p className="font-bold text-slate-200 border-b border-navy-700/80 pb-1 font-mono">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 font-medium" style={{ color: entry.color }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function TurnoverBarChart({ data, timeRange }: TurnoverBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-400 text-xs italic">
        No financial data available for selected period.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" strokeOpacity={0.4} vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(val) => formatCurrency(val)}
            tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '12px', fontWeight: 600 }}
          />
          <Bar
            dataKey="turnover"
            name="Turnover"
            fill="#2563EB"
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
          <Bar
            dataKey="profit"
            name="Net Profit"
            fill="#059669"
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
