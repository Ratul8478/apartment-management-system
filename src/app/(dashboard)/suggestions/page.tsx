'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Check,
  TrendingUp,
  Activity,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Recommendation {
  id: string;
  title: string;
  rationale: string;
  impact: string;
  priority: 'High' | 'Medium' | 'Low';
  actioned: boolean;
  score: number;
}

export default function SuggestionsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 'rec-1',
      title: 'Optimize Q4 Operating Expenses',
      rationale: 'Administrative overhead increased by 8.4% in August. Re-negotiating enterprise vendor contracts could yield ₹15.2 Lakhs in quarterly savings.',
      impact: '₹15.2L Savings',
      priority: 'High',
      actioned: false,
      score: 88,
    },
    {
      id: 'rec-2',
      title: 'Hedge Foreign Exchange Reserves',
      rationale: 'Cross-border USD vendor payments show slight currency fluctuation vulnerability. Recommended hedging 30% of trailing quarterly volume.',
      impact: 'Risk Reduction (Medium)',
      priority: 'Medium',
      actioned: false,
      score: 74,
    },
    {
      id: 'rec-3',
      title: 'Accelerate Receivables Collection Cycle',
      rationale: 'Average DSO (Days Sales Outstanding) extended from 32 to 38 days. Implementing 2/10 net 30 early payment discounts will stabilize working capital.',
      impact: '+12% Cash Flow',
      priority: 'High',
      actioned: true,
      score: 92,
    },
    {
      id: 'rec-4',
      title: 'Re-invest Surplus Reserves into Short-Term Securities',
      rationale: 'Treasury reserve balance currently holds ₹42.5 Lakhs in liquid cash yielding minimal interest. Treasury bill allocation suggested.',
      impact: '+₹2.4L Yield',
      priority: 'Low',
      actioned: false,
      score: 65,
    },
  ]);

  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const toggleActioned = (id: string) => {
    setRecommendations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, actioned: !item.actioned } : item))
    );
  };

  const filteredRecs = recommendations.filter((r) => {
    if (filterPriority === 'ALL') return true;
    return r.priority.toUpperCase() === filterPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary dark:text-white">AI Suggestions & Analytics</h1>
            <Badge variant="violet" size="sm">PREDICTIVE INSIGHTS</Badge>
          </div>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
            Automated recommendations, 0–100 KPI performance scorecards, and variance anomaly flags
          </p>
        </div>
      </div>

      {/* Section 3.5: Trend Flags / Anomaly Banner (Amber warning when metric deviates > 2 std dev) */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3.5 shadow-sm">
        <div className="p-2.5 bg-amber-500 text-white rounded-xl flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Metric Anomaly Detected (&gt;2.1 Standard Deviations)
            </h3>
            <Badge variant="amber" size="sm">TREND FLAG</Badge>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            Operating cost spiked by <strong>14.2%</strong> during week 3 of the current reporting cycle due to software license renewals. This exceeds standard historical variance parameters.
          </p>
        </div>
      </div>

      {/* Section 3.5: KPI Performance Scorecards (0-100 Gauge Score) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scorecard 1: Turnover Growth */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary dark:text-slate-400 uppercase">
              <span>Turnover Growth Score</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="kpi-number text-text-primary dark:text-white">94</span>
              <span className="text-xs font-bold text-emerald-600">Optimal (94/100)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-navy-700 rounded-full overflow-hidden">
              <div className="h-full bg-brand-green rounded-full" style={{ width: '94%' }} />
            </div>
            <p className="text-[11px] text-slate-500">Trailing 12-month revenue velocity is top 10% in peer tier.</p>
          </CardContent>
        </Card>

        {/* Scorecard 2: Expense Containment */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary dark:text-slate-400 uppercase">
              <span>Expense Ratio Score</span>
              <Activity className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="kpi-number text-text-primary dark:text-white">82</span>
              <span className="text-xs font-bold text-brand-blue">Good (82/100)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-navy-700 rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue rounded-full" style={{ width: '82%' }} />
            </div>
            <p className="text-[11px] text-slate-500">OpEx is stabilized under 60% gross revenue target.</p>
          </CardContent>
        </Card>

        {/* Scorecard 3: Margin Consistency */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary dark:text-slate-400 uppercase">
              <span>Margin Trend Score</span>
              <Zap className="w-4 h-4 text-brand-violet" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="kpi-number text-text-primary dark:text-white">76</span>
              <span className="text-xs font-bold text-brand-violet">Moderate (76/100)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-navy-700 rounded-full overflow-hidden">
              <div className="h-full bg-brand-violet rounded-full" style={{ width: '76%' }} />
            </div>
            <p className="text-[11px] text-slate-500">Quarterly profit margin held above 35% standard threshold.</p>
          </CardContent>
        </Card>
      </div>

      {/* Section 3.5: AI Recommendations List */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-navy-700 pb-4">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-violet" />
              AI Recommendation Action Cards
            </CardTitle>
            <p className="text-xs text-text-secondary dark:text-slate-400">
              Prioritized strategic actions generated from corporate financial dataset
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg text-text-primary dark:text-white"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {filteredRecs.map((rec) => (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl border transition-all ${
                rec.actioned
                  ? 'bg-slate-50/70 dark:bg-navy-900/40 border-slate-200 dark:border-navy-700/60 opacity-80'
                  : 'bg-white dark:bg-navy-800 border-slate-200 dark:border-navy-700 hover:border-brand-blue/50 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={rec.priority === 'High' ? 'red' : rec.priority === 'Medium' ? 'amber' : 'blue'}
                      size="sm"
                    >
                      {rec.priority} Priority
                    </Badge>

                    <h3 className={`text-sm font-bold ${rec.actioned ? 'line-through text-slate-400' : 'text-text-primary dark:text-white'}`}>
                      {rec.title}
                    </h3>
                  </div>

                  <p className="text-xs text-text-secondary dark:text-slate-300 leading-relaxed">
                    {rec.rationale}
                  </p>

                  <div className="flex items-center gap-4 text-xs pt-1">
                    <span className="font-semibold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-md">
                      Estimated Impact: {rec.impact}
                    </span>
                    <span className="text-slate-400">Model Confidence Score: {rec.score}/100</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActioned(rec.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                      rec.actioned
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                        : 'bg-brand-blue text-white hover:bg-brand-blue-hover shadow-sm'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {rec.actioned ? 'Actioned' : 'Mark Actioned'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
