// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 4: Anomaly Detection Engine
// =======================================================

import { AnomalyAlert } from './types';

export class AnomalyDetector {
  private static instance: AnomalyDetector;

  private constructor() {}

  public static getInstance(): AnomalyDetector {
    if (!AnomalyDetector.instance) {
      AnomalyDetector.instance = new AnomalyDetector();
    }
    return AnomalyDetector.instance;
  }

  /**
   * Detects financial anomalies, expense spikes, revenue drops, and budget overruns
   */
  public detectAnomalies(tenantId: string, metrics: { turnover: number; profitLoss: number; cost: number }): AnomalyAlert[] {
    const alerts: AnomalyAlert[] = [];
    const { turnover, cost } = metrics;

    // Anomaly Rule 1: Operating Cost Spikes (> 70% of Turnover)
    if (turnover > 0 && cost > turnover * 0.7) {
      const deviationPct = Number((((cost - turnover * 0.7) / (turnover * 0.7)) * 100).toFixed(1));
      alerts.push({
        alertId: `alert_${Date.now()}_cost`,
        tenantId,
        anomalyType: 'EXPENSE_SPIKE',
        severity: 'HIGH',
        metricName: 'Operating Expense Ratio',
        observedValue: cost,
        expectedValue: Math.round(turnover * 0.7),
        deviationPct,
        confidenceScore: 0.96,
        explanation: `Operating cost ₹${cost.toLocaleString()} exceeds 70% threshold by ${deviationPct}%.`,
        createdAt: new Date().toISOString(),
      });
    }

    // Anomaly Rule 2: Negative Net Profit / Margin Drop
    if (metrics.profitLoss < 0) {
      alerts.push({
        alertId: `alert_${Date.now()}_loss`,
        tenantId,
        anomalyType: 'REVENUE_DROP',
        severity: 'CRITICAL',
        metricName: 'Net Profit Loss',
        observedValue: metrics.profitLoss,
        expectedValue: Math.round(turnover * 0.15),
        deviationPct: 100.0,
        confidenceScore: 0.99,
        explanation: 'Net profit has entered negative loss territory.',
        createdAt: new Date().toISOString(),
      });
    }

    return alerts;
  }
}

export const anomalyDetector = AnomalyDetector.getInstance();
