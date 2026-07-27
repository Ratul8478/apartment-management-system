// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Memory Layer 2: Short-Term Memory Manager (30-Day Conversation Buffer)
// =======================================================

import { MemoryObject } from './types';
import { prisma } from '@/lib/prisma';

export class ShortTermMemoryManager {
  private static instance: ShortTermMemoryManager;

  private constructor() {}

  public static getInstance(): ShortTermMemoryManager {
    if (!ShortTermMemoryManager.instance) {
      ShortTermMemoryManager.instance = new ShortTermMemoryManager();
    }
    return ShortTermMemoryManager.instance;
  }

  /**
   * Retrieves short-term memory objects for the tenant user (Last 30 days)
   */
  public async getRecentMemories(tenantId: string, userId: string): Promise<MemoryObject[]> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const logs = await prisma.aiChatLog.findMany({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
        take: 50,
        orderBy: { createdAt: 'desc' },
      });

      return logs.map((log) => ({
        id: log.id,
        tenantId,
        userId,
        layer: 'SHORT_TERM',
        category: 'CONVERSATION_FACT',
        content: `Q: ${log.question || log.userQuery}\nA: ${log.answer || log.aiResponse}`,
        tags: ['conversation', 'recent'],
        importanceScore: 0.6,
        confidenceScore: 0.95,
        isPinned: false,
        createdAt: log.createdAt.toISOString(),
        updatedAt: log.createdAt.toISOString(),
        accessCount: 1,
        expirationPolicy: 'TTL_30_DAYS',
      }));
    } catch {
      return [];
    }
  }
}

export const shortTermMemoryManager = ShortTermMemoryManager.getInstance();
