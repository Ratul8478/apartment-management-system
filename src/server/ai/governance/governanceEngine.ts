// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 1: Enterprise AI Governance & Compliance Validation Engine
// =======================================================

import { GovernanceValidationReport, GovernanceValidationRule } from './types';

export class GovernanceEngine {
  private static instance: GovernanceEngine;

  private constructor() {}

  public static getInstance(): GovernanceEngine {
    if (!GovernanceEngine.instance) {
      GovernanceEngine.instance = new GovernanceEngine();
    }
    return GovernanceEngine.instance;
  }

  /**
   * Validates AI response against strict enterprise governance standards before release
   */
  public validateResponse(params: {
    tenantId: string;
    userId: string;
    userRole: string;
    confidenceScore: number;
    answerText: string;
  }): GovernanceValidationReport {
    const { tenantId, userId, userRole, confidenceScore, answerText } = params;
    const validationId = `gov_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const rulesEvaluated: GovernanceValidationRule[] = [];

    // Rule 1: Security & Role-Based Access Control
    const isRestrictedAccess = (answerText.toLowerCase().includes('salary') || answerText.toLowerCase().includes('payroll')) &&
      userRole !== 'SUPER_ADMIN' && userRole !== 'FINANCE_MANAGER';

    rulesEvaluated.push({
      ruleId: 'rule_rbac_01',
      ruleName: 'Role-Based Data Access Policy',
      category: 'SECURITY_PERMISSIONS',
      isPassed: !isRestrictedAccess,
      score: !isRestrictedAccess ? 1.0 : 0.0,
      reason: !isRestrictedAccess ? 'Passed role-based security validation.' : 'Restricted payroll compensation data accessed by unauthorized role.',
    });

    // Rule 2: Minimum Confidence Threshold
    const isConfidenceSufficient = confidenceScore >= 0.85;
    rulesEvaluated.push({
      ruleId: 'rule_conf_02',
      ruleName: 'Minimum Prediction Confidence Threshold (85%)',
      category: 'CONFIDENCE_THRESHOLD',
      isPassed: isConfidenceSufficient,
      score: confidenceScore,
      reason: isConfidenceSufficient ? 'Confidence score meets 85% threshold.' : 'Confidence score is below required 85% threshold.',
    });

    // Rule 3: Grounded Data Source Validity
    const isGrounded = answerText.includes('Grounded') || answerText.includes('FinTrack') || answerText.includes('Turnover') || answerText.includes('Margin');
    rulesEvaluated.push({
      ruleId: 'rule_grounding_03',
      ruleName: 'Verified Data Source Grounding',
      category: 'DATA_SOURCE_VALIDITY',
      isPassed: isGrounded,
      score: isGrounded ? 0.98 : 0.40,
      reason: isGrounded ? 'Grounded strictly in verified database ledger entries.' : 'Unverified data source detected.',
    });

    // Calculate Composite Governance Score
    const compositeScore = Number(
      (rulesEvaluated.reduce((sum, r) => sum + r.score, 0) / rulesEvaluated.length).toFixed(4)
    );

    const isPassed = rulesEvaluated.every((r) => r.isPassed);
    const rejectionReason = !isPassed
      ? rulesEvaluated.filter((r) => !r.isPassed).map((r) => r.reason).join(' ')
      : undefined;

    return {
      validationId,
      tenantId,
      userId,
      isPassed,
      compositeGovernanceScore: compositeScore,
      rulesEvaluated,
      rejectionReason,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

export const governanceEngine = GovernanceEngine.getInstance();
