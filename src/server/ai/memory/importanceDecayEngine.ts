// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Importance Scoring & Exponential Time-Decay Engine
// =======================================================

import { MemoryObject } from './types';

export class ImportanceDecayEngine {
  private static instance: ImportanceDecayEngine;
  private readonly HALF_LIFE_DAYS = 14; // Memories lose half priority every 14 days unless accessed/pinned

  private constructor() {}

  public static getInstance(): ImportanceDecayEngine {
    if (!ImportanceDecayEngine.instance) {
      ImportanceDecayEngine.instance = new ImportanceDecayEngine();
    }
    return ImportanceDecayEngine.instance;
  }

  /**
   * Calculates exponential time decay factor for a memory object (0.0 to 1.0)
   */
  public calculateTimeDecay(memory: MemoryObject): number {
    // Pinned memories never decay
    if (memory.isPinned) {
      return 1.0;
    }

    const createdTime = new Date(memory.createdAt).getTime();
    const ageInDays = (Date.now() - createdTime) / (1000 * 60 * 60 * 24);

    // Half-life formula: decay = e ^ (-lambda * age_in_days)
    const lambda = Math.log(2) / this.HALF_LIFE_DAYS;
    const decay = Math.exp(-lambda * ageInDays);

    return Math.max(0.1, Number(decay.toFixed(4)));
  }

  /**
   * Calculates final composite retrieval score for a memory object
   */
  public computeFinalRankScore(memory: MemoryObject, semanticSimilarity: number): number {
    const decayFactor = this.calculateTimeDecay(memory);
    const importanceWeight = 0.4;
    const similarityWeight = 0.4;
    const decayWeight = 0.2;

    const rankScore =
      memory.importanceScore * importanceWeight +
      semanticSimilarity * similarityWeight +
      decayFactor * decayWeight;

    return Number(rankScore.toFixed(4));
  }
}

export const importanceDecayEngine = ImportanceDecayEngine.getInstance();
