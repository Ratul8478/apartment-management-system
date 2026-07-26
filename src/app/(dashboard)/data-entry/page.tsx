'use client';

import React, { useState, useEffect } from 'react';
import {
  FilePlus,
  Upload,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  RefreshCw,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { CsvUploadModal } from '@/components/forms/CsvUploadModal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FinanceRecord } from '@/types';

export default function DataEntryPage() {
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [metricType, setMetricType] = useState('TURNOVER');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('INR');

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [rawRecords, setRawRecords] = useState<FinanceRecord[]>([]);
  const [filterMetric, setFilterMetric] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchRecords = async () => {
    setIsFetching(true);
    try {
      const res = await fetch('/api/finance-records?period=monthly');
      if (res.ok) {
        const data = await res.json();
        setRawRecords(data.rawRecords || []);
      }
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMsg('Please enter a valid numeric amount greater than zero.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/finance-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordDate,
          metricType,
          amount: parseFloat(amount),
          notes,
          currency,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit financial record.');
      }

      setSuccessMsg(`Financial entry recorded successfully for ${formatDate(recordDate)}!`);
      setAmount('');
      setNotes('');
      fetchRecords();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = rawRecords.filter((r) => {
    const matchesMetric = filterMetric === 'ALL' || r.metricType === filterMetric;
    const matchesSearch =
      !searchQuery ||
      r.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.amount.toString().includes(searchQuery);
    return matchesMetric && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-white">Financial Data Entry</h1>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
            Input manual corporate metrics or upload batch CSV spreadsheet files
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsCsvModalOpen(true)}
          className="text-xs font-semibold rounded-xl"
        >
          <Upload className="w-4 h-4 mr-2" />
          Batch CSV Import
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Manual Entry Form */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="border-b border-slate-100 dark:border-navy-700 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-brand-blue" />
                Manual Record Entry
              </CardTitle>
              <p className="text-xs text-text-secondary dark:text-slate-400">
                Submit validated daily/monthly metric
              </p>
            </CardHeader>

            <CardContent className="pt-6">
              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Metric Type */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
                    Metric Category
                  </label>
                  <Select
                    value={metricType}
                    onChange={(e) => setMetricType(e.target.value)}
                    options={[
                      { label: 'Turnover (Revenue)', value: 'TURNOVER' },
                      { label: 'Net Profit / Loss', value: 'PROFIT_LOSS' },
                      { label: 'Operating Cost', value: 'COST' },
                    ]}
                  />
                </div>

                {/* Record Date */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
                    Record Date
                  </label>
                  <Input
                    type="date"
                    required
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                  />
                </div>

                {/* Amount & Currency */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
                      Amount
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 500000"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
                      Currency
                    </label>
                    <Select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      options={[
                        { label: 'INR (₹)', value: 'INR' },
                        { label: 'USD ($)', value: 'USD' },
                        { label: 'EUR (€)', value: 'EUR' },
                      ]}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-slate-400">
                    Audit Notes / Reference
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide context or invoice reference numbers..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-3 bg-white dark:bg-navy-900 border border-surface-border dark:border-navy-700 rounded-lg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full font-semibold rounded-xl">
                  Save Financial Entry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Recent Records Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-navy-700 pb-4">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-violet" />
                  Recent Finance Log Records
                </CardTitle>
                <p className="text-xs text-text-secondary dark:text-slate-400">
                  History of manual & CSV imported entries
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg text-text-primary dark:text-white focus:outline-none"
                  />
                </div>

                <select
                  value={filterMetric}
                  onChange={(e) => setFilterMetric(e.target.value)}
                  className="py-1.5 px-2.5 text-xs bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg text-text-primary dark:text-white"
                >
                  <option value="ALL">All Categories</option>
                  <option value="TURNOVER">Turnover</option>
                  <option value="PROFIT_LOSS">Net Profit</option>
                  <option value="COST">Cost</option>
                </select>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isFetching ? (
                <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                  Loading records log...
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 italic">
                  No matching financial records found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-navy-900 text-text-secondary dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-navy-700">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Metric</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-navy-700/60">
                      {filteredRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-700/40">
                          <td className="py-3 px-4 font-mono font-medium">{formatDate(r.recordDate)}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                r.metricType === 'TURNOVER'
                                  ? 'blue'
                                  : r.metricType === 'PROFIT_LOSS'
                                  ? 'green'
                                  : 'amber'
                              }
                              size="sm"
                            >
                              {r.metricType}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-text-primary dark:text-white">
                            {formatCurrency(r.amount, r.currency)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-300">
                              {r.source || 'MANUAL'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                            {r.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={fetchRecords}
      />
    </div>
  );
}
