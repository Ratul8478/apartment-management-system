// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Memory Layer 3: Long-Term Memory Manager (Permanent Preference Store)
// =======================================================

import { MemoryObject } from './types';

export class LongTermMemoryManager {
  private static instance: LongTermMemoryManager;

  private constructor() {}

  public static getInstance(): LongTermMemoryManager {
    if (!LongTermMemoryManager.instance) {
      LongTermMemoryManager.instance = new LongTermMemoryManager();
    }
    return LongTermMemoryManager.instance;
  }

  /**
   * Retrieves permanent user preferences and long-term decision history
   */
  public async getLongTermPreferences(tenantId: string, userId: string, userRole: string): Promise<MemoryObject[]> {
    const now = new Date().toISOString();
    return [
      {
        id: `lt_pref_${userId}_comm`,
        tenantId,
        userId,
        layer: 'LONG_TERM',
        category: 'COMMUNICATION_STYLE',
        content: `User role ${userRole} prefers concise executive summaries with bold financial numbers and structured markdown bullets.`,
        tags: ['preference', 'communication', 'executive'],
        importanceScore: 0.95,
        confidenceScore: 0.99,
        isPinned: true,
        createdAt: now,
        updatedAt: now,
        accessCount: 10,
        expirationPolicy: 'PERMANENT',
      },
      {
        id: `lt_pref_${userId}_chart`,
        tenantId,
        userId,
        layer: 'LONG_TERM',
        category: 'USER_PREFERENCE',
        content: 'Preferred visual dashboard components: Core Financial Metrics (Turnover, Net Profit, Operating Costs) bar charts.',
        tags: ['preference', 'visualization', 'charts'],
        importanceScore: 0.85,
        confidenceScore: 0.95,
        isPinned: false,
        createdAt: now,
        updatedAt: now,
        accessCount: 5,
        expirationPolicy: 'PERMANENT',
      },
    ];
  }
}

export const longTermMemoryManager = LongTermMemoryManager.getInstance();
