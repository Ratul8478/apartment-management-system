// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 3: Probabilistic Risk Analysis Engine
// =======================================================

import { FinancialAnalysisResult, RiskAnalysisReport } from './types';

export class RiskAnalyzer {
  private static instance: RiskAnalyzer;

  private constructor() {}

  public static getInstance(): RiskAnalyzer {
    if (!RiskAnalyzer.instance) {
      RiskAnalyzer.instance = new RiskAnalyzer();
    }
    return RiskAnalyzer.instance;
  }

  /**
   * Evaluates probabilistic risk scores across financial, operational, and compliance categories
   */
  public evaluateRisk(analysis: FinancialAnalysisResult): RiskAnalysisReport {
    let financialRisk = 0.2;
    let operationalRisk = 0.25;
    let complianceRisk = 0.15;

    if (analysis.isCostRatioHigh) {
      financialRisk += 0.35;
      operationalRisk += 0.3;
    }

    if (!analysis.isMarginTargetMet) {
      financialRisk += 0.25;
    }

    const compositeRiskScore = Number(((financialRisk * 0.4 + operationalRisk * 0.4 + complianceRisk * 0.2)).toFixed(2));

    let riskSummary = 'Low risk profile: Capital baseline is stable and operating margins meet target expectations.';
    if (compositeRiskScore > 0.6) {
      riskSummary = 'High risk profile: Operational costs exceed 70% of gross turnover. Immediate cost containment is advised.';
    } else if (compositeRiskScore > 0.4) {
      riskSummary = 'Moderate risk profile: Net margin is below target 15%. Recommend monitoring vendor contracts.';
    }

    return {
      financialRisk: Number(financialRisk.toFixed(2)),
      operationalRisk: Number(operationalRisk.toFixed(2)),
      complianceRisk: Number(complianceRisk.toFixed(2)),
      compositeRiskScore,
      riskSummary,
    };
  }
}

export const riskAnalyzer = RiskAnalyzer.getInstance();
