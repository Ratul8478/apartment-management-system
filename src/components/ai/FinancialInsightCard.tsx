'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, TrendingUp, AlertCircle, ArrowUpRight, Check } from 'lucide-react';

interface InsightCardProps {
  title: string;
  rationale: string;
  impact: string;
  priority: 'High' | 'Medium' | 'Low';
  score?: number;
}

export function FinancialInsightCard({ title, rationale, impact, priority, score }: InsightCardProps) {
  const [actioned, setActioned] = React.useState(false);

  const priorityVariant = priority === 'High' ? 'red' : priority === 'Medium' ? 'amber' : 'blue';

  return (
    <Card className="hover:border-brand-blue/40 transition-all">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-brand-violet rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary dark:text-white">{title}</h4>
              <span className="text-[11px] text-text-secondary dark:text-slate-400">Impact Estimate: {impact}</span>
            </div>
          </div>
          <Badge variant={priorityVariant} size="sm">
            {priority} Priority
          </Badge>
        </div>

        <p className="text-xs text-text-secondary dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-navy-900 p-3 rounded-lg border border-slate-100 dark:border-navy-700">
          {rationale}
        </p>

        {score !== undefined && (
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Health Index Score</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-100 dark:bg-navy-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${score > 75 ? 'bg-brand-green' : score > 50 ? 'bg-brand-blue' : 'bg-brand-red'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="font-mono font-bold">{score}/100</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => setActioned(!actioned)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              actioned
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-navy-700 dark:text-slate-200'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            {actioned ? 'Actioned' : 'Mark Actioned'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
