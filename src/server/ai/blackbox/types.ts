// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Black Box System Core Type Definitions
// =======================================================

export interface TenantIdentity {
  organizationId: string;
  userId: string;
  userRole: 'SUPER_ADMIN' | 'ADMIN' | 'FINANCE_MANAGER' | 'ANALYST' | 'AUDITOR';
  departmentId?: string;
}

export interface AIExecutionRequest {
  tenant: TenantIdentity;
  question: string;
  sessionId?: string;
  requestedModule?: 'ANALYTICS' | 'FORECASTING' | 'REASONING' | 'RECOMMENDATION' | 'GENERAL';
  metadata?: Record<string, any>;
}

export interface ExecutionPlanStep {
  stepNumber: number;
  action: 'RETRIEVE_CONTEXT' | 'EVALUATE_PERMISSIONS' | 'QUERY_LEDGER' | 'COMPUTE_FORECAST' | 'SYNTHESIZE_ANSWER';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  description: string;
}

export interface AIExecutionPlan {
  planId: string;
  steps: ExecutionPlanStep[];
  confidenceScore: number;
  isExecutable: boolean;
}

export interface AIMemoryRecord {
  tenantId: string;
  userId: string;
  conversationHistory: { role: 'user' | 'assistant'; message: string; timestamp: string }[];
  userPreferences: {
    communicationStyle: 'CONCISE' | 'DETAILED' | 'EXECUTIVE_SUMMARY';
    frequentlyQueriedMetrics: string[];
    riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  };
  lastActiveTimestamp: string;
}

export interface FilteredFinancialContext {
  turnover: number;
  profitLoss: number;
  cost: number;
  netMarginPct: number;
  totalRecordsCount: number;
  recentTransactions: any[];
  sharePriceBenchmarks: any[];
  departmentBudgets?: any[];
  forecastTrend?: { quarter: string; predictedValue: number; confidenceLow: number; confidenceHigh: number }[];
}

export interface AIExecutionResponse {
  answer: string;
  provider: string;
  confidenceScore: number;
  isEstimate: boolean;
  suggestedVisualizations?: {
    title: string;
    chartType: 'BAR' | 'PIE' | 'LINE';
    data: { label: string; value: number }[];
  }[];
  recommendations?: string[];
  executionTimeMs: number;
}
