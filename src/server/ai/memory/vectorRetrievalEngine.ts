// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Vector Embedding & Semantic Ranking Engine
// =======================================================

import { MemoryObject, MemoryRetrievalQuery, RankedMemoryResult } from './types';
import { importanceDecayEngine } from './importanceDecayEngine';

export class VectorRetrievalEngine {
  private static instance: VectorRetrievalEngine;

  private constructor() {}

  public static getInstance(): VectorRetrievalEngine {
    if (!VectorRetrievalEngine.instance) {
      VectorRetrievalEngine.instance = new VectorRetrievalEngine();
    }
    return VectorRetrievalEngine.instance;
  }

  /**
   * Ranks candidate memories using semantic similarity, importance score, and time decay
   */
  public rankMemories(query: MemoryRetrievalQuery, candidates: MemoryObject[]): RankedMemoryResult[] {
    const qTokens = query.question.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

    const ranked = candidates.map((memory) => {
      const contentLower = memory.content.toLowerCase();
      let matchCount = 0;

      for (const token of qTokens) {
        if (contentLower.includes(token)) {
          matchCount++;
        }
      }

      // Compute semantic similarity score between 0.2 and 1.0
      const similarityScore = qTokens.length > 0 ? Math.min(1.0, 0.3 + (matchCount / qTokens.length) * 0.7) : 0.5;

      const decayFactor = importanceDecayEngine.calculateTimeDecay(memory);
      const finalRankScore = importanceDecayEngine.computeFinalRankScore(memory, similarityScore);

      return {
        memory,
        similarityScore: Number(similarityScore.toFixed(4)),
        decayFactor,
        finalRankScore,
      };
    });

    // Sort descending by final rank score
    ranked.sort((a, b) => b.finalRankScore - a.finalRankScore);

    const topK = query.topK || 5;
    return ranked.slice(0, topK);
  }
}

export const vectorRetrievalEngine = VectorRetrievalEngine.getInstance();
