// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 9: Enterprise AI Governance & Compliance Types
// =======================================================

export interface GovernanceValidationRule {
  ruleId: string;
  ruleName: string;
  category: 'SECURITY_PERMISSIONS' | 'DATA_SOURCE_VALIDITY' | 'CONFIDENCE_THRESHOLD' | 'POLICY_COMPLIANCE' | 'FINANCIAL_CONSISTENCY';
  isPassed: boolean;
  score: number; // 0.0 to 1.0
  reason: string;
}

export interface GovernanceValidationReport {
  validationId: string;
  tenantId: string;
  userId: string;
  isPassed: boolean;
  compositeGovernanceScore: number; // 0.0 to 1.0
  rulesEvaluated: GovernanceValidationRule[];
  rejectionReason?: string;
  evaluatedAt: string;
}
