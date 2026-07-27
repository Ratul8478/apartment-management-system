// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 6: Recommendation Explainability Engine
// =======================================================

import { FinancialAnalysisResult, RiskAnalysisReport } from './types';

export class ExplainabilityEngine {
  private static instance: ExplainabilityEngine;

  private constructor() {}

  public static getInstance(): ExplainabilityEngine {
    if (!ExplainabilityEngine.instance) {
      ExplainabilityEngine.instance = new ExplainabilityEngine();
    }
    return ExplainabilityEngine.instance;
  }

  /**
   * Generates transparent, evidence-based explainability rationale
   */
  public generateExplainability(analysis: FinancialAnalysisResult, risk: RiskAnalysisReport): {
    rationale: string;
    supportingEvidence: string[];
    assumptionsAndLimitations: string;
    nextActionSteps: string[];
  } {
    const rationale = `This recommendation is generated based on real-time financial ledger metrics. Current Turnover is ₹${analysis.turnover.toLocaleString()}, Net Profit is ₹${analysis.profitLoss.toLocaleString()}, and Net Operating Margin stands at ${analysis.netMarginPct}%. Corporate policy targets a 15% net margin.`;

    const supportingEvidence = [
      `Total Operational Expenses: ₹${analysis.cost.toLocaleString()} (${analysis.costToTurnoverRatio}% of turnover)`,
      `Composite Risk Score: ${risk.compositeRiskScore} (${risk.riskSummary})`,
      'Grounded in verified database ledger records and enterprise financial policies.',
    ];

    const assumptionsAndLimitations = 'Assumes fixed overhead costs remain constant over the next fiscal quarter. External macroeconomic shifts or major unplanned capital expenditures are excluded from baseline calculations.';

    const nextActionSteps = [
      'Step 1: Review operational cost breakdown lines exceeding 70% turnover threshold.',
      'Step 2: Initiate vendor contract negotiations for top 3 procurement suppliers.',
      'Step 3: Evaluate "What-If" 10% cost reduction scenario in next finance committee meeting.',
    ];

    return {
      rationale,
      supportingEvidence,
      assumptionsAndLimitations,
      nextActionSteps,
    };
  }
}

export const explainabilityEngine = ExplainabilityEngine.getInstance();
