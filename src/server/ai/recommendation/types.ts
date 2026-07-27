// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 7: Enterprise Recommendation Engine Types
// =======================================================

export type RecommendationCategory =
  | 'FINANCIAL_OPTIMIZATION'
  | 'EXPENSE_REDUCTION'
  | 'REVENUE_GROWTH'
  | 'CASH_FLOW_IMPROVEMENT'
  | 'INVESTMENT_STRATEGY'
  | 'BUDGET_REALLOCATION'
  | 'RISK_MITIGATION'
  | 'OPERATIONAL_EFFICIENCY';

export interface FinancialAnalysisResult {
  turnover: number;
  profitLoss: number;
  cost: number;
  netMarginPct: number;
  costToTurnoverRatio: number;
  isMarginTargetMet: boolean; // Target = 15%
  isCostRatioHigh: boolean;    // Threshold = 70%
}

export interface RiskAnalysisReport {
  financialRisk: number;  // 0.0 to 1.0
  operationalRisk: number;// 0.0 to 1.0
  complianceRisk: number; // 0.0 to 1.0
  compositeRiskScore: number;
  riskSummary: string;
}

export interface AlternativeOption {
  optionId: string;
  strategyName: 'BEST_OPTION' | 'SAFER_OPTION' | 'LOWER_COST_OPTION' | 'CONSERVATIVE_OPTION' | 'HIGH_GROWTH_OPTION';
  description: string;
  expectedCost: string;
  expectedBenefit: string;
  tradeoffs: string;
}

export interface ScenarioSimulationResult {
  scenarioName: string;
  projectedTurnover: number;
  projectedProfit: number;
  projectedMarginPct: number;
  varianceFromBaseline: string;
}

export interface DecisionRecommendation {
  recommendationId: string;
  tenantId: string;
  userId: string;
  category: RecommendationCategory;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  financialImpact: string;
  riskReport: RiskAnalysisReport;
  expectedRoiPct: number;
  confidenceScore: number; // 0.0 to 1.0
  implementationDifficulty: 'EASY' | 'MODERATE' | 'COMPLEX';
  estimatedCost: string;
  estimatedBenefit: string;
  alternatives: AlternativeOption[];
  supportingEvidence: string[];
  rationaleExplainability: string;
  assumptionsAndLimitations: string;
  nextActionSteps: string[];
  createdAt: string;
}
