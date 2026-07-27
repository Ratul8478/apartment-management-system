// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 8: Forecasting & Predictive Engine Types
// =======================================================

export type ForecastHorizon = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export type ForecastTarget = 'REVENUE' | 'PROFIT' | 'EXPENSE' | 'CASH_FLOW' | 'TURNOVER' | 'BUDGET_UTILIZATION';

export interface FeatureRecord {
  featureId: string;
  featureName: string;
  value: number;
  category: 'REVENUE_VELOCITY' | 'PROFIT_MARGIN' | 'COST_RATIO' | 'VOLATILITY' | 'SEASONALITY';
  timestamp: string;
}

export interface FeatureStoreRecord {
  tenantId: string;
  features: Map<string, number>;
  lastUpdated: string;
}

export interface ForecastTimePoint {
  periodLabel: string; // e.g. "Q3 FY2026", "Month 1"
  predictedValue: number;
  confidenceIntervalLow: number;
  confidenceIntervalHigh: number;
}

export interface ForecastResult {
  forecastId: string;
  tenantId: string;
  target: ForecastTarget;
  horizon: ForecastHorizon;
  timePoints: ForecastTimePoint[];
  baselineValue: number;
  predictedGrowthPct: number;
  modelName: string;
  modelVersion: string;
  confidenceScore: number; // 0.0 to 1.0
  createdAt: string;
}

export interface AnomalyAlert {
  alertId: string;
  tenantId: string;
  anomalyType: 'EXPENSE_SPIKE' | 'REVENUE_DROP' | 'BUDGET_OVERRUN' | 'FRAUD_INDICATOR';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  metricName: string;
  observedValue: number;
  expectedValue: number;
  deviationPct: number;
  confidenceScore: number;
  explanation: string;
  createdAt: string;
}

export interface ModelArtifact {
  modelId: string;
  modelName: string;
  target: ForecastTarget;
  version: string;
  algorithm: 'HOLT_WINTERS_EXPONENTIAL_SMOOTHING' | 'TREND_EXTRAPOLATION' | 'TEMPORAL_ENSEMBLE';
  mae: number;
  rmse: number;
  mape: number;
  approvalStatus: 'APPROVED' | 'PENDING_REVIEW';
  isProductionReady: boolean;
  trainedAt: string;
}

export interface ExplainableForecastPackage {
  forecast: ForecastResult;
  topDrivers: { featureName: string; impactPct: number; description: string }[];
  assumptions: string[];
  limitations: string;
  anomalies: AnomalyAlert[];
}
