'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  BarChart2,
  FilePlus,
  Upload,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  Users,
  Clock,
  ArrowRight,
  FileSpreadsheet,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TurnoverBarChart } from '@/components/charts/TurnoverBarChart';
import { TurnoverPieChart } from '@/components/charts/TurnoverPieChart';
import { FinanceEntryModal } from '@/components/forms/FinanceEntryModal';
import { CsvUploadModal } from '@/components/forms/CsvUploadModal';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { ChartBucket } from '@/types';

export default function DashboardPage() {
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar');
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalTurnover: 0,
    totalProfit: 0,
    totalCost: 0,
    netMarginPercent: 0,
    growthPercent: 18.4,
  });
  const [buckets, setBuckets] = useState<ChartBucket[]>([]);
  const [employeeCount, setEmployeeCount] = useState(6);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Section 3.2 Activity Feed Data (10 events)
  const activityEvents = [
    { id: 'act-1', type: 'ENTRY', text: 'Invoice #INV-2026-884 posted for ₹4.50 Lakhs', time: '10 mins ago', icon: FileCheck, color: 'text-emerald-600' },
    { id: 'act-2', type: 'REPORT', text: 'Power BI Executive Dataset exported by Vikramaditya Rao', time: '1 hour ago', icon: FileSpreadsheet, color: 'text-brand-blue' },
    { id: 'act-3', type: 'SHARE', text: 'Share Price updated to ₹640.50 (+2.1%)', time: '3 hours ago', icon: TrendingUp, color: 'text-brand-violet' },
    { id: 'act-4', type: 'ALERT', text: 'OpEx anomaly flagged in software licensing', time: '5 hours ago', icon: AlertTriangle, color: 'text-amber-500' },
    { id: 'act-5', type: 'CSV', text: 'Bulk CSV import completed: 24 financial entries added', time: 'Yesterday', icon: Upload, color: 'text-brand-blue' },
    { id: 'act-6', type: 'USER', text: 'New Analyst account provisioned for Amit Verma', time: 'Yesterday', icon: Users, color: 'text-emerald-600' },
    { id: 'act-7', type: 'REPORT', text: 'Quarterly CFO Board Deck presentation downloaded', time: '2 days ago', icon: FileSpreadsheet, color: 'text-brand-violet' },
    { id: 'act-8', type: 'ENTRY', text: 'Operational costs updated for Finance department', time: '2 days ago', icon: Activity, color: 'text-slate-500' },
    { id: 'act-9', type: 'SHARE', text: 'Peer company market data comparison updated', time: '3 days ago', icon: TrendingUp, color: 'text-brand-blue' },
    { id: 'act-10', type: 'ENTRY', text: 'Monthly turnover rollup finalized for Q3', time: '4 days ago', icon: FileCheck, color: 'text-emerald-600' },
  ];

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/finance-records?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setKpis(data.kpis);
        setBuckets(data.buckets);
      }
      const empRes = await fetch('/api/employees');
      if (empRes.ok) {
        const emps = await empRes.json();
        setEmployeeCount(emps.length);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#1E40AF] p-6 rounded-3xl border border-blue-900/30 shadow-xl text-white relative overflow-hidden">
        {/* Subtle Ambient Mesh Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-400/10 via-blue-600/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white">Executive Corporate Studio</h1>
            <Badge variant="blue" size="sm" className="bg-blue-400/20 text-blue-200 border-blue-300/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
              CORPORATE ACTIVE
            </Badge>
          </div>
          <p className="text-xs font-medium text-blue-100 mt-1">
            Tier-1 Financial Telemetry, Net Operating Income & Corporate Audit Stream
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Button
            variant="outline"
            onClick={() => setIsCsvModalOpen(true)}
            className="text-xs font-bold rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all shadow-md"
          >
            <Upload className="w-4 h-4 mr-1.5 text-blue-200" />
            Bulk CSV Import
          </Button>

          <Button
            variant="primary"
            onClick={() => setIsEntryModalOpen(true)}
            className="text-xs font-extrabold rounded-full bg-white text-blue-900 hover:bg-slate-100 shadow-lg shadow-black/10 transition-all"
          >
            <FilePlus className="w-4 h-4 mr-1.5 text-blue-900" />
            New Financial Record
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Turnover */}
        <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden border border-slate-200/90 rounded-3xl bg-white text-slate-900 shadow-xs">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] to-[#2563EB]" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Total Turnover ({period})
              </span>
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="kpi-number text-slate-900">
                {isLoading ? '...' : formatCurrency(kpis.totalTurnover)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-900 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full w-fit border border-blue-200">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% vs prev</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden border border-slate-200/90 rounded-3xl bg-white text-slate-900 shadow-xs">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 to-teal-600" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Net Profit / Loss
              </span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="kpi-number text-slate-900">
                {isLoading ? '...' : formatCurrency(kpis.totalProfit)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full w-fit border border-emerald-200">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Margin: {formatPercentage(kpis.netMarginPercent)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Rate */}
        <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden border border-slate-200/90 rounded-3xl bg-white text-slate-900 shadow-xs">
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-700 to-blue-700" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Growth Rate
              </span>
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="kpi-number text-slate-900">
                +{kpis.growthPercent}%
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-900 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full w-fit border border-indigo-200">
                <span>Revenue Growth</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Employees */}
        <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden border border-slate-200/90 rounded-3xl bg-white text-slate-900 shadow-xs">
          <div className="h-1.5 w-full bg-gradient-to-r from-slate-700 to-slate-900" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Active Staff
              </span>
              <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="kpi-number text-slate-900">
                {employeeCount} Active
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-800 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full w-fit border border-slate-200">
                <span>Directory Synced</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise AI Suggestions Card */}
      <Card className="border border-blue-900/30 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white shadow-xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#2563EB]" />
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-[#1E3A8A] text-white shadow-md">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <h3 className="text-sm font-black text-white tracking-tight">
                Corporate AI Predictive Insights
              </h3>
              <Badge variant="blue" size="sm" className="bg-blue-500/20 text-blue-300 border-blue-400/30 font-mono font-bold rounded-full">
                OFFICE AI CORE
              </Badge>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-1 font-medium">
              <li className="flex items-start gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 flex-shrink-0 animate-ping" />
                <span>Q3 turnover projected to exceed annual forecast target by 4.2%.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                <span>Operating expenses held under 60% gross revenue target.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                <span>Receivables collection cycle extended to 38 days; discount suggested.</span>
              </li>
            </ul>
          </div>

          <Link
            href="/suggestions"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-blue-900 text-xs font-extrabold rounded-full transition-all shadow-md whitespace-nowrap active:scale-95"
          >
            <span>View Insights</span> <ArrowRight className="w-4 h-4" />
          </Link>
        </CardContent>
      </Card>








      {/* Main Chart Visualization Block */}
      <Card className="rounded-3xl border border-slate-200/90 bg-white text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 pb-4">
          <div>
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2 text-slate-900">
              Turnover & Net Profit Analytics
            </CardTitle>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Aggregated revenue vs net profit breakdown over time
            </p>
          </div>

          {/* Controls: Chart Type + Period Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center p-1 bg-slate-100 rounded-full border border-slate-200">
              <button
                onClick={() => setChartView('bar')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  chartView === 'bar'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Bar View
              </button>
              <button
                onClick={() => setChartView('pie')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  chartView === 'pie'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PieIcon className="w-3.5 h-3.5" />
                Distribution
              </button>
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-full border border-slate-200">
              {(['daily', 'monthly', 'yearly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPeriod(t)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold capitalize transition-all ${
                    period === t
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-80 flex items-center justify-center text-slate-400 text-xs font-semibold animate-pulse">
              Loading financial analytics...
            </div>
          ) : chartView === 'bar' ? (
            <TurnoverBarChart data={buckets} timeRange={period} />
          ) : (
            <TurnoverPieChart
              totalTurnover={kpis.totalTurnover}
              totalProfit={kpis.totalProfit}
              totalCost={kpis.totalCost}
            />
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card className="rounded-3xl border border-slate-200/90 bg-white text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <CardTitle className="text-base font-black flex items-center gap-2 text-slate-900">
            <Clock className="w-5 h-5 text-blue-600" />
            Recent Financial Audit Activity
          </CardTitle>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Real-time audit log of postings, exports, and share value updates
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="divide-y divide-slate-100">
            {activityEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div key={evt.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">
                        {evt.text}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-semibold">Type: {evt.type}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-blue-600 font-mono font-bold">{evt.time}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>




      {/* Entry Modal & CSV Modal */}
      <FinanceEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <CsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}
