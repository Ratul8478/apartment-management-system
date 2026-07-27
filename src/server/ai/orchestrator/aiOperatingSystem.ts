// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 9: Enterprise AI Operating System Master Orchestrator
// =======================================================

import { aiGateway } from '../blackbox/aiGateway';
import { contextBuilderEngine } from '../blackbox/contextBuilder';
import { plannerEngine } from '../blackbox/plannerEngine';
import { memoryEngine } from '../blackbox/memoryEngine';
import { reasoningEngine } from '../blackbox/reasoningEngine';
import { learningPipeline } from '../blackbox/learningPipeline';
import { conversationIntelligenceEngine } from '../conversation/conversationIntelligenceEngine';
import { enterprisePersonalizationEngine } from '../personalization/enterprisePersonalizationEngine';
import { enterpriseRagEngine } from '../rag/enterpriseRagEngine';
import { enterpriseRecommendationEngine } from '../recommendation/enterpriseRecommendationEngine';
import { enterpriseForecastEngine } from '../forecast/enterpriseForecastEngine';
import { governanceEngine } from '../governance/governanceEngine';
import { faultToleranceEngine } from './faultToleranceEngine';
import { dagExecutionPlanner } from './dagExecutionPlanner';
import { serviceCoordinator } from './serviceCoordinator';
import { AIExecutionRequest, AIExecutionResponse, FilteredFinancialContext } from '../blackbox/types';

export class AIOperatingSystem {
  private static instance: AIOperatingSystem;

  private constructor() {}

  public static getInstance(): AIOperatingSystem {
    if (!AIOperatingSystem.instance) {
      AIOperatingSystem.instance = new AIOperatingSystem();
    }
    return AIOperatingSystem.instance;
  }

  /**
   * Master Executive Workflow Lifecycle Orchestrator
   */
  public async executeWorkflow(request: AIExecutionRequest): Promise<AIExecutionResponse> {
    const startTime = Date.now();
    const { tenant, question } = request;

    // 1. Authenticate & Validate Security Context (AI Gateway)
    const securityCheck = aiGateway.validateSecurityContext(tenant, question);
    if (!securityCheck.isAuthorized) {
      return {
        answer: securityCheck.rejectionReason || 'Security Policy: Access restricted.',
        provider: 'AI Gateway Security Guard',
        confidenceScore: 1.0,
        isEstimate: false,
        executionTimeMs: Date.now() - startTime,
      };
    }

    // 2. Generate Dynamic DAG Execution Graph
    const dag = dagExecutionPlanner.generateDAG(question);
    serviceCoordinator.emitEvent('DAG_PLANNED', dag);

    // 3. Conversation Intelligence Parsing
    const convContext = conversationIntelligenceEngine.analyzeConversation({
      tenantId: tenant.organizationId,
      userId: tenant.userId,
      userRole: tenant.userRole,
      question,
      sessionId: request.sessionId,
    });

    const fallbackContext: FilteredFinancialContext = {
      turnover: 0,
      profitLoss: 0,
      cost: 0,
      netMarginPct: 0,
      totalRecordsCount: 0,
      recentTransactions: [],
      sharePriceBenchmarks: [],
    };

    // 4. Execute Subsystems in Parallel via Fault-Tolerance Circuit Breakers
    const [memoryRes, personalizationRes, ragRes, contextRes] = await Promise.all([
      faultToleranceEngine.executeWithFaultTolerance('MemoryEngine', async () => memoryEngine.getTenantMemory(tenant, question), () => undefined),
      faultToleranceEngine.executeWithFaultTolerance('PersonalizationEngine', async () => enterprisePersonalizationEngine.personalizeRequest({ userId: tenant.userId, tenantId: tenant.organizationId, role: tenant.userRole, question }), () => undefined),
      faultToleranceEngine.executeWithFaultTolerance('RAGEngine', async () => enterpriseRagEngine.retrieveKnowledge({ tenantId: tenant.organizationId, userId: tenant.userId, userRole: tenant.userRole, question }), () => ({ citations: [], retrievedChunks: [], formattedRAGContext: '', hasSufficientEvidence: false })),
      faultToleranceEngine.executeWithFaultTolerance('ContextBuilder', async () => contextBuilderEngine.assembleTenantContext(tenant), () => fallbackContext),
    ]);

    const contextData: FilteredFinancialContext = contextRes.data || fallbackContext;

    serviceCoordinator.emitEvent('PARALLEL_SERVICES_COMPLETED', { graphId: dag.graphId });

    // 5. Predictive Forecast Engine
    const forecastRes = await faultToleranceEngine.executeWithFaultTolerance('ForecastEngine', async () =>
      enterpriseForecastEngine.runPredictivePipeline({
        tenantId: tenant.organizationId,
        target: 'REVENUE',
        horizon: 'QUARTERLY',
        metrics: contextData,
      }),
      () => ({
        forecast: {
          forecastId: '',
          tenantId: tenant.organizationId,
          target: 'REVENUE' as const,
          horizon: 'QUARTERLY' as const,
          timePoints: [],
          baselineValue: 0,
          predictedGrowthPct: 0,
          modelName: '',
          modelVersion: '',
          confidenceScore: 0,
          createdAt: '',
        },
        topDrivers: [],
        assumptions: [],
        limitations: '',
        anomalies: [],
      })
    );

    // 6. Recommendation & Decision Intelligence Engine
    const decisionRes = await faultToleranceEngine.executeWithFaultTolerance('RecommendationEngine', async () =>
      enterpriseRecommendationEngine.generateDecisionRecommendations({
        tenantId: tenant.organizationId,
        userId: tenant.userId,
        metrics: contextData,
      }),
      () => ({ recommendations: [], simulations: [] })
    );

    // 7. Execution Planner
    const plan = plannerEngine.generatePlan(question);

    // 8. Quantitative Reasoning & Grounding Engine
    const reasoningResponse = await reasoningEngine.executeReasoning(question, contextData, tenant.userRole);

    // Append Forecast Insights
    if (forecastRes.data?.forecast?.timePoints?.length) {
      const nextQuarter = forecastRes.data.forecast.timePoints[0];
      reasoningResponse.answer += `\n\n### 🔮 Predictive AI Forecast (${forecastRes.data.forecast.target}):\n- **Projected Value (${nextQuarter.periodLabel}):** ₹${nextQuarter.predictedValue.toLocaleString()}\n- **Confidence Bounds:** ₹${nextQuarter.confidenceIntervalLow.toLocaleString()} - ₹${nextQuarter.confidenceIntervalHigh.toLocaleString()}\n- **Model Algorithm:** ${forecastRes.data.forecast.modelName} (${forecastRes.data.forecast.modelVersion})`;
    }

    // Append Anomaly Alerts if present
    if (forecastRes.data?.anomalies?.length) {
      const topAlert = forecastRes.data.anomalies[0];
      reasoningResponse.answer += `\n\n> [!WARNING]\n> **Anomaly Alert (${topAlert.anomalyType}):** ${topAlert.explanation}`;
    }

    // Append RAG Citations
    if (ragRes.data?.citations?.length) {
      const citationText = ragRes.data.citations.map((c: any) => `\n- 📄 [Citation] ${c.documentTitle} (${c.fileType}, Page ${c.pageNumber || 1}) - Confidence: ${(c.confidenceScore * 100).toFixed(1)}%`).join('');
      reasoningResponse.answer += `\n\n### Enterprise Knowledge Citations:${citationText}`;
    }

    // Append Strategic Recommendation
    if (decisionRes.data?.recommendations?.length) {
      const topRec = decisionRes.data.recommendations[0];
      reasoningResponse.answer += `\n\n### 🎯 Strategic Recommendation: ${topRec.title}\n- **Financial Impact:** ${topRec.financialImpact}\n- **Expected ROI:** ${topRec.expectedRoiPct}%\n- **Risk Score:** ${topRec.riskReport.compositeRiskScore} (${topRec.riskReport.riskSummary})\n- **Rationale:** ${topRec.rationaleExplainability}`;
    }

    // Append Fallback Notices if any subsystem gracefully degraded
    const fallbackNotices = [memoryRes, personalizationRes, ragRes, contextRes, forecastRes, decisionRes]
      .filter((r) => r.fallbackNotice)
      .map((r) => r.fallbackNotice);

    if (fallbackNotices.length > 0) {
      reasoningResponse.answer += `\n\n---\n*Subsystem Status Notices:*\n` + fallbackNotices.map((n) => `- ${n}`).join('\n');
    }

    // 9. Governance & Compliance Validation
    const govReport = governanceEngine.validateResponse({
      tenantId: tenant.organizationId,
      userId: tenant.userId,
      userRole: tenant.userRole,
      confidenceScore: reasoningResponse.confidenceScore,
      answerText: reasoningResponse.answer,
    });

    if (!govReport.isPassed) {
      return {
        answer: `Governance Rejection: ${govReport.rejectionReason || 'Response failed enterprise compliance checks.'}`,
        provider: 'Enterprise AI Governance Engine',
        confidenceScore: 0.0,
        isEstimate: false,
        executionTimeMs: Date.now() - startTime,
      };
    }

    serviceCoordinator.emitEvent('GOVERNANCE_PASSED', govReport);

    // 10. Audit & Memory Recording
    await memoryEngine.recordInteraction(tenant, question, reasoningResponse.answer);

    // 11. Learning Telemetry Event Queue
    learningPipeline.queueLearningEvent(tenant, question, reasoningResponse).catch(() => {});

    reasoningResponse.executionTimeMs = Date.now() - startTime;
    return reasoningResponse;
  }
}

export const aiOperatingSystem = AIOperatingSystem.getInstance();
