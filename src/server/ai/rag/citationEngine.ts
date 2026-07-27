// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 6: Citation Generation Engine
// =======================================================

import { RankedChunkResult, CitationRecord } from './types';

export class CitationEngine {
  private static instance: CitationEngine;

  private constructor() {}

  public static getInstance(): CitationEngine {
    if (!CitationEngine.instance) {
      CitationEngine.instance = new CitationEngine();
    }
    return CitationEngine.instance;
  }

  /**
   * Generates exact citation records for retrieved chunks
   */
  public generateCitations(chunks: RankedChunkResult[]): CitationRecord[] {
    return chunks.map((item, idx) => ({
      citationId: `cite_${idx + 1}_${item.document.documentId}`,
      documentTitle: item.document.title,
      fileType: item.document.fileType,
      pageNumber: item.chunk.pageNumber || 1,
      sectionName: item.chunk.sectionName || 'General Section',
      confidenceScore: item.compositeRankScore,
      excerptSnippet: item.chunk.content.slice(0, 150) + '...',
    }));
  }
}

export const citationEngine = CitationEngine.getInstance();
