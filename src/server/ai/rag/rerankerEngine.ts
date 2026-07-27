// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 5: Cross-Encoder Reranker Engine
// =======================================================

import { RankedChunkResult } from './types';

export class RerankerEngine {
  private static instance: RerankerEngine;

  private constructor() {}

  public static getInstance(): RerankerEngine {
    if (!RerankerEngine.instance) {
      RerankerEngine.instance = new RerankerEngine();
    }
    return RerankerEngine.instance;
  }

  /**
   * Reranks candidate chunks and removes duplicate snippets
   */
  public rerankChunks(candidates: RankedChunkResult[], userRole: string): RankedChunkResult[] {
    const seenTexts = new Set<string>();
    const deduplicated: RankedChunkResult[] = [];

    for (const item of candidates) {
      const textSnippet = item.chunk.content.trim();
      if (seenTexts.has(textSnippet)) continue;
      seenTexts.add(textSnippet);

      // Role Boost: Executive users get higher score for SOPs & Investment reports
      let roleBoost = 1.0;
      if ((userRole === 'SUPER_ADMIN' || userRole === 'FINANCE_MANAGER') && item.document.businessCategory === 'SOP') {
        roleBoost = 1.15;
      }

      item.compositeRankScore = Number((item.compositeRankScore * roleBoost).toFixed(4));
      deduplicated.push(item);
    }

    deduplicated.sort((a, b) => b.compositeRankScore - a.compositeRankScore);
    return deduplicated;
  }
}

export const rerankerEngine = RerankerEngine.getInstance();
