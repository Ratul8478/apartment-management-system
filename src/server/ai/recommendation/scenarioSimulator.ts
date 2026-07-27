// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 5: Scenario Simulation Engine ("What-If Analysis")
// =======================================================

import { ScenarioSimulationResult, FinancialAnalysisResult } from './types';

export class ScenarioSimulator {
  private static instance: ScenarioSimulator;

  private constructor() {}

  public static getInstance(): ScenarioSimulator {
    if (!ScenarioSimulator.instance) {
      ScenarioSimulator.instance = new ScenarioSimulator();
    }
    return ScenarioSimulator.instance;
  }

  /**
   * Runs "What-if Analysis" simulations across revenue and cost scenarios
   */
  public runScenarioSimulation(analysis: FinancialAnalysisResult, costReductionPct = 10, revenueGrowthPct = 5): ScenarioSimulationResult[] {
    const currentTurnover = analysis.turnover;
    const currentCost = analysis.cost;

    // Scenario 1: Cost Reduction Simulation (e.g. 10% cost cut)
    const simulatedCost1 = currentCost * (1 - costReductionPct / 100);
    const simulatedProfit1 = currentTurnover - simulatedCost1;
    const simulatedMargin1 = currentTurnover > 0 ? Number(((simulatedProfit1 / currentTurnover) * 100).toFixed(2)) : 0;

    // Scenario 2: Revenue Growth + Cost Optimization
    const simulatedTurnover2 = currentTurnover * (1 + revenueGrowthPct / 100);
    const simulatedCost2 = currentCost * (1 - costReductionPct / 100);
    const simulatedProfit2 = simulatedTurnover2 - simulatedCost2;
    const simulatedMargin2 = simulatedTurnover2 > 0 ? Number(((simulatedProfit2 / simulatedTurnover2) * 100).toFixed(2)) : 0;

    return [
      {
        scenarioName: `What-If: ${costReductionPct}% Operational Cost Reduction`,
        projectedTurnover: currentTurnover,
        projectedProfit: Math.round(simulatedProfit1),
        projectedMarginPct: simulatedMargin1,
        varianceFromBaseline: `+${(simulatedMargin1 - analysis.netMarginPct).toFixed(1)}% Net Margin Increase`,
      },
      {
        scenarioName: `What-If: ${revenueGrowthPct}% Revenue Growth + ${costReductionPct}% Cost Cut`,
        projectedTurnover: Math.round(simulatedTurnover2),
        projectedProfit: Math.round(simulatedProfit2),
        projectedMarginPct: simulatedMargin2,
        varianceFromBaseline: `+${(simulatedMargin2 - analysis.netMarginPct).toFixed(1)}% Net Margin Increase`,
      },
    ];
  }
}

export const scenarioSimulator = ScenarioSimulator.getInstance();
