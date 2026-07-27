// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 8: Master Unified Enterprise Forecast Engine
// =======================================================

import { featureEngine } from './featureEngine';
import { timeSeriesModels } from './timeSeriesModels';
import { anomalyDetector } from './anomalyDetector';
import { modelRegistry } from './modelRegistry';
import { forecastExplainability } from './forecastExplainability';
import { ForecastTarget, ForecastHorizon, ExplainableForecastPackage } from './types';

export class EnterpriseForecastEngine {
  private static instance: EnterpriseForecastEngine;

  private constructor() {}

  public static getInstance(): EnterpriseForecastEngine {
    if (!EnterpriseForecastEngine.instance) {
      EnterpriseForecastEngine.instance = new EnterpriseForecastEngine();
    }
    return EnterpriseForecastEngine.instance;
  }

  /**
   * Executes full Enterprise Forecasting & Predictive Intelligence Pipeline:
   * 1. Compute & Save Feature Vector to Feature Store
   * 2. Retrieve Production Model from Model Registry
   * 3. Run Quantitative Time-Series Ensemble Forecast
   * 4. Execute Anomaly Detection
   * 5. Generate Explainability Package with Feature Drivers & Limitations
   */
  public runPredictivePipeline(params: {
    tenantId: string;
    target: ForecastTarget;
    horizon: ForecastHorizon;
    metrics: { turnover: number; profitLoss: number; cost: number };
  }): ExplainableForecastPackage {
    const { tenantId, target, horizon, metrics } = params;

    // 1. Feature Engineering
    featureEngine.computeFeatures(tenantId, metrics);

    // 2. Retrieve Model Artifact
    const model = modelRegistry.getActiveModel(target);

    // 3. Select baseline value based on target
    let baselineValue = metrics.turnover;
    if (target === 'PROFIT') baselineValue = metrics.profitLoss;
    if (target === 'EXPENSE') baselineValue = metrics.cost;

    // 4. Run Quantitative Forecast
    const forecast = timeSeriesModels.generateForecast({
      tenantId,
      target,
      horizon,
      baselineValue,
    });

    // 5. Run Anomaly Detection
    const anomalies = anomalyDetector.detectAnomalies(tenantId, metrics);

    // 6. Generate Explainable Package
    return forecastExplainability.generateExplainablePackage(forecast, anomalies);
  }
}

export const enterpriseForecastEngine = EnterpriseForecastEngine.getInstance();
