// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 6: Master Unified Enterprise RAG Engine Facade
// =======================================================

import { metadataExtractor } from './metadataExtractor';
import { chunkingEngine } from './chunkingEngine';
import { embeddingGenerator } from './embeddingGenerator';
import { hybridSearchEngine } from './hybridSearchEngine';
import { rerankerEngine } from './rerankerEngine';
import { citationEngine } from './citationEngine';
import { HybridSearchQuery, RAGContextPackage, DocumentMetadata } from './types';

export class EnterpriseRagEngine {
  private static instance: EnterpriseRagEngine;

  private constructor() {}

  public static getInstance(): EnterpriseRagEngine {
    if (!EnterpriseRagEngine.instance) {
      EnterpriseRagEngine.instance = new EnterpriseRagEngine();
    }
    return EnterpriseRagEngine.instance;
  }

  /**
   * Ingests a new enterprise document into the RAG system
   */
  public ingestDocument(params: {
    tenantId: string;
    filename: string;
    content: string;
    department?: string;
  }): DocumentMetadata {
    const metadata = metadataExtractor.extractMetadata(params);
    const rawChunks = chunkingEngine.generateChunks(metadata, params.content);

    // Compute dense vector embeddings for each chunk
    const chunksWithEmbeddings = rawChunks.map((chunk) => ({
      ...chunk,
      embedding: embeddingGenerator.generateEmbedding(chunk.content),
    }));

    hybridSearchEngine.addDocument(metadata, chunksWithEmbeddings);
    return metadata;
  }

  /**
   * Executes full RAG Pipeline: Hybrid Search ➔ Rerank ➔ Format Prompt Context ➔ Generate Citations
   */
  public retrieveKnowledge(query: HybridSearchQuery): RAGContextPackage {
    // 1. Hybrid Vector + BM25 Search
    const searchResults = hybridSearchEngine.search(query);

    // 2. Cross-Encoder Rerank & Deduplication
    const reranked = rerankerEngine.rerankChunks(searchResults, query.userRole);

    // 3. Check evidence sufficiency
    const hasSufficientEvidence = reranked.length > 0 && reranked[0].compositeRankScore > 0.3;

    // 4. Format RAG Context String
    const formattedRAGContext = reranked
      .map(
        (item, idx) =>
          `[RAG Source #${idx + 1}: ${item.document.title} | Page ${item.chunk.pageNumber || 1} | Category: ${item.document.businessCategory} | Confidence: ${item.compositeRankScore}]\n${item.chunk.content}`
      )
      .join('\n\n');

    // 5. Generate Citations
    const citations = citationEngine.generateCitations(reranked);

    return {
      retrievedChunks: reranked,
      formattedRAGContext,
      citations,
      hasSufficientEvidence,
    };
  }
}

export const enterpriseRagEngine = EnterpriseRagEngine.getInstance();
