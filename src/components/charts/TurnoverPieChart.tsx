'use client';

import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface TurnoverPieChartProps {
  totalTurnover: number;
  totalProfit: number;
  totalCost: number;
}

export function TurnoverPieChart({ totalTurnover, totalProfit, totalCost }: TurnoverPieChartProps) {
  const data = [
    { name: 'Net Profit', value: Math.max(0, totalProfit), color: '#059669' },
    { name: 'Operating Cost', value: Math.max(0, totalCost), color: '#E11D48' },
    { name: 'Reinvested Reserve', value: Math.max(0, totalTurnover - totalProfit - totalCost), color: '#2563EB' },
  ].filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = totalTurnover > 0 ? ((item.value / totalTurnover) * 100).toFixed(1) : 0;

      return (
        <div className="bg-navy-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-navy-700/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
            <span className="font-bold">{item.name}:</span>
            <span className="font-mono font-bold">{formatCurrency(item.value)} ({pct}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingLeft: '20px' }}
          />
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            innerRadius="58%"
            outerRadius="80%"
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>

      {/* Donut Center Label */}
      <div className="absolute top-[46%] left-[40%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="block text-[10px] text-text-secondary dark:text-slate-400 uppercase font-semibold">Total Revenue</span>
        <span className="block text-sm font-bold text-text-primary dark:text-white font-mono">
          {formatCurrency(totalTurnover)}
        </span>
      </div>
    </div>
  );
}
