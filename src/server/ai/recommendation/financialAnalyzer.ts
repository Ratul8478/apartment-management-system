// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 1: Financial Analysis Engine
// =======================================================

import { FinancialAnalysisResult } from './types';

export class FinancialAnalyzer {
  private static instance: FinancialAnalyzer;

  private constructor() {}

  public static getInstance(): FinancialAnalyzer {
    if (!FinancialAnalyzer.instance) {
      FinancialAnalyzer.instance = new FinancialAnalyzer();
    }
    return FinancialAnalyzer.instance;
  }

  /**
   * Executes quantitative financial analysis against target thresholds
   */
  public analyzeFinancials(metrics: { turnover: number; profitLoss: number; cost: number }): FinancialAnalysisResult {
    const turnover = metrics.turnover || 0;
    const profitLoss = metrics.profitLoss || 0;
    const cost = metrics.cost || 0;

    const netMarginPct = turnover > 0 ? Number(((profitLoss / turnover) * 100).toFixed(2)) : 0;
    const costToTurnoverRatio = turnover > 0 ? Number(((cost / turnover) * 100).toFixed(2)) : 0;

    return {
      turnover,
      profitLoss,
      cost,
      netMarginPct,
      costToTurnoverRatio,
      isMarginTargetMet: netMarginPct >= 15.0,
      isCostRatioHigh: costToTurnoverRatio > 70.0,
    };
  }
}

export const financialAnalyzer = FinancialAnalyzer.getInstance();
