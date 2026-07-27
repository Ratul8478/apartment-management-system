// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 4: Memory Engine (Short/Long/Organizational Memory Manager)
// =======================================================

import { prisma } from '@/lib/prisma';
import { TenantIdentity, AIMemoryRecord } from './types';
import { enterpriseMemoryEngine } from '../memory/enterpriseMemoryEngine';

export class MemoryEngine {
  private static instance: MemoryEngine;

  private constructor() {}

  public static getInstance(): MemoryEngine {
    if (!MemoryEngine.instance) {
      MemoryEngine.instance = new MemoryEngine();
    }
    return MemoryEngine.instance;
  }

  /**
   * Retrieves tenant AI memory profile and ranks relevant multi-layer memories
   */
  public async getTenantMemory(tenant: TenantIdentity, question?: string): Promise<AIMemoryRecord & { memoryPromptContext?: string }> {
    try {
      const recentLogs = await prisma.aiChatLog.findMany({
        where: { userId: tenant.userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      const conversationHistory = recentLogs.reverse().flatMap((log) => [
        { role: 'user' as const, message: log.question || log.userQuery || '', timestamp: log.createdAt.toISOString() },
        { role: 'assistant' as const, message: log.answer || log.aiResponse || '', timestamp: log.createdAt.toISOString() },
      ]);

      // Execute multi-layer retrieval & vector ranking if question is provided
      let memoryPromptContext = '';
      if (question) {
        const memoryRes = await enterpriseMemoryEngine.retrieveAndRankRelevantContext({
          tenantId: tenant.organizationId,
          userId: tenant.userId,
          userRole: tenant.userRole,
          question,
        });
        memoryPromptContext = memoryRes.formattedContextString;
      }

      return {
        tenantId: tenant.organizationId,
        userId: tenant.userId,
        conversationHistory,
        memoryPromptContext,
        userPreferences: {
          communicationStyle: 'EXECUTIVE_SUMMARY',
          frequentlyQueriedMetrics: ['TURNOVER', 'PROFIT_MARGIN', 'COST_RATIO'],
          riskTolerance: 'CONSERVATIVE',
        },
        lastActiveTimestamp: new Date().toISOString(),
      };
    } catch {
      return {
        tenantId: tenant.organizationId,
        userId: tenant.userId,
        conversationHistory: [],
        userPreferences: {
          communicationStyle: 'EXECUTIVE_SUMMARY',
          frequentlyQueriedMetrics: ['TURNOVER'],
          riskTolerance: 'CONSERVATIVE',
        },
        lastActiveTimestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Updates tenant memory with recent interaction
   */
  public async recordInteraction(tenant: TenantIdentity, question: string, answer: string): Promise<void> {
    try {
      await prisma.aiChatLog.create({
        data: {
          userId: tenant.userId,
          question,
          answer,
          userQuery: question,
          aiResponse: answer,
          modelUsed: 'blackbox-gemini-pro',
        },
      });
    } catch (err) {
      console.warn('Memory update notice:', err);
    }
  }
}

export const memoryEngine = MemoryEngine.getInstance();
