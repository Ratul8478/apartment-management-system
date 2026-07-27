// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 3: Unified Conversation Intelligence Engine Facade
// =======================================================

import { intentDetector } from './intentDetector';
import { entityExtractor } from './entityExtractor';
import { sentimentAnalyzer } from './sentimentAnalyzer';
import { languageDetector } from './languageDetector';
import { taskExtractor } from './taskExtractor';
import { domainClassifier } from './domainClassifier';
import { StructuredConversationContext } from './types';

export class ConversationIntelligenceEngine {
  private static instance: ConversationIntelligenceEngine;

  private constructor() {}

  public static getInstance(): ConversationIntelligenceEngine {
    if (!ConversationIntelligenceEngine.instance) {
      ConversationIntelligenceEngine.instance = new ConversationIntelligenceEngine();
    }
    return ConversationIntelligenceEngine.instance;
  }

  /**
   * Transforms raw unstructured human language into structured enterprise business context
   */
  public analyzeConversation(params: {
    tenantId: string;
    userId: string;
    userRole: string;
    question: string;
    sessionId?: string;
  }): StructuredConversationContext {
    const { tenantId, userId, userRole, question, sessionId } = params;
    const conversationId = sessionId || `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // 1. Detect Business Intent
    const { intent, confidence: intentConfidence } = intentDetector.detectIntent(question);

    // 2. Classify Corporate Domain
    const domain = domainClassifier.classifyDomain(question);

    // 3. Extract Financial Entities & Metrics
    const { entities, metrics } = entityExtractor.extractEntities(question);

    // 4. Analyze Tone, Urgency & Preferred Style
    const { sentiment, urgency, style } = sentimentAnalyzer.analyzeToneAndStyle(question, userRole);

    // 5. Detect Language & Corporate Register
    const language = languageDetector.detectLanguage(question);

    // 6. Extract Tasks & Action Items
    const { tasks, actionItems } = taskExtractor.extractTasksAndActions(question, urgency);

    // 7. Check for missing information
    const missingInformation: string[] = [];
    if (intent === 'PROFIT_FORECAST' && !metrics.currency) {
      missingInformation.push('Currency specification (Defaulting to INR)');
    }

    // 8. Recommend AI Modules & Workflow Routing
    const recommendedAiModules: string[] = ['AI_GATEWAY', 'CONTEXT_BUILDER', 'MEMORY_ENGINE', 'REASONING_ENGINE'];
    if (intent === 'PROFIT_FORECAST' || intent === 'CASH_FLOW') {
      recommendedAiModules.push('FORECASTING_ENGINE');
    }
    if (intent === 'GENERATE_PPT' || intent === 'DATA_VISUALIZATION') {
      recommendedAiModules.push('PRESENTATION_ENGINE', 'VISUALIZATION_ENGINE');
    }

    return {
      conversationId,
      tenantId,
      userId,
      userRole,
      rawQuestion: question,
      intent,
      domain,
      topic: `${domain} - ${intent}`,
      subtopic: question.slice(0, 40),
      entities,
      financialMetrics: metrics,
      tasks,
      actionItems,
      sentiment,
      urgency,
      communicationStyle: style,
      language,
      confidenceScore: intentConfidence,
      missingInformation,
      suggestedWorkflow: `Execute ${intent} reasoning via ${recommendedAiModules.join(' -> ')}`,
      recommendedAiModules,
    };
  }
}

export const conversationIntelligenceEngine = ConversationIntelligenceEngine.getInstance();
