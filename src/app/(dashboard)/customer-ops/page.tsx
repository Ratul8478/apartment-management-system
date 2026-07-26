'use client';

import React, { useState, useEffect } from 'react';
import {
  OnboardingStepDTO,
  ProductAnalyticsSummary,
  CustomerHealthScoreDTO,
  SuccessPlanDTO,
  CommunicationCampaignDTO,
  CrmSyncStatusDTO,
  KnowledgeArticleDTO,
  ExecutiveBusinessReportSummary,
} from '@/types/customerOps';
import { OnboardingChecklistWidget } from '@/components/customer-ops/OnboardingChecklistWidget';
import { CustomerHealthGauge } from '@/components/customer-ops/CustomerHealthGauge';
import { ProductAnalyticsDashboard } from '@/components/customer-ops/ProductAnalyticsDashboard';
import { CustomerSuccessHub } from '@/components/customer-ops/CustomerSuccessHub';
import { KnowledgeBaseWidget } from '@/components/customer-ops/KnowledgeBaseWidget';
import { CommunicationCenterWidget } from '@/components/customer-ops/CommunicationCenterWidget';
import { CrmSyncStatusCard } from '@/components/customer-ops/CrmSyncStatusCard';
import {
  Users,
  Activity,
  ShieldCheck,
  Target,
  Mail,
  Cloud,
  BookOpen,
  FileSpreadsheet,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function CustomerOpsPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'onboarding' | 'analytics' | 'health_cs' | 'communications' | 'crm' | 'kb'
  >('overview');

  // State variables
  const [onboarding, setOnboarding] = useState<{ steps: OnboardingStepDTO[]; completionPercentage: number } | null>(
    null
  );
  const [analytics, setAnalytics] = useState<ProductAnalyticsSummary | null>(null);
  const [health, setHealth] = useState<CustomerHealthScoreDTO | null>(null);
  const [successPlans, setSuccessPlans] = useState<SuccessPlanDTO[]>([]);
  const [campaigns, setCampaigns] = useState<CommunicationCampaignDTO[]>([]);
  const [crmStatus, setCrmStatus] = useState<CrmSyncStatusDTO | null>(null);
  const [kbArticles, setKbArticles] = useState<KnowledgeArticleDTO[]>([]);
  const [executiveReport, setExecutiveReport] = useState<ExecutiveBusinessReportSummary | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingCrm, setIsSyncingCrm] = useState(false);

  useEffect(() => {
    fetchOpsData();
  }, []);

  const fetchOpsData = async () => {
    setIsLoading(true);
    try {
      const [onboardingRes, analyticsRes, healthRes, plansRes, commsRes, crmRes, kbRes, ebrRes] = await Promise.all([
        fetch('/api/customer-ops/onboarding').then((r) => r.json()),
        fetch('/api/customer-ops/analytics/events').then((r) => r.json()),
        fetch('/api/customer-ops/health').then((r) => r.json()),
        fetch('/api/customer-ops/success-plans').then((r) => r.json()),
        fetch('/api/customer-ops/communications').then((r) => r.json()),
        fetch('/api/customer-ops/crm/sync').then((r) => r.json()),
        fetch('/api/kb/articles').then((r) => r.json()),
        fetch('/api/customer-ops/reports/executive').then((r) => r.json()),
      ]);

      if (onboardingRes.success) setOnboarding(onboardingRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (healthRes.success) setHealth(healthRes.data);
      if (plansRes.success) setSuccessPlans(plansRes.data);
      if (commsRes.success) setCampaigns(commsRes.data);
      if (crmRes.success) setCrmStatus(crmRes.data);
      if (kbRes.success) setKbArticles(kbRes.data);
      if (ebrRes.success) setExecutiveReport(ebrRes.data);
    } catch (err) {
      console.error('Failed to load Customer Ops data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkStepComplete = async (stepKey: string) => {
    try {
      const res = await fetch('/api/customer-ops/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepKey }),
      }).then((r) => r.json());

      if (res.success) {
        await fetchOpsData();
      }
    } catch (err) {
      console.error('Error marking step complete:', err);
    }
  };

  const handleCreateSuccessPlan = async (title: string, objectives: string[]) => {
    try {
      const res = await fetch('/api/customer-ops/success-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          objectives: objectives.map((t) => ({ title: t })),
        }),
      }).then((r) => r.json());

      if (res.success) {
        setSuccessPlans((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      console.error('Error creating success plan:', err);
    }
  };

  const handleDispatchCampaign = async (campaignKey: string) => {
    try {
      const res = await fetch('/api/customer-ops/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignKey }),
      }).then((r) => r.json());

      if (res.success) {
        await fetchOpsData();
      }
    } catch (err) {
      console.error('Campaign dispatch error:', err);
    }
  };

  const handleTriggerCrmSync = async (crmProvider: 'SALESFORCE' | 'HUBSPOT' | 'ZOHO' | 'MOCK') => {
    setIsSyncingCrm(true);
    try {
      const res = await fetch('/api/customer-ops/crm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crmProvider }),
      }).then((r) => r.json());

      if (res.success) {
        setCrmStatus(res.data);
      }
    } catch (err) {
      console.error('CRM Sync Error:', err);
    } finally {
      setIsSyncingCrm(false);
    }
  };

  const handleSearchKb = async (query: string) => {
    try {
      const res = await fetch(`/api/kb/articles?q=${encodeURIComponent(query)}`).then((r) => r.json());
      if (res.success) setKbArticles(res.data);
    } catch (err) {
      console.error('KB Search Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white">
              Customer Experience & Operations Hub
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Product Operations
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Enterprise customer success, product analytics, health scoring, CRM sync, and communication automation.
          </p>
        </div>

        {health && (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Tenant Health Index</div>
              <div className="text-sm font-bold text-white">
                {health.score}/100 <span className="text-xs text-emerald-400 font-semibold">({health.category})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" /> Operations Overview
        </button>

        <button
          onClick={() => setActiveTab('onboarding')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'onboarding'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Onboarding & Guidance
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Product Analytics
        </button>

        <button
          onClick={() => setActiveTab('health_cs')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'health_cs'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Target className="w-4 h-4" /> Health Score & CS Hub
        </button>

        <button
          onClick={() => setActiveTab('communications')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'communications'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" /> Communication Engine
        </button>

        <button
          onClick={() => setActiveTab('crm')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'crm'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Cloud className="w-4 h-4" /> CRM Integration
        </button>

        <button
          onClick={() => setActiveTab('kb')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'kb'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Knowledge Base ({kbArticles.length})
        </button>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Executive Summary Card */}
          {executiveReport && (
            <div className="p-6 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Executive Business Review (EBR) Summary
                </span>
                <h2 className="text-2xl font-black text-white mt-1">{executiveReport.organizationName}</h2>
                <p className="text-xs text-slate-400 mt-1">Report Period: {executiveReport.reportPeriod}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Health Index</div>
                  <div className="text-xl font-black text-emerald-400">{executiveReport.healthScore}/100</div>
                </div>
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Monthly Run Rate</div>
                  <div className="text-xl font-black text-white">${executiveReport.mrr}</div>
                </div>
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Ingested Records</div>
                  <div className="text-xl font-black text-indigo-400">{executiveReport.financialRecordsIngestedTotal}</div>
                </div>
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">SLA Compliance</div>
                  <div className="text-xl font-black text-emerald-400">{executiveReport.supportSlaCompliancePercentage}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Grid View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {onboarding && (
              <OnboardingChecklistWidget
                steps={onboarding.steps}
                completionPercentage={onboarding.completionPercentage}
                onMarkComplete={handleMarkStepComplete}
              />
            )}
            <CustomerHealthGauge health={health} />
          </div>
        </div>
      )}

      {/* TAB 2: ONBOARDING */}
      {activeTab === 'onboarding' && onboarding && (
        <div className="animate-in fade-in duration-300">
          <OnboardingChecklistWidget
            steps={onboarding.steps}
            completionPercentage={onboarding.completionPercentage}
            onMarkComplete={handleMarkStepComplete}
          />
        </div>
      )}

      {/* TAB 3: PRODUCT ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="animate-in fade-in duration-300">
          <ProductAnalyticsDashboard analytics={analytics} />
        </div>
      )}

      {/* TAB 4: HEALTH SCORE & CS HUB */}
      {activeTab === 'health_cs' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <CustomerHealthGauge health={health} />
          <CustomerSuccessHub plans={successPlans} onCreatePlan={handleCreateSuccessPlan} />
        </div>
      )}

      {/* TAB 5: COMMUNICATIONS */}
      {activeTab === 'communications' && (
        <div className="animate-in fade-in duration-300">
          <CommunicationCenterWidget campaigns={campaigns} onDispatch={handleDispatchCampaign} />
        </div>
      )}

      {/* TAB 6: CRM INTEGRATION */}
      {activeTab === 'crm' && (
        <div className="animate-in fade-in duration-300">
          <CrmSyncStatusCard
            status={crmStatus}
            onTriggerSync={handleTriggerCrmSync}
            isSyncing={isSyncingCrm}
          />
        </div>
      )}

      {/* TAB 7: KNOWLEDGE BASE */}
      {activeTab === 'kb' && (
        <div className="animate-in fade-in duration-300">
          <KnowledgeBaseWidget articles={kbArticles} onSearch={handleSearchKb} />
        </div>
      )}
    </div>
  );
}
