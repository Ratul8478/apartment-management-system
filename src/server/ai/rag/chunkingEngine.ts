// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 2: Table-Safe Intelligent Chunking Engine
// =======================================================

import { DocumentChunk, DocumentMetadata } from './types';

export class ChunkingEngine {
  private static instance: ChunkingEngine;
  private readonly TARGET_CHUNK_TOKENS = 600; // ~600 words/tokens
  private readonly OVERLAP_TOKENS = 80;

  private constructor() {}

  public static getInstance(): ChunkingEngine {
    if (!ChunkingEngine.instance) {
      ChunkingEngine.instance = new ChunkingEngine();
    }
    return ChunkingEngine.instance;
  }

  /**
   * Generates intelligent chunks without splitting tables or financial blocks
   */
  public generateChunks(metadata: DocumentMetadata, fullContent: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const paragraphs = fullContent.split(/\n\n+/);
    let currentChunkText = '';
    let currentTokenCount = 0;
    let pageNum = 1;

    for (const para of paragraphs) {
      const paraTokenCount = para.split(/\s+/).length;

      // Table / Financial block protection: keep table rows intact
      const isTableBlock = para.includes('|') || para.includes('₹') || para.includes('INR') || para.includes('Total');

      if (currentTokenCount + paraTokenCount > this.TARGET_CHUNK_TOKENS && !isTableBlock) {
        // Emit chunk
        chunks.push({
          chunkId: `chunk_${metadata.documentId}_${chunks.length + 1}`,
          documentId: metadata.documentId,
          tenantId: metadata.tenantId,
          content: currentChunkText.trim(),
          pageNumber: pageNum,
          sectionName: `Section ${chunks.length + 1}`,
          importanceScore: isTableBlock ? 0.95 : 0.75,
          tokenCount: currentTokenCount,
          createdAt: new Date().toISOString(),
        });

        // Compute overlap
        const words = currentChunkText.trim().split(/\s+/);
        const overlapText = words.slice(-this.OVERLAP_TOKENS).join(' ');
        currentChunkText = overlapText + '\n\n' + para;
        currentTokenCount = overlapText.split(/\s+/).length + paraTokenCount;
        pageNum++;
      } else {
        currentChunkText += (currentChunkText ? '\n\n' : '') + para;
        currentTokenCount += paraTokenCount;
      }
    }

    if (currentChunkText.trim()) {
      chunks.push({
        chunkId: `chunk_${metadata.documentId}_${chunks.length + 1}`,
        documentId: metadata.documentId,
        tenantId: metadata.tenantId,
        content: currentChunkText.trim(),
        pageNumber: pageNum,
        sectionName: `Section ${chunks.length + 1}`,
        importanceScore: 0.8,
        tokenCount: currentTokenCount,
        createdAt: new Date().toISOString(),
      });
    }

    return chunks;
  }
}

export const chunkingEngine = ChunkingEngine.getInstance();
