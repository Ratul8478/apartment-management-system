// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 4: User Personalization Engine Types
// =======================================================

export type ExplanationDepthLevel =
  | 'LEVEL_1_EXECUTIVE_SUMMARY'
  | 'LEVEL_2_BUSINESS_OVERVIEW'
  | 'LEVEL_3_DETAILED_EXPLANATION'
  | 'LEVEL_4_TECHNICAL'
  | 'LEVEL_5_ENGINEERING';

export type PreferredExportFormat = 'PDF' | 'EXCEL' | 'POWERPOINT' | 'CSV' | 'WORD' | 'INTERACTIVE_DASHBOARD';

export interface CommunicationStyleScores {
  executiveScore: number;  // 0.0 to 1.0
  technicalScore: number;  // 0.0 to 1.0
  financeScore: number;    // 0.0 to 1.0
  analyticalScore: number; // 0.0 to 1.0
  minimalScore: number;    // 0.0 to 1.0
  detailedScore: number;   // 0.0 to 1.0
}

export interface EmployeePersonalityProfile {
  userId: string;
  tenantId: string;
  department: string;
  role: string;
  experienceLevel: 'JUNIOR' | 'MID' | 'SENIOR' | 'EXECUTIVE';
  preferredLanguage: 'ENGLISH' | 'HINDI' | 'BENGALI' | 'CORPORATE_ENGLISH' | 'TECHNICAL_ENGLISH';
  preferredTone: 'EXECUTIVE_BRIEFING' | 'PROFESSIONAL' | 'TECHNICAL' | 'CONCISE';
  explanationDepth: ExplanationDepthLevel;
  styleScores: CommunicationStyleScores;
  preferredChartStyle: 'BAR' | 'PIE' | 'LINE' | 'AREA';
  preferredDashboardLayout: 'EXECUTIVE_KPI' | 'FINANCIAL_LEDGER' | 'REVENUE_ANALYTICS';
  preferredReportFormat: PreferredExportFormat;
  favoriteMetrics: string[];
  recurringWorkflows: {
    workflowName: string;
    frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
    lastRunAt?: string;
  }[];
  confidenceScore: number; // 0.0 to 1.0
  lastUpdated: string;
}

export interface BehaviorModel {
  activityScore: number;       // 0.0 to 1.0
  productivityIndex: number;   // 0.0 to 1.0
  financialInterestPattern: string[];
  reportingFrequencyPattern: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  favoriteVisualizationTypes: string[];
}

export interface PersonalizationScore {
  memoryQuality: number;        // 0.0 to 1.0
  preferenceConfidence: number; // 0.0 to 1.0
  communicationMatch: number;   // 0.0 to 1.0
  workflowMatch: number;        // 0.0 to 1.0
  overallScore: number;         // 0.0 to 1.0
}
