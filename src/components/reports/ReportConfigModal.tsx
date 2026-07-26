'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { FileSpreadsheet, Presentation, Download, CheckCircle2 } from 'lucide-react';

interface ReportConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: string;
    title: string;
    type: 'POWER_BI' | 'PRESENTATION';
    description: string;
  } | null;
}

export function ReportConfigModal({ isOpen, onClose, template }: ReportConfigModalProps) {
  const [period, setPeriod] = useState('Q3-2026');
  const [includeProjections, setIncludeProjections] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  if (!template) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setDownloadUrl(null);

    try {
      const endpoint =
        template.type === 'PRESENTATION'
          ? '/api/reports/generate-ppt'
          : '/api/reports/generate-pbi';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          period,
          includeProjections,
        }),
      });

      if (!res.ok) {
        throw new Error('Report generation failed');
      }

      if (template.type === 'PRESENTATION') {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const data = await res.json();
        const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data.dataset, null, 2));
        setDownloadUrl(jsonStr);
      }
    } catch (err) {
      console.error(err);
      alert('Error generating report file.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setDownloadUrl(null);
        onClose();
      }}
      title={`Configure ${template.title}`}
      description={template.description}
      size="wide"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-700">
          <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-xl">
            {template.type === 'PRESENTATION' ? <Presentation className="w-8 h-8" /> : <FileSpreadsheet className="w-8 h-8" />}
          </div>
          <div>
            <span className="text-xs font-mono text-brand-blue font-semibold uppercase">{template.type} Export</span>
            <h3 className="text-base font-bold text-text-primary dark:text-white">{template.title}</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400">{template.description}</p>
          </div>
        </div>

        {/* Configurations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Target Fiscal Period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { label: 'Q3 2026 (July - Sept 2026)', value: 'Q3-2026' },
              { label: 'Q2 2026 (April - June 2026)', value: 'Q2-2026' },
              { label: 'Full Year 2025-2026', value: 'FY-2026' },
            ]}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 uppercase tracking-wider">
              Include AI Narrative Summary
            </label>
            <div className="flex items-center gap-2 h-10 px-3 border border-surface-border dark:border-navy-700 rounded-lg bg-white dark:bg-navy-900">
              <input
                type="checkbox"
                id="proj"
                checked={includeProjections}
                onChange={(e) => setIncludeProjections(e.target.checked)}
                className="w-4 h-4 text-brand-blue rounded border-slate-300 focus:ring-brand-blue"
              />
              <label htmlFor="proj" className="text-xs text-text-primary dark:text-slate-200 cursor-pointer">
                Auto-populate executive commentary
              </label>
            </div>
          </div>
        </div>

        {/* Download Ready Banner */}
        {downloadUrl && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">Report Generated Successfully!</p>
                <p className="text-[11px]">Ready for download and presentation distribution.</p>
              </div>
            </div>
            <a
              href={downloadUrl}
              download={template.type === 'PRESENTATION' ? `${template.id}_${period}.pptx` : `${template.id}_${period}_powerbi_dataset.json`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" /> Download File
            </a>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-700">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} isLoading={isGenerating}>
            {template.type === 'PRESENTATION' ? 'Generate PowerPoint (.pptx)' : 'Build Power BI Dataset'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
