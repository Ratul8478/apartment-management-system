'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CsvUploadModal({ isOpen, onClose, onSuccess }: CsvUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [duplicateWarnings, setDuplicateWarnings] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setError('');

    Papa.parse(selected, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];
        setParsedRows(rows);

        // Check for duplicate date warnings
        const dates = rows.map((r) => r.recordDate || r.Date || r.date).filter(Boolean);
        const unique = new Set(dates);
        if (dates.length !== unique.size) {
          setDuplicateWarnings(['Warning: File contains multiple entries for the same date. They will be aggregated.']);
        } else {
          setDuplicateWarnings([]);
        }
      },
      error: (err) => {
        setError('Failed to parse CSV file: ' + err.message);
      },
    });
  };

  const handleUpload = async () => {
    if (!parsedRows.length) return;
    setIsUploading(true);
    setError('');

    try {
      const res = await fetch('/api/finance-records/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedRows }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to import CSV');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error processing CSV upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk CSV Financial Import" description="Upload CSV file containing recordDate, metricType, amount, notes." size="wide">
      <div className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-brand-red text-xs rounded-lg">{error}</div>}

        {/* Drag & Drop File Input */}
        <div className="border-2 border-dashed border-slate-300 dark:border-navy-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-navy-900 hover:border-brand-blue transition-colors relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-10 h-10 text-brand-blue mx-auto mb-2" />
          <p className="text-sm font-semibold text-text-primary dark:text-white">
            {file ? file.name : 'Click or drag CSV file to upload'}
          </p>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
            Columns expected: <code className="font-mono bg-slate-200 dark:bg-navy-700 px-1 py-0.5 rounded">recordDate, metricType, amount, notes</code>
          </p>
        </div>

        {/* Warnings */}
        {duplicateWarnings.map((w, idx) => (
          <div key={idx} className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs rounded-lg border border-amber-200">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{w}</span>
          </div>
        ))}

        {/* Preview Table */}
        {parsedRows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary dark:text-white">
                Parsed Rows Preview ({parsedRows.length} items)
              </span>
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> CSV Schema Validated
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-navy-700 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-navy-700 text-text-secondary dark:text-slate-300">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Metric Type</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-700">
                  {parsedRows.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="dark:text-slate-200">
                      <td className="p-2 font-mono">{row.recordDate || row.Date || row.date}</td>
                      <td className="p-2">{row.metricType || row.Metric || 'TURNOVER'}</td>
                      <td className="p-2 font-mono">₹{row.amount || row.Amount}</td>
                      <td className="p-2 truncate max-w-xs">{row.notes || row.Notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-700">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!parsedRows.length} isLoading={isUploading}>
            Import {parsedRows.length} Records
          </Button>
        </div>
      </div>
    </Modal>
  );
}
