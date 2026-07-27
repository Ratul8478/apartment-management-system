// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 3: Conversation Intelligence Engine Types
// =======================================================

export type DetectedIntent =
  | 'INVESTMENT_ANALYSIS'
  | 'PROFIT_FORECAST'
  | 'EXPENSE_REPORT'
  | 'GENERATE_PPT'
  | 'SCHEDULE_MEETING'
  | 'FINANCIAL_DASHBOARD'
  | 'PROJECT_STATUS'
  | 'RISK_ASSESSMENT'
  | 'BUDGET_PLANNING'
  | 'CASH_FLOW'
  | 'DATA_VISUALIZATION'
  | 'RECOMMENDATION_REQUEST'
  | 'DOCUMENT_SUMMARY'
  | 'GENERAL_FINANCIAL_QUERY';

export type BusinessDomain =
  | 'FINANCE'
  | 'INVESTMENT'
  | 'ACCOUNTING'
  | 'MARKETING'
  | 'HUMAN_RESOURCES'
  | 'SALES'
  | 'OPERATIONS'
  | 'LEGAL'
  | 'COMPANY_STRATEGY';

export type SentimentTone =
  | 'PROFESSIONAL'
  | 'NEUTRAL'
  | 'URGENT'
  | 'FRUSTRATED'
  | 'SATISFIED'
  | 'CONFUSED'
  | 'EXECUTIVE_BRIEFING'
  | 'TECHNICAL_DISCUSSION';

export type CommunicationStyle = 'EXECUTIVE_SUMMARY' | 'DETAILED_EXPLANATION' | 'STEP_BY_STEP' | 'BULLET_POINTS' | 'TECHNICAL';

export interface ExtractedEntity {
  type: 'CURRENCY' | 'REVENUE' | 'EXPENSE' | 'DEPARTMENT' | 'EMPLOYEE' | 'PROJECT' | 'DATE' | 'KPI' | 'BUDGET';
  value: string | number;
  rawText: string;
}

export interface ExtractedTask {
  taskId: string;
  title: string;
  actionType: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  deadline?: string;
}

export interface ExtractedActionItem {
  actionId: string;
  description: string;
  assignedToRole?: string;
  isUrgent: boolean;
}

export interface StructuredConversationContext {
  conversationId: string;
  tenantId: string;
  userId: string;
  userRole: string;
  rawQuestion: string;
  intent: DetectedIntent;
  domain: BusinessDomain;
  topic: string;
  subtopic: string;
  entities: ExtractedEntity[];
  financialMetrics: {
    referencedTurnover?: number;
    referencedProfit?: number;
    referencedCost?: number;
    currency?: string;
  };
  tasks: ExtractedTask[];
  actionItems: ExtractedActionItem[];
  sentiment: SentimentTone;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  communicationStyle: CommunicationStyle;
  language: 'ENGLISH' | 'HINDI' | 'BENGALI' | 'CORPORATE_FINANCIAL';
  confidenceScore: number;
  missingInformation: string[];
  suggestedWorkflow: string;
  recommendedAiModules: string[];
}
