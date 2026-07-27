// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 6: Enterprise Model Registry
// =======================================================

import { ModelArtifact, ForecastTarget } from './types';

export class ModelRegistry {
  private static instance: ModelRegistry;
  private registry: Map<string, ModelArtifact> = new Map();

  private constructor() {
    this.seedDefaultModels();
  }

  public static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  /**
   * Retrieves active production model for target
   */
  public getActiveModel(target: ForecastTarget): ModelArtifact {
    for (const model of this.registry.values()) {
      if (model.target === target && model.isProductionReady) {
        return model;
      }
    }
    return Array.from(this.registry.values())[0];
  }

  /**
   * Seed default production models into registry
   */
  private seedDefaultModels(): void {
    const revModel: ModelArtifact = {
      modelId: 'mdl_rev_ensemble_v2',
      modelName: 'Revenue Temporal Fusion Forecast Engine',
      target: 'REVENUE',
      version: 'v2.4.0',
      algorithm: 'TEMPORAL_ENSEMBLE',
      mae: 4200.5,
      rmse: 5800.2,
      mape: 3.8, // 3.8% Mean Absolute Percentage Error
      approvalStatus: 'APPROVED',
      isProductionReady: true,
      trainedAt: new Date().toISOString(),
    };

    this.registry.set(revModel.modelId, revModel);
  }
}

export const modelRegistry = ModelRegistry.getInstance();
