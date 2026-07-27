// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 4: Hybrid Vector + BM25 Search Engine
// =======================================================

import { DocumentChunk, DocumentMetadata, HybridSearchQuery, RankedChunkResult } from './types';
import { embeddingGenerator } from './embeddingGenerator';

export class HybridSearchEngine {
  private static instance: HybridSearchEngine;
  private documentStore: Map<string, { metadata: DocumentMetadata; chunks: DocumentChunk[] }> = new Map();

  private constructor() {
    this.seedDefaultKnowledgeBase();
  }

  public static getInstance(): HybridSearchEngine {
    if (!HybridSearchEngine.instance) {
      HybridSearchEngine.instance = new HybridSearchEngine();
    }
    return HybridSearchEngine.instance;
  }

  /**
   * Adds an ingested document and its chunks to the store
   */
  public addDocument(metadata: DocumentMetadata, chunks: DocumentChunk[]): void {
    this.documentStore.set(metadata.documentId, { metadata, chunks });
  }

  /**
   * Executes Hybrid Search (Dense Vector Similarity + BM25 Keyword Search + Tenant & RBAC Filter)
   */
  public search(query: HybridSearchQuery): RankedChunkResult[] {
    const { tenantId, userRole, question, topK } = query;
    const queryVector = embeddingGenerator.generateEmbedding(question);
    const qTokens = question.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

    const candidates: RankedChunkResult[] = [];

    for (const docEntry of this.documentStore.values()) {
      const { metadata, chunks } = docEntry;

      // 1. Tenant Isolation Filter
      if (metadata.tenantId !== tenantId) continue;

      // 2. RBAC Security Guard: Payroll / Salary Restricted Chunks
      if (metadata.sensitivity === 'RESTRICTED_PAYROLL' && userRole !== 'SUPER_ADMIN' && userRole !== 'FINANCE_MANAGER') {
        continue;
      }

      for (const chunk of chunks) {
        const chunkVector = chunk.embedding || embeddingGenerator.generateEmbedding(chunk.content);

        // Vector Cosine Similarity
        let dotProduct = 0;
        for (let i = 0; i < queryVector.length; i++) {
          dotProduct += queryVector[i] * chunkVector[i];
        }
        const vectorSimilarity = Math.max(0.1, Number(dotProduct.toFixed(4)));

        // Keyword Overlap (BM25 surrogate)
        const contentLower = chunk.content.toLowerCase();
        let matches = 0;
        for (const token of qTokens) {
          if (contentLower.includes(token)) matches++;
        }
        const keywordScore = qTokens.length > 0 ? Number((matches / qTokens.length).toFixed(4)) : 0.5;

        // Composite Rank Score
        const compositeRankScore = Number((vectorSimilarity * 0.5 + keywordScore * 0.3 + chunk.importanceScore * 0.2).toFixed(4));

        candidates.push({
          chunk,
          document: metadata,
          vectorSimilarity,
          keywordScore,
          compositeRankScore,
        });
      }
    }

    candidates.sort((a, b) => b.compositeRankScore - a.compositeRankScore);
    return candidates.slice(0, topK || 5);
  }

  /**
   * Seed default enterprise financial SOPs & reports
   */
  private seedDefaultKnowledgeBase(): void {
    const docId = 'doc_org_sop_01';
    const metadata: DocumentMetadata = {
      documentId: docId,
      tenantId: 'default-org',
      title: 'FinTrack Enterprise Financial Policy & Operating Guidelines',
      department: 'Finance',
      author: 'Chief Financial Officer',
      fileType: 'PDF',
      fiscalYear: 'FY2026',
      currency: 'INR',
      businessCategory: 'SOP',
      sensitivity: 'INTERNAL',
      keywords: ['policy', 'margin', 'cost', 'turnover'],
      summary: 'Standard corporate guidelines for target net profit margins (15%) and operating cost ratios.',
      createdAt: new Date().toISOString(),
    };

    const chunks: DocumentChunk[] = [
      {
        chunkId: 'chunk_sop_1',
        documentId: docId,
        tenantId: 'default-org',
        content: 'Enterprise Operating Policy: Target net profit margin is strictly set to 15% across all operational departments. When total cost exceeds 70% of gross turnover, executive audit procedures are initiated.',
        pageNumber: 1,
        sectionName: 'Financial Policy Guidelines',
        importanceScore: 0.98,
        tokenCount: 45,
        createdAt: new Date().toISOString(),
      },
      {
        chunkId: 'chunk_sop_2',
        documentId: docId,
        tenantId: 'default-org',
        content: 'Razorpay Payment & Ledger Settlement Protocol: All captured transactions must be verified via HMAC SHA256 signature verification before updating general ledger balance records.',
        pageNumber: 2,
        sectionName: 'Payment Gateway Protocol',
        importanceScore: 0.95,
        tokenCount: 42,
        createdAt: new Date().toISOString(),
      },
    ];

    this.addDocument(metadata, chunks);
  }
}

export const hybridSearchEngine = HybridSearchEngine.getInstance();
