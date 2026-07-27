// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 2: Configurable Business Rule Engine
// =======================================================

import { FinancialAnalysisResult, RecommendationCategory } from './types';

export class BusinessRuleEngine {
  private static instance: BusinessRuleEngine;

  private constructor() {}

  public static getInstance(): BusinessRuleEngine {
    if (!BusinessRuleEngine.instance) {
      BusinessRuleEngine.instance = new BusinessRuleEngine();
    }
    return BusinessRuleEngine.instance;
  }

  /**
   * Evaluates corporate business rules and returns triggered recommendation categories
   */
  public evaluateRules(analysis: FinancialAnalysisResult): { category: RecommendationCategory; title: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }[] {
    const triggered: { category: RecommendationCategory; title: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }[] = [];

    // Rule 1: High Cost-to-Turnover Ratio (> 70%)
    if (analysis.isCostRatioHigh) {
      triggered.push({
        category: 'EXPENSE_REDUCTION',
        title: 'Operational Expenditure Optimization Required',
        priority: 'HIGH',
      });
    }

    // Rule 2: Low Net Profit Margin (< 15%)
    if (!analysis.isMarginTargetMet) {
      triggered.push({
        category: 'FINANCIAL_OPTIMIZATION',
        title: 'Net Margin Restoration Strategy (Target: 15%)',
        priority: 'HIGH',
      });
    }

    // Rule 3: Positive Capital Baseline (Turnover > Cost)
    if (analysis.turnover > analysis.cost && analysis.netMarginPct >= 15.0) {
      triggered.push({
        category: 'REVENUE_GROWTH',
        title: 'Capital Reinvestment & Share Value Expansion',
        priority: 'MEDIUM',
      });
    }

    return triggered;
  }
}

export const businessRuleEngine = BusinessRuleEngine.getInstance();
