import {
  SubscriptionStatus,
  BillingCycle,
  PaymentGatewayProvider,
  InvoiceStatus,
  BillingReason,
  TaxType,
} from '@prisma/client';

export {
  SubscriptionStatus,
  BillingCycle,
  PaymentGatewayProvider,
  InvoiceStatus,
  BillingReason,
  TaxType,
};

export interface PlanFeatures {
  aiTokenQuotaMonthly: number;
  apiRequestsMonthly: number;
  storageAllocationMb: number;
  ocrDocumentsMonthly: number;
  forecastRunsMonthly: number;
  reportGenerationsMonthly: number;
  userLimit: number;
  customBranding: boolean;
  prioritySupport: boolean;
  customDomain: boolean;
  slaPercentage: number;
  integrationsAllowed: string[];
}

export interface PlanDTO {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  trialPeriodDays: number;
  features: PlanFeatures;
  isActive: boolean;
  isCustom: boolean;
}

export interface SubscriptionDTO {
  id: string;
  organizationId: string;
  planId: string;
  plan: PlanDTO;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart: string | null;
  trialEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  paymentGateway: PaymentGatewayProvider;
  prorationCredits: number;
}

export interface ProrationCalculation {
  currentPlanCode: string;
  newPlanCode: string;
  billingCycle: BillingCycle;
  daysTotalInPeriod: number;
  daysRemainingInPeriod: number;
  unusedCurrentPlanCredit: number;
  newPlanProratedCharge: number;
  grossAmountDue: number;
  taxAmount: number;
  netPayableAmount: number;
  effectiveDate: string;
  prorationApplied: boolean;
}

export interface TaxCalculationResult {
  subtotal: number;
  country: string;
  state: string | null;
  taxType: TaxType;
  taxRate: number;
  taxAmount: number;
  totalWithTax: number;
  isExempt: boolean;
  exemptionCode?: string;
  taxRuleName: string;
}

export interface InvoiceLineItemDTO {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  proration: boolean;
  taxAmount: number;
}

export interface InvoiceDTO {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  subscriptionId: string | null;
  status: InvoiceStatus;
  billingReason: BillingReason;
  periodStart: string;
  periodEnd: string;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  amountPaid: number;
  amountRemaining: number;
  currency: string;
  gatewayPaymentId: string | null;
  pdfUrl: string | null;
  finalizedAt: string | null;
  paidAt: string | null;
  dueDate: string;
  lineItems: InvoiceLineItemDTO[];
}

export interface UsageQuotaStatus {
  metricKey: string;
  label: string;
  used: number;
  quota: number;
  unit: string;
  percentageUsed: number;
  isExceeded: boolean;
}

export interface UsageMeteringSummary {
  organizationId: string;
  periodStart: string;
  periodEnd: string;
  metrics: Record<string, UsageQuotaStatus>;
}

export interface PaymentProcessRequest {
  organizationId: string;
  invoiceId?: string;
  planCode?: string;
  billingCycle?: BillingCycle;
  paymentMethodId?: string;
  gateway?: PaymentGatewayProvider;
  idempotencyKey: string;
}

export interface PaymentProcessResponse {
  success: boolean;
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  invoiceId?: string;
  message: string;
  failureReason?: string;
}

export interface RevenueAnalyticsSummary {
  mrr: number;
  arr: number;
  lifetimeValueAverage: number;
  churnRatePercentage: number;
  trialToPaidConversionRate: number;
  averageRevenuePerUser: number;
  paymentSuccessRatePercentage: number;
  totalOverdueAmount: number;
  activeSubscriptionsCount: number;
  revenueByPlan: { planName: string; amount: number; subscriberCount: number }[];
  monthlyTrend: { month: string; mrr: number; newArr: number; churnedMrr: number }[];
}
