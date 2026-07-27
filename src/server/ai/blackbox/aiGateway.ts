// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 1: AI Gateway (Zero-Trust Security & Tenant Isolation)
// =======================================================

import { TenantIdentity } from './types';

export class AIGateway {
  private static instance: AIGateway;

  private constructor() {}

  public static getInstance(): AIGateway {
    if (!AIGateway.instance) {
      AIGateway.instance = new AIGateway();
    }
    return AIGateway.instance;
  }

  /**
   * Enforces Zero-Trust Security, Tenant Isolation, and Role Access Guard
   */
  public validateSecurityContext(tenant: TenantIdentity, question: string): { isAuthorized: boolean; rejectionReason?: string } {
    if (!tenant.organizationId || !tenant.userId) {
      return { isAuthorized: false, rejectionReason: 'Missing valid tenant or user identity' };
    }

    const lowerQ = question.toLowerCase();
    const role = tenant.userRole;

    // RBAC & ABAC Guard: Confidential Payroll & Compensation Security Check
    const isConfidentialQuery = lowerQ.includes('salary') || lowerQ.includes('compensation') || lowerQ.includes('payroll') || lowerQ.includes('bonus');
    if (isConfidentialQuery && (role === 'ANALYST' || role === 'ADMIN')) {
      return {
        isAuthorized: false,
        rejectionReason: 'Access Denied: Confidential employee compensation data is restricted to SUPER_ADMIN and FINANCE_MANAGER roles.',
      };
    }

    // Prompt Injection Guard
    const isInjectionAttempt = lowerQ.includes('ignore previous instructions') || lowerQ.includes('system prompt') || lowerQ.includes('reveal internal code');
    if (isInjectionAttempt) {
      return {
        isAuthorized: false,
        rejectionReason: 'Security Policy Violation: Malicious prompt pattern detected by AI Gateway Guard.',
      };
    }

    return { isAuthorized: true };
  }
}

export const aiGateway = AIGateway.getInstance();
