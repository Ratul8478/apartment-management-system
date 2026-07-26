'use client';

import React, { useState, useEffect } from 'react';
import {
  PlanDTO,
  SubscriptionDTO,
  BillingCycle,
  ProrationCalculation,
  InvoiceDTO,
  UsageMeteringSummary,
  RevenueAnalyticsSummary,
} from '@/types/billing';
import { PlanCard } from '@/components/billing/PlanCard';
import { ProrationModal } from '@/components/billing/ProrationModal';
import { InvoiceViewerModal } from '@/components/billing/InvoiceViewerModal';
import { UsageGauge } from '@/components/billing/UsageGauge';
import { PaymentMethodCard } from '@/components/billing/PaymentMethodCard';
import { RevenueAnalyticsCharts } from '@/components/billing/RevenueAnalyticsCharts';
import { TaxCalculatorWidget } from '@/components/billing/TaxCalculatorWidget';
import {
  CreditCard,
  Zap,
  FileText,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';

export default function BillingPortalPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'invoices' | 'payment_methods' | 'analytics' | 'tax'>(
    'overview'
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');

  // State variables
  const [plans, setPlans] = useState<PlanDTO[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionDTO | null>(null);
  const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);
  const [usageSummary, setUsageSummary] = useState<UsageMeteringSummary | null>(null);
  const [analytics, setAnalytics] = useState<RevenueAnalyticsSummary | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  // Modals & Payment state
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<PlanDTO | null>(null);
  const [prorationPreview, setProrationPreview] = useState<ProrationCalculation | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDTO | null>(null);
  const [processingStripeInvoiceId, setProcessingStripeInvoiceId] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setIsLoading(true);
    try {
      const [plansRes, subRes, invRes, usageRes, analyticsRes, pmRes] = await Promise.all([
        fetch('/api/billing/plans').then((r) => r.json()),
        fetch('/api/billing/subscription').then((r) => r.json()),
        fetch('/api/billing/invoices').then((r) => r.json()),
        fetch('/api/billing/usage').then((r) => r.json()),
        fetch('/api/billing/analytics').then((r) => r.json()),
        fetch('/api/billing/payment-methods').then((r) => r.json()),
      ]);

      if (plansRes.success) setPlans(plansRes.data);
      if (subRes.success) setSubscription(subRes.data);
      if (invRes.success) setInvoices(invRes.data);
      if (usageRes.success) setUsageSummary(usageRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (pmRes.success) setPaymentMethods(pmRes.data);
    } catch (err) {
      console.error('Failed to load billing portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayWithStripe = async (invoice: InvoiceDTO) => {
    setProcessingStripeInvoiceId(invoice.id);
    setPaymentNotice(null);
    try {
      const res = await fetch('/api/billing/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          amount: invoice.total,
          currency: invoice.currency,
        }),
      }).then((r) => r.json());

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else if (res.success) {
        setPaymentNotice(`✅ Stripe Real-Time Settlement Successful for Invoice ${invoice.invoiceNumber}. Company financial balances have been updated!`);
        await fetchBillingData();
      } else {
        setPaymentNotice(`❌ Payment failed: ${res.message || 'Payment engine error'}`);
      }
    } catch (err: any) {
      setPaymentNotice(`❌ Stripe transaction error: ${err.message || 'Failed to process payment'}`);
    } finally {
      setProcessingStripeInvoiceId(null);
    }
  };

  const handleSelectPlanForUpgrade = async (plan: PlanDTO) => {
    setSelectedPlanForUpgrade(plan);
    try {
      const res = await fetch(
        `/api/billing/proration-preview?newPlanCode=${plan.code}&billingCycle=${billingCycle}`
      ).then((r) => r.json());

      if (res.success) {
        setProrationPreview(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch proration preview:', err);
    }
  };

  const handleConfirmPlanChange = async () => {
    if (!selectedPlanForUpgrade) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/billing/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CHANGE_PLAN',
          planCode: selectedPlanForUpgrade.code,
          billingCycle,
        }),
      }).then((r) => r.json());

      if (res.success) {
        setSubscription(res.data);
        setSelectedPlanForUpgrade(null);
        setProrationPreview(null);
        setPaymentNotice('✅ Subscription upgraded successfully via Stripe payment engine! Company balance balanced.');
        await fetchBillingData();
      }
    } catch (err) {
      console.error('Plan change error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivate = async () => {
    try {
      const res = await fetch('/api/billing/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REACTIVATE' }),
      }).then((r) => r.json());

      if (res.success) {
        setSubscription(res.data);
      }
    } catch (err) {
      console.error('Reactivation error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white">Enterprise Billing & Revenue Portal</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Self-Service Portal
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-purple-400" /> Stripe Live Settlement
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage commercial subscription plans, usage quotas, payment methods, taxation, and real-time inter-company Stripe transactions.
          </p>
        </div>

        {subscription && (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Current Plan</div>
              <div className="text-sm font-bold text-white">
                {subscription.plan.name}{' '}
                <span className="text-xs font-semibold text-emerald-400">({subscription.status})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {paymentNotice && (
        <div className="p-4 bg-indigo-950/80 border border-indigo-500/40 rounded-2xl text-sm font-semibold text-indigo-200 flex items-center justify-between animate-in fade-in duration-300">
          <span>{paymentNotice}</span>
          <button onClick={() => setPaymentNotice(null)} className="text-slate-400 hover:text-white">×</button>
        </div>
      )}

      {/* Portal Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" /> Overview & Quotas
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'plans'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Commercial Plans
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'invoices'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" /> Invoices & Receipts ({invoices.length})
        </button>

        <button
          onClick={() => setActiveTab('payment_methods')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'payment_methods'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Payment Methods
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Revenue Analytics
        </button>

        <button
          onClick={() => setActiveTab('tax')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'tax'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Taxation & GST/VAT
        </button>
      </div>

      {/* TAB 1: OVERVIEW & QUOTAS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Active Subscription Summary Banner */}
          {subscription && (
            <div className="p-6 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  Active Enterprise Subscription
                </div>
                <h2 className="text-2xl font-black text-white mt-1">{subscription.plan.name} Tier</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Current Billing Cycle ends on{' '}
                  <strong className="text-slate-200">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {subscription.cancelAtPeriodEnd ? (
                  <button
                    onClick={handleReactivate}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all"
                  >
                    Reactivate Subscription
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-900/30 transition-all"
                  >
                    Upgrade / Switch Plan
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Real-time Usage Gauges */}
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4">Real-Time Quota Consumption</h3>
            {usageSummary ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(usageSummary.metrics).map((m) => (
                  <UsageGauge key={m.metricKey} status={m} />
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400">
                Loading usage metrics...
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PLANS & UPGRADES */}
      {activeTab === 'plans' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Monthly / Yearly Billing Cycle Selector */}
          <div className="flex justify-center">
            <div className="p-1 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-1">
              <button
                onClick={() => setBillingCycle('MONTHLY')}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  billingCycle === 'MONTHLY'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('YEARLY')}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'YEARLY'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                currentPlanCode={subscription?.plan.code}
                onSelectPlan={handleSelectPlanForUpgrade}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INVOICES & RECEIPTS */}
      {activeTab === 'invoices' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Billing Invoices & Receipts Ledger</h3>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Real-Time Stripe Settlement Enabled
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-850 text-xs font-semibold text-slate-400 uppercase">
                  <th className="p-4">Invoice Number</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Billing Reason</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4 font-bold text-slate-200">{inv.invoiceNumber}</td>
                    <td className="p-4 text-slate-400">{new Date(inv.periodStart).toLocaleDateString()}</td>
                    <td className="p-4 text-xs font-semibold text-slate-300 uppercase">{inv.billingReason}</td>
                    <td className="p-4 font-extrabold text-white">
                      ${inv.total.toFixed(2)} {inv.currency}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {inv.status !== 'PAID' && (
                        <button
                          disabled={processingStripeInvoiceId === inv.id}
                          onClick={() => handlePayWithStripe(inv)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md transition-all inline-flex items-center gap-1 disabled:opacity-50"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          {processingStripeInvoiceId === inv.id ? 'Processing...' : 'Pay with Stripe'}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      >
                        View PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENT METHODS */}
      {activeTab === 'payment_methods' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Saved Payment Methods (Stripe / Gateway)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((pm) => (
              <PaymentMethodCard key={pm.id} method={pm} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REVENUE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="animate-in fade-in duration-300">
          <RevenueAnalyticsCharts data={analytics} />
        </div>
      )}

      {/* TAB 6: TAXATION */}
      {activeTab === 'tax' && (
        <div className="animate-in fade-in duration-300">
          <TaxCalculatorWidget />
        </div>
      )}

      {/* Modals */}
      <ProrationModal
        isOpen={!!selectedPlanForUpgrade}
        onClose={() => {
          setSelectedPlanForUpgrade(null);
          setProrationPreview(null);
        }}
        targetPlan={selectedPlanForUpgrade}
        currentPlanCode={subscription?.plan.code || 'FREE'}
        billingCycle={billingCycle}
        proration={prorationPreview}
        onConfirm={handleConfirmPlanChange}
        isSubmitting={isSubmitting}
      />

      <InvoiceViewerModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}
