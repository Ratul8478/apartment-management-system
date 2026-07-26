export interface OnboardingStepDTO {
  id: string;
  stepKey: string;
  stepName: string;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface ProductAnalyticsSummary {
  dau: number;
  mau: number;
  dauMauRatioPercentage: number;
  totalEventsLogged: number;
  topFeaturesUsed: { featureKey: string; name: string; count: number }[];
  activeUsersCount: number;
  aiFeatureUsageTrend: { date: string; aiTokenCount: number; ocrScanCount: number; forecastCount: number }[];
}

export interface CustomerHealthScoreDTO {
  id: string;
  organizationId: string;
  score: number; // 0-100
  category: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'EXCELLENT';
  scoreFactors: {
    onboardingCompletion: number;
    loginFrequencyDaysPerWeek: number;
    aiTokenUtilizationPercentage: number;
    billingStanding: string;
    supportTicketsOpen: number;
    reportGenerationsMonthly: number;
    activeUserPercentage: number;
  };
  recommendations: string[];
  calculatedAt: string;
}

export interface SuccessPlanDTO {
  id: string;
  organizationId: string;
  title: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
  targetDate: string;
  objectives: { id: string; title: string; isCompleted: boolean }[];
  notes: { author: string; note: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationCampaignDTO {
  id: string;
  campaignKey: string;
  title: string;
  triggerType: string;
  channel: 'EMAIL' | 'IN_APP';
  subject: string;
  contentTemplate: string;
  sentCount: number;
  openCount: number;
  openRatePercentage: number;
  isActive: boolean;
}

export interface CrmSyncStatusDTO {
  id?: string;
  organizationId: string;
  crmProvider: 'SALESFORCE' | 'HUBSPOT' | 'ZOHO' | 'MOCK';
  status: 'SYNCED' | 'FAILED' | 'PENDING';
  syncedAt: string;
  syncedRecordsCount: number;
  errorMessage?: string;
}

export interface KnowledgeArticleDTO {
  id: string;
  slug: string;
  title: string;
  category: 'GETTING_STARTED' | 'FINANCIAL_AI' | 'BILLING_SUBSCRIPTIONS' | 'API_INTEGRATIONS' | 'FAQS';
  content: string;
  views: number;
  helpfulCount: number;
  isPublished: boolean;
}

export interface ExecutiveBusinessReportSummary {
  organizationName: string;
  reportPeriod: string;
  healthScore: number;
  healthCategory: string;
  activeUsers: number;
  mrr: number;
  arr: number;
  aiTokenConsumptionTotal: number;
  financialRecordsIngestedTotal: number;
  forecastsExecutedTotal: number;
  reportsExportedTotal: number;
  supportSlaCompliancePercentage: number;
  keyMilestones: string[];
}
