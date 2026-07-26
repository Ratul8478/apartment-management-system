'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Building2,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Play,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Briefcase,
  Globe,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';

interface FunnelModalsProps {
  activeModal: 'DEMO' | 'CREATE_ORG' | 'CONSULTATION' | 'WATCH_DEMO' | 'CONTACT_SALES' | null;
  onClose: () => void;
}

export function FunnelModals({ activeModal, onClose }: FunnelModalsProps) {
  const router = useRouter();

  // Contact Sales State
  const [salesForm, setSalesForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesSuccess, setSalesSuccess] = useState(false);

  // Request Demo State
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    company: '',
    companySize: '50-250 employees',
    role: 'CFO / Finance Director',
  });
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);

  // Consultation State
  const [consultForm, setConsultForm] = useState({
    name: '',
    email: '',
    date: '',
    notes: '',
  });
  const [consultLoading, setConsultLoading] = useState(false);
  const [consultSuccess, setConsultSuccess] = useState(false);

  // Create Org Multi-step State
  const [orgStep, setOrgStep] = useState(1);
  const [orgForm, setOrgForm] = useState({
    companyName: '',
    adminName: '',
    adminEmail: '',
    password: '',
    baseCurrency: 'INR',
    industry: 'Financial Technology / Banking',
    invite1Name: '',
    invite1Email: '',
    invite2Name: '',
    invite2Email: '',
  });
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState('');

  if (!activeModal) return null;

  // Handlers
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoLoading(true);
    try {
      const res = await fetch('/api/funnel/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...demoForm, type: 'DEMO' }),
      });
      if (res.ok) {
        setDemoSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleSalesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalesLoading(true);
    try {
      const res = await fetch('/api/funnel/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...salesForm, type: 'CONTACT_SALES' }),
      });
      if (res.ok) {
        setSalesSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSalesLoading(false);
    }
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultLoading(true);
    try {
      const res = await fetch('/api/funnel/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...consultForm, type: 'CONSULTATION' }),
      });
      if (res.ok) {
        setConsultSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConsultLoading(false);
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgLoading(true);
    setOrgError('');

    const teamInvites = [];
    if (orgForm.invite1Name && orgForm.invite1Email) {
      teamInvites.push({ fullName: orgForm.invite1Name, email: orgForm.invite1Email, role: 'FINANCE_MANAGER' });
    }
    if (orgForm.invite2Name && orgForm.invite2Email) {
      teamInvites.push({ fullName: orgForm.invite2Name, email: orgForm.invite2Email, role: 'ANALYST' });
    }

    try {
      const res = await fetch('/api/funnel/organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: orgForm.companyName,
          adminName: orgForm.adminName,
          adminEmail: orgForm.adminEmail,
          password: orgForm.password,
          baseCurrency: orgForm.baseCurrency,
          teamInvites,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOrgError(data.error || 'Failed to create organization account');
      } else {
        router.push('/onboarding');
        onClose();
      }
    } catch (err: any) {
      setOrgError('Network error during account registration');
    } finally {
      setOrgLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ----------------- REQUEST DEMO MODAL ----------------- */}
        {activeModal === 'DEMO' && (
          <div className="p-8">
            {demoSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Demo Requested Successfully!</h3>
                <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                  Thank you, <span className="text-sky-400 font-semibold">{demoForm.name}</span>. Our enterprise financial solutions architect will contact you at <span className="text-sky-400 font-semibold">{demoForm.email}</span> within 2 business hours.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 font-semibold text-white hover:opacity-95 transition-opacity"
                >
                  Done & Back to Website
                </button>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Request Live Enterprise Demo</h2>
                    <p className="text-xs text-slate-400">See FinTrack Pro AI and Reporting Studio in action with real data.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">Your Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Vikramaditya Rao"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">Work Email</label>
                    <input
                      required
                      type="email"
                      placeholder="cfo@company.com"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Global Tech"
                      value={demoForm.company}
                      onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">Company Size</label>
                    <select
                      value={demoForm.companySize}
                      onChange={(e) => setDemoForm({ ...demoForm, companySize: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    >
                      <option value="10-50 employees">10-50 employees</option>
                      <option value="50-250 employees">50-250 employees</option>
                      <option value="250-1000 employees">250-1000 employees</option>
                      <option value="1000+ employees">1000+ Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Strict NDA & Zero Data Sharing Guarantee
                  </div>

                  <button
                    disabled={demoLoading}
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 font-semibold text-white hover:opacity-95 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                  >
                    {demoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Schedule Personalized Demo'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ----------------- CREATE ORGANIZATION MULTI-STEP ----------------- */}
        {activeModal === 'CREATE_ORG' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Organization</h2>
                  <p className="text-xs text-slate-400">Setup your enterprise financial workspace in under 2 minutes.</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Step {orgStep} of 3
              </div>
            </div>

            {orgError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {orgError}
              </div>
            )}

            <form onSubmit={handleOrgSubmit} className="space-y-5">
              {orgStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider text-xs">Step 1: Admin Account Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-medium">Admin Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Rajesh Sharma"
                        value={orgForm.adminName}
                        onChange={(e) => setOrgForm({ ...orgForm, adminName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-medium">Admin Work Email</label>
                      <input
                        required
                        type="email"
                        placeholder="admin@company.com"
                        value={orgForm.adminEmail}
                        onChange={(e) => setOrgForm({ ...orgForm, adminEmail: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs text-slate-300 font-medium">Master Account Password</label>
                      <input
                        required
                        type="password"
                        placeholder="••••••••••••"
                        value={orgForm.password}
                        onChange={(e) => setOrgForm({ ...orgForm, password: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!orgForm.adminName || !orgForm.adminEmail || !orgForm.password}
                      onClick={() => setOrgStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all flex items-center gap-2"
                    >
                      Next: Organization Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {orgStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider text-xs">Step 2: Organization Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-medium">Organization / Legal Entity Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Acme Financial Holdings"
                        value={orgForm.companyName}
                        onChange={(e) => setOrgForm({ ...orgForm, companyName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-medium">Base Reporting Currency</label>
                      <select
                        value={orgForm.baseCurrency}
                        onChange={(e) => setOrgForm({ ...orgForm, baseCurrency: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                      >
                        <option value="INR">INR (₹) - Indian Rupee</option>
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs text-slate-300 font-medium">Industry Vertical</label>
                      <input
                        type="text"
                        value={orgForm.industry}
                        onChange={(e) => setOrgForm({ ...orgForm, industry: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setOrgStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={!orgForm.companyName}
                      onClick={() => setOrgStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all flex items-center gap-2"
                    >
                      Next: Invite Finance Team <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {orgStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider text-xs">Step 3: Initial Finance Roster (Optional)</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Finance Manager Name"
                        value={orgForm.invite1Name}
                        onChange={(e) => setOrgForm({ ...orgForm, invite1Name: e.target.value })}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="email"
                        placeholder="manager@company.com"
                        value={orgForm.invite1Email}
                        onChange={(e) => setOrgForm({ ...orgForm, invite1Email: e.target.value })}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Senior Analyst Name"
                        value={orgForm.invite2Name}
                        onChange={(e) => setOrgForm({ ...orgForm, invite2Name: e.target.value })}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="email"
                        placeholder="analyst@company.com"
                        value={orgForm.invite2Email}
                        onChange={(e) => setOrgForm({ ...orgForm, invite2Email: e.target.value })}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setOrgStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      disabled={orgLoading}
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 font-semibold text-white hover:opacity-95 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                    >
                      {orgLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Setup & Launch Onboarding'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ----------------- BOOK CONSULTATION ----------------- */}
        {activeModal === 'CONSULTATION' && (
          <div className="p-8">
            {consultSuccess ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Consultation Booked!</h3>
                <p className="text-slate-300 text-sm">Our Lead Financial Advisor will confirm your calendar slot shortly.</p>
                <button onClick={onClose} className="px-6 py-2 rounded-xl bg-slate-800 text-white font-medium text-sm">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Book Financial Architecture Consultation</h2>
                    <p className="text-xs text-slate-400">1-on-1 session on custom power BI templates & enterprise AI setup.</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <label className="text-xs text-slate-300">Your Full Name</label>
                    <input
                      required
                      type="text"
                      value={consultForm.name}
                      onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300">Email Address</label>
                    <input
                      required
                      type="email"
                      value={consultForm.email}
                      onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300">Preferred Date & Time</label>
                    <input
                      required
                      type="datetime-local"
                      value={consultForm.date}
                      onChange={(e) => setConsultForm({ ...consultForm, date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    disabled={consultLoading}
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-white transition-all"
                  >
                    {consultLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ----------------- WATCH PRODUCT DEMO VIDEO ----------------- */}
        {activeModal === 'WATCH_DEMO' && (
          <div className="p-8 text-center space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-sky-400 fill-sky-400" /> FinTrack Pro Guided Tour
              </h2>
              <span className="text-xs text-slate-400">Duration: 3m 45s</span>
            </div>

            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center animate-pulse">
                <Play className="w-8 h-8 fill-sky-400 ml-1" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Interactive Dashboard & AI Assistant Preview</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Watch how CFOs generate executive PowerPoint decks and query dataset figures in seconds.
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  onClose();
                  router.push('/dashboard');
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 font-semibold text-white hover:opacity-95 text-sm"
              >
                Try Live Dashboard Demo Now
              </button>
            </div>
          </div>
        )}

        {/* ----------------- CONTACT SALES MODAL ----------------- */}
        {activeModal === 'CONTACT_SALES' && (
          <div className="p-8">
            {salesSuccess ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Inquiry Received!</h3>
                <p className="text-slate-300 text-sm">Our enterprise sales executive will reach out to you directly.</p>
                <button onClick={onClose} className="px-6 py-2 rounded-xl bg-slate-800 text-white font-medium text-sm">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSalesSubmit} className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/20">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Contact Enterprise Sales</h2>
                    <p className="text-xs text-slate-400">Speak with our dedicated team about deployment & custom SLA plans.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-xs text-slate-300">Your Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Ananya Roy"
                      value={salesForm.name}
                      onChange={(e) => setSalesForm({ ...salesForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300">Corporate Email</label>
                    <input
                      required
                      type="email"
                      placeholder="ananya@company.com"
                      value={salesForm.email}
                      onChange={(e) => setSalesForm({ ...salesForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300">Company Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Global Tech Ltd"
                      value={salesForm.company}
                      onChange={(e) => setSalesForm({ ...salesForm, company: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={salesForm.phone}
                      onChange={(e) => setSalesForm({ ...salesForm, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-300">How can we help your organization?</label>
                    <textarea
                      rows={3}
                      placeholder="Describe your current finance setup or custom requirements..."
                      value={salesForm.message}
                      onChange={(e) => setSalesForm({ ...salesForm, message: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    disabled={salesLoading}
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 font-semibold text-white transition-all flex items-center gap-2"
                  >
                    {salesLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Sales Inquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
