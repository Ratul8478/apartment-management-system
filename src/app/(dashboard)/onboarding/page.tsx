'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  BarChart3,
  Bot,
  Globe,
  Upload,
  Target,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function OnboardingWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Setup state
  const [companyProfile, setCompanyProfile] = useState({
    companyName: 'FinTrack Pro Corporate',
    baseCurrency: 'INR',
    fiscalYearStart: 'April',
    reportingTarget: 'Quarterly',
  });

  const [teamMembers, setTeamMembers] = useState([
    { name: 'Priya Patel', email: 'priya.patel@company.com', role: 'FINANCE_MANAGER' },
    { name: 'Amit Verma', email: 'analyst@company.com', role: 'ANALYST' },
  ]);

  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'ANALYST' });

  const [kpiTargets, setKpiTargets] = useState({
    annualTurnoverTarget: '10000000', // 1 Crore
    netProfitMarginTarget: '25.0',
    costCapTarget: '7000000',
  });

  const [seedDataSelected, setSeedDataSelected] = useState(true);

  // Handlers
  const handleAddTeamMember = () => {
    if (newMember.name && newMember.email) {
      setTeamMembers([...teamMembers, newMember]);
      setNewMember({ name: '', email: '', role: 'ANALYST' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Step Header */}
      <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-sky-400 to-indigo-600 text-white rounded-2xl shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Product Activation & Onboarding</h1>
              <p className="text-xs text-slate-400">Configure your organization financial workspace.</p>
            </div>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 font-mono text-xs font-semibold text-sky-400">
            Step {currentStep} of 5
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        {/* Step 1: Welcome & Overview */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-3 py-4">
              <div className="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto border border-sky-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-white">Welcome to FinTrack Pro!</h2>
              <p className="text-slate-300 text-sm max-w-lg mx-auto">
                Let's customize your financial ledger, invite your team, and set up your initial KPI benchmark targets in a few quick steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                <Globe className="w-6 h-6 text-sky-400 mx-auto" />
                <h3 className="font-bold text-white text-sm">Currency & Profile</h3>
                <p className="text-[11px] text-slate-400">Configure reporting base currency & fiscal calendar.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                <Users className="w-6 h-6 text-indigo-400 mx-auto" />
                <h3 className="font-bold text-white text-sm">Team Roster</h3>
                <p className="text-[11px] text-slate-400">Invite finance managers & financial analysts.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                <Target className="w-6 h-6 text-purple-400 mx-auto" />
                <h3 className="font-bold text-white text-sm">KPI Targets</h3>
                <p className="text-[11px] text-slate-400">Set margin benchmarks for automated tracking.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 font-semibold text-white text-sm hover:opacity-95 transition-all flex items-center gap-2"
              >
                Start Organization Setup <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Company Profile */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-400" /> Company Profile & Financial Currency
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Company / Entity Name</label>
                <input
                  type="text"
                  value={companyProfile.companyName}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, companyName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Base Currency</label>
                <select
                  value={companyProfile.baseCurrency}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, baseCurrency: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Fiscal Year Start Month</label>
                <select
                  value={companyProfile.fiscalYearStart}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, fiscalYearStart: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option value="April">April (Standard Fiscal Year)</option>
                  <option value="January">January (Calendar Year)</option>
                  <option value="October">October</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Reporting Cadence</label>
                <select
                  value={companyProfile.reportingTarget}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, reportingTarget: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option value="Monthly">Monthly Rollups</option>
                  <option value="Quarterly">Quarterly Executive Briefings</option>
                  <option value="Daily">Daily Ledger Receipts</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm transition-all flex items-center gap-2"
              >
                Next: Finance Roster <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Invite Team Roster */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Invite Finance Department Team
            </h2>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Add Team Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <input
                  type="email"
                  placeholder="email@company.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTeamMember}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Add Member
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2">
              <h3 className="text-xs text-slate-400 font-medium">Invited Roster List ({teamMembers.length})</h3>
              <div className="divide-y divide-slate-800 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                {teamMembers.map((m, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{m.name}</p>
                      <p className="text-slate-400">{m.email}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 font-mono text-[10px] text-sky-400">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm transition-all flex items-center gap-2"
              >
                Next: Data Setup <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Initial Finance Data Setup */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" /> Financial Data Initialization (CSV / Seed Data)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setSeedDataSelected(true)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  seedDataSelected ? 'bg-indigo-950/40 border-indigo-500 shadow-lg' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white text-sm">Seed Demo Dataset</h3>
                  {seedDataSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pre-populate 12 months of turnover, profit-loss, and share price metrics to test dashboard charts & AI Q&A immediately.
                </p>
              </div>

              <div
                onClick={() => setSeedDataSelected(false)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  !seedDataSelected ? 'bg-indigo-950/40 border-indigo-500 shadow-lg' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white text-sm">Upload Financial CSV</h3>
                  {!seedDataSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Import your enterprise financial records CSV directly into the system database ledger during activation.
                </p>
              </div>

              <div
                onClick={() => setSeedDataSelected(false)}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-300 text-sm">Blank Ledger</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Start with an empty ledger and input records manually later via the Data Entry page.
                </p>
              </div>
            </div>

            {!seedDataSelected && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-dashed border-slate-700 text-center space-y-3">
                <Upload className="w-8 h-8 text-sky-400 mx-auto" />
                <h4 className="font-semibold text-white text-sm">Drop your Financial Records CSV file here</h4>
                <p className="text-xs text-slate-400">Supported columns: Date, Turnover, ProfitLoss, Expenses, SharePrice</p>
                <input type="file" accept=".csv" className="hidden" id="onboarding-csv-input" />
                <label
                  htmlFor="onboarding-csv-input"
                  className="inline-block px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-sky-400 cursor-pointer hover:bg-slate-800 transition-all"
                >
                  Choose CSV File
                </label>
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm transition-all flex items-center gap-2"
              >
                Next: KPI Targets <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Configure KPIs & Launchpad */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" /> Configure Target KPI Benchmarks
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Annual Turnover Target ({companyProfile.baseCurrency})</label>
                <input
                  type="number"
                  value={kpiTargets.annualTurnoverTarget}
                  onChange={(e) => setKpiTargets({ ...kpiTargets, annualTurnoverTarget: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Net Profit Margin Target (%)</label>
                <input
                  type="number"
                  value={kpiTargets.netProfitMarginTarget}
                  onChange={(e) => setKpiTargets({ ...kpiTargets, netProfitMarginTarget: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Annual Cost Cap ({companyProfile.baseCurrency})</label>
                <input
                  type="number"
                  value={kpiTargets.costCapTarget}
                  onChange={(e) => setKpiTargets({ ...kpiTargets, costCapTarget: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            </div>

            {/* Launchpad Quick CTAs */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Setup Complete! Choose Your Launchpad Action:</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-95 transition-all text-left space-y-2 shadow-lg"
                >
                  <BarChart3 className="w-5 h-5" />
                  <p className="font-bold">Explore Dashboard</p>
                  <p className="text-[11px] opacity-80">View turnover, net margin, and share price charts.</p>
                </button>

                <button
                  onClick={() => router.push('/reports')}
                  className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white font-semibold text-sm transition-all text-left space-y-2"
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <p className="font-bold">Generate First Report</p>
                  <p className="text-[11px] text-slate-400">Download PowerPoint deck or Power BI dataset.</p>
                </button>

                <button
                  onClick={() => router.push('/ai-chat')}
                  className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white font-semibold text-sm transition-all text-left space-y-2"
                >
                  <Bot className="w-5 h-5 text-purple-400" />
                  <p className="font-bold">Ask AI Assistant</p>
                  <p className="text-[11px] text-slate-400">Query grounded financial figures with Claude AI.</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
