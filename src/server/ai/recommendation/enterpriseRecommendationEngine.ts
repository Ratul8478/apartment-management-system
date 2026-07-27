// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 7: Master Unified Enterprise Recommendation Engine
// =======================================================

import { financialAnalyzer } from './financialAnalyzer';
import { businessRuleEngine } from './businessRuleEngine';
import { riskAnalyzer } from './riskAnalyzer';
import { alternativeGenerator } from './alternativeGenerator';
import { scenarioSimulator } from './scenarioSimulator';
import { explainabilityEngine } from './explainabilityEngine';
import { DecisionRecommendation, ScenarioSimulationResult } from './types';

export class EnterpriseRecommendationEngine {
  private static instance: EnterpriseRecommendationEngine;

  private constructor() {}

  public static getInstance(): EnterpriseRecommendationEngine {
    if (!EnterpriseRecommendationEngine.instance) {
      EnterpriseRecommendationEngine.instance = new EnterpriseRecommendationEngine();
    }
    return EnterpriseRecommendationEngine.instance;
  }

  /**
   * Executes full Recommendation & Decision Intelligence Pipeline:
   * 1. Quantitative Financial Analysis
   * 2. Business Rule Trigger Evaluation
   * 3. Probabilistic Risk Assessment
   * 4. Alternative Strategy Generation
   * 5. Scenario Simulation ("What-If Analysis")
   * 6. Explainability Rationale Generation
   */
  public generateDecisionRecommendations(params: {
    tenantId: string;
    userId: string;
    metrics: { turnover: number; profitLoss: number; cost: number };
  }): {
    recommendations: DecisionRecommendation[];
    simulations: ScenarioSimulationResult[];
  } {
    const { tenantId, userId, metrics } = params;

    // 1. Analyze Financials
    const analysis = financialAnalyzer.analyzeFinancials(metrics);

    // 2. Evaluate Business Rules
    const triggeredRules = businessRuleEngine.evaluateRules(analysis);

    // 3. Evaluate Probabilistic Risk
    const riskReport = riskAnalyzer.evaluateRisk(analysis);

    // 4. Generate Alternative Strategies
    const alternatives = alternativeGenerator.generateAlternatives(analysis);

    // 5. Run Scenario Simulations ("What-if Analysis")
    const simulations = scenarioSimulator.runScenarioSimulation(analysis, 10, 5);

    // 6. Generate Explainability Rationale
    const explainability = explainabilityEngine.generateExplainability(analysis, riskReport);

    // Build Decision Recommendation objects
    const recommendations: DecisionRecommendation[] = triggeredRules.map((rule, idx) => ({
      recommendationId: `rec_${Date.now()}_${idx + 1}`,
      tenantId,
      userId,
      category: rule.category,
      title: rule.title,
      priority: rule.priority,
      financialImpact: `Targeting +${(15.0 - Math.min(15.0, analysis.netMarginPct)).toFixed(1)}% Net Margin Improvement`,
      riskReport,
      expectedRoiPct: 18.5,
      confidenceScore: 0.96,
      implementationDifficulty: 'MODERATE',
      estimatedCost: 'Low (Operational Optimization)',
      estimatedBenefit: `₹${Math.round(analysis.cost * 0.1).toLocaleString()} potential annual cost savings`,
      alternatives,
      supportingEvidence: explainability.supportingEvidence,
      rationaleExplainability: explainability.rationale,
      assumptionsAndLimitations: explainability.assumptionsAndLimitations,
      nextActionSteps: explainability.nextActionSteps,
      createdAt: new Date().toISOString(),
    }));

    // Default fallback if no rules triggered
    if (recommendations.length === 0) {
      recommendations.push({
        recommendationId: `rec_${Date.now()}_default`,
        tenantId,
        userId,
        category: 'REVENUE_GROWTH',
        title: 'Capital Reinvestment & Shareholder Value Expansion',
        priority: 'MEDIUM',
        financialImpact: 'Sustained 15%+ Operating Margin Growth',
        riskReport,
        expectedRoiPct: 15.0,
        confidenceScore: 0.98,
        implementationDifficulty: 'EASY',
        estimatedCost: 'Minimal',
        estimatedBenefit: 'Long-term equity expansion',
        alternatives,
        supportingEvidence: explainability.supportingEvidence,
        rationaleExplainability: explainability.rationale,
        assumptionsAndLimitations: explainability.assumptionsAndLimitations,
        nextActionSteps: explainability.nextActionSteps,
        createdAt: new Date().toISOString(),
      });
    }

    return { recommendations, simulations };
  }
}

export const enterpriseRecommendationEngine = EnterpriseRecommendationEngine.getInstance();
