// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 1: Enterprise Feature Store
// =======================================================

import { FeatureStoreRecord } from './types';

export class FeatureStore {
  private static instance: FeatureStore;
  private store: Map<string, FeatureStoreRecord> = new Map();

  private constructor() {}

  public static getInstance(): FeatureStore {
    if (!FeatureStore.instance) {
      FeatureStore.instance = new FeatureStore();
    }
    return FeatureStore.instance;
  }

  /**
   * Upserts feature vector into Feature Store for a tenant
   */
  public saveFeatures(tenantId: string, featuresMap: Map<string, number>): FeatureStoreRecord {
    const record: FeatureStoreRecord = {
      tenantId,
      features: featuresMap,
      lastUpdated: new Date().toISOString(),
    };
    this.store.set(tenantId, record);
    return record;
  }

  /**
   * Retrieves tenant feature vector from Feature Store
   */
  public getFeatures(tenantId: string): FeatureStoreRecord | undefined {
    return this.store.get(tenantId);
  }
}

export const featureStore = FeatureStore.getInstance();
