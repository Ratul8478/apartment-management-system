'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Presentation,
  Download,
  CheckCircle2,
  Sparkles,
  Clock,
  Layers,
  ArrowRight,
  FileCheck,
  Eye,
  Monitor,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ReportConfigModal } from '@/components/reports/ReportConfigModal';

interface ReportTemplate {
  id: string;
  title: string;
  type: 'POWER_BI' | 'PRESENTATION';
  description: string;
  tags: string[];
  updatedAt: string;
}

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePreviewType, setActivePreviewType] = useState<'POWER_BI' | 'PRESENTATION' | null>(null);

  // Section 3.6 Template Gallery Grid
  const templates: ReportTemplate[] = [
    {
      id: 'PBI-EXEC-01',
      title: 'Executive Financial Dashboard Dataset',
      type: 'POWER_BI',
      description: 'Structured JSON data bundle & embedded Power BI report model for turnover and P&L.',
      tags: ['Power BI', 'Turnover', 'Profit/Loss'],
      updatedAt: 'Q3 2026 Ready',
    },
    {
      id: 'PBI-OPEX-02',
      title: 'Department Cost Breakdown & OpEx Model',
      type: 'POWER_BI',
      description: 'Granular cost center breakdowns and net profit margin metrics for Power BI Desktop.',
      tags: ['Power BI', 'OpEx', 'Cost Center'],
      updatedAt: 'Updated Today',
    },
    {
      id: 'PPT-CFO-01',
      title: 'Quarterly CFO Board Deck Presentation',
      type: 'PRESENTATION',
      description: 'Native PowerPoint (.pptx) deck auto-filled with corporate turnover, charts, and AI commentary.',
      tags: ['PPTX Deck', 'Executive Summary', 'Board Deck'],
      updatedAt: 'Auto-fill Ready',
    },
    {
      id: 'PPT-INV-02',
      title: 'Investor Summary Slide Deck',
      type: 'PRESENTATION',
      description: 'Clean 5-slide deck featuring company revenue growth trends, expense ratios, and equity valuation.',
      tags: ['PPTX Deck', 'Investor Summary', 'Share Value'],
      updatedAt: 'Auto-fill Ready',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary dark:text-white">
              Reports Studio (Power BI & Presentations)
            </h1>
            <Badge variant="blue" size="sm">AUTO-POPULATION ENGINE</Badge>
          </div>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
            Generate embedded Power BI reports and downloadable PowerPoint slide decks from curated template gallery
          </p>
        </div>
      </div>

      {/* Section 3.6 Template Gallery Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-text-primary dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-blue" />
          Template Gallery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((tpl) => (
            <Card
              key={tpl.id}
              className="hover:border-brand-blue transition-all group flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-navy-900 group-hover:bg-brand-blue/10 transition-colors">
                    {tpl.type === 'PRESENTATION' ? (
                      <Presentation className="w-7 h-7 text-brand-violet" />
                    ) : (
                      <FileSpreadsheet className="w-7 h-7 text-brand-blue" />
                    )}
                  </div>

                  <Badge variant={tpl.type === 'PRESENTATION' ? 'violet' : 'blue'} size="sm">
                    {tpl.type === 'PRESENTATION' ? 'PowerPoint Template' : 'Power BI Template'}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-bold text-text-primary dark:text-white group-hover:text-brand-blue transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-text-secondary dark:text-slate-400 mt-1.5 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {tpl.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <div className="px-6 py-4 border-t border-slate-100 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-900/50 flex items-center justify-between">
                <button
                  onClick={() => setActivePreviewType(tpl.type)}
                  className="text-xs font-semibold text-slate-500 hover:text-brand-blue flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview Template
                </button>

                <Button
                  onClick={() => {
                    setSelectedTemplate(tpl);
                    setIsModalOpen(true);
                  }}
                  className="text-xs font-semibold rounded-xl"
                >
                  Configure & Export <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 3.6 Interactive Preview Pane (Embedded Power BI iframe or Slide Thumbnail Strip) */}
      {activePreviewType && (
        <Card className="border-brand-blue/40 shadow-lg">
          <CardHeader className="flex items-center justify-between border-b border-slate-100 dark:border-navy-700 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Monitor className="w-5 h-5 text-brand-violet" />
              {activePreviewType === 'POWER_BI'
                ? 'Embedded Power BI Report Live Preview'
                : 'Presentation Slide Strip Thumbnail Preview'}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActivePreviewType(null)}>
              Close Preview
            </Button>
          </CardHeader>

          <CardContent className="pt-6">
            {activePreviewType === 'POWER_BI' ? (
              <div className="w-full h-96 bg-navy-900 text-white rounded-2xl flex flex-col items-center justify-center p-8 border border-navy-700 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-bold text-2xl shadow-xl">
                  PBI
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold">Embedded Power BI Interactive Canvas</h3>
                  <p className="text-xs text-slate-300">
                    Live iframe SDK container loaded with dataset tokens
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Badge variant="blue">OAuth2 Authenticated</Badge>
                  <Badge variant="green">Live Refresh Synced</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((slideNum) => (
                    <div
                      key={slideNum}
                      className="p-4 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl space-y-2 text-center hover:border-brand-violet transition-colors cursor-pointer"
                    >
                      <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">
                        Slide 0{slideNum}
                      </span>
                      <div className="h-20 bg-white dark:bg-navy-800 rounded-lg flex items-center justify-center text-xs font-semibold text-text-primary dark:text-white border border-slate-100 dark:border-navy-700 shadow-xs">
                        {slideNum === 1 ? 'Title & Cover' : slideNum === 2 ? 'Turnover P&L' : slideNum === 3 ? 'OpEx Ratio' : 'Executive Conclusion'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Report Config Modal */}
      <ReportConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
}
