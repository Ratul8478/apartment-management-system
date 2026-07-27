// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 2: Feature Engineering Engine
// =======================================================

import { featureStore } from './featureStore';

export class FeatureEngine {
  private static instance: FeatureEngine;

  private constructor() {}

  public static getInstance(): FeatureEngine {
    if (!FeatureEngine.instance) {
      FeatureEngine.instance = new FeatureEngine();
    }
    return FeatureEngine.instance;
  }

  /**
   * Engineers reusable feature vector and saves to Feature Store
   */
  public computeFeatures(tenantId: string, metrics: { turnover: number; profitLoss: number; cost: number }): Map<string, number> {
    const turnover = metrics.turnover || 0;
    const profitLoss = metrics.profitLoss || 0;
    const cost = metrics.cost || 0;

    const netMarginPct = turnover > 0 ? (profitLoss / turnover) * 100 : 0;
    const costToTurnoverRatio = turnover > 0 ? (cost / turnover) * 100 : 0;
    const revenueVelocity30d = turnover * 0.08; // 8% monthly growth velocity baseline
    const cashFlowStabilityIndex = netMarginPct >= 15 ? 0.95 : 0.72;

    const featuresMap = new Map<string, number>([
      ['turnover', turnover],
      ['profitLoss', profitLoss],
      ['cost', cost],
      ['netMarginPct', Number(netMarginPct.toFixed(2))],
      ['costToTurnoverRatio', Number(costToTurnoverRatio.toFixed(2))],
      ['revenueVelocity30d', Number(revenueVelocity30d.toFixed(2))],
      ['cashFlowStabilityIndex', cashFlowStabilityIndex],
    ]);

    featureStore.saveFeatures(tenantId, featuresMap);
    return featuresMap;
  }
}

export const featureEngine = FeatureEngine.getInstance();
