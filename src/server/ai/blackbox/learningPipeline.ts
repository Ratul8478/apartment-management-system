// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 6: Learning Pipeline & Self-Improvement Engine
// =======================================================

import { TenantIdentity, AIExecutionResponse } from './types';
import { prisma } from '@/lib/prisma';

export class LearningPipeline {
  private static instance: LearningPipeline;

  private constructor() {}

  public static getInstance(): LearningPipeline {
    if (!LearningPipeline.instance) {
      LearningPipeline.instance = new LearningPipeline();
    }
    return LearningPipeline.instance;
  }

  /**
   * Asynchronously queues a learning event to continuously optimize retrieval and prompt preferences
   */
  public async queueLearningEvent(tenant: TenantIdentity, question: string, response: AIExecutionResponse): Promise<void> {
    try {
      // Record analytics product event for self-improvement telemetry
      await prisma.productAnalyticsEvent.create({
        data: {
          organizationId: tenant.organizationId,
          userId: tenant.userId,
          eventType: 'AI_REASONING_COMPLETED',
          featureKey: 'blackbox_ai_brain',
          metadata: {
            questionLength: question.length,
            confidenceScore: response.confidenceScore,
            executionTimeMs: response.executionTimeMs,
            provider: response.provider,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (err) {
      console.warn('Learning pipeline event notice:', err);
    }
  }
}

export const learningPipeline = LearningPipeline.getInstance();
