// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Black Box Master AI Orchestrator
// =======================================================

import { aiOperatingSystem } from '../orchestrator/aiOperatingSystem';
import { AIExecutionRequest, AIExecutionResponse } from './types';

export class BlackBoxAIOrchestrator {
  private static instance: BlackBoxAIOrchestrator;

  private constructor() {}

  public static getInstance(): BlackBoxAIOrchestrator {
    if (!BlackBoxAIOrchestrator.instance) {
      BlackBoxAIOrchestrator.instance = new BlackBoxAIOrchestrator();
    }
    return BlackBoxAIOrchestrator.instance;
  }

  /**
   * Delegates workflow execution directly to the Enterprise AI Operating System
   */
  public async processRequest(request: AIExecutionRequest): Promise<AIExecutionResponse> {
    return aiOperatingSystem.executeWorkflow(request);
  }
}

export const blackBoxAIOrchestrator = BlackBoxAIOrchestrator.getInstance();
