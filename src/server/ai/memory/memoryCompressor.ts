// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Memory Compression & Automatic Summarization Engine
// =======================================================

import { MemoryObject } from './types';

export class MemoryCompressor {
  private static instance: MemoryCompressor;

  private constructor() {}

  public static getInstance(): MemoryCompressor {
    if (!MemoryCompressor.instance) {
      MemoryCompressor.instance = new MemoryCompressor();
    }
    return MemoryCompressor.instance;
  }

  /**
   * Compresses raw conversation histories into structured executive summaries
   */
  public compressConversations(tenantId: string, userId: string, rawLogs: { question: string; answer: string }[]): MemoryObject {
    const summaryText = rawLogs
      .map((l) => `Query: ${l.question}\nKey Finding: ${l.answer.slice(0, 150)}...`)
      .join('\n\n');

    return {
      id: `compressed_conv_${userId}_${Date.now()}`,
      tenantId,
      userId,
      layer: 'SHORT_TERM',
      category: 'EXECUTIVE_SUMMARY',
      content: `Structured Conversation Summary (${rawLogs.length} interactions):\n${summaryText}`,
      tags: ['compressed', 'summary', 'analytics'],
      importanceScore: 0.85,
      confidenceScore: 0.95,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accessCount: 1,
      expirationPolicy: 'TTL_30_DAYS',
    };
  }
}

export const memoryCompressor = MemoryCompressor.getInstance();
