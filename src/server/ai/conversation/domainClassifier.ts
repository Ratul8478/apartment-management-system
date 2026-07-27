// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 6: Business Domain Classifier Engine
// =======================================================

import { BusinessDomain } from './types';

export class DomainClassifier {
  private static instance: DomainClassifier;

  private constructor() {}

  public static getInstance(): DomainClassifier {
    if (!DomainClassifier.instance) {
      DomainClassifier.instance = new DomainClassifier();
    }
    return DomainClassifier.instance;
  }

  /**
   * Classifies query into specific corporate business domain
   */
  public classifyDomain(question: string): BusinessDomain {
    const q = question.toLowerCase();

    if (q.includes('invest') || q.includes('share') || q.includes('stock') || q.includes('equity') || q.includes('portfolio')) {
      return 'INVESTMENT';
    }

    if (q.includes('tax') || q.includes('ledger') || q.includes('audit') || q.includes('compliance') || q.includes('invoice')) {
      return 'ACCOUNTING';
    }

    if (q.includes('employee') || q.includes('headcount') || q.includes('turnover rate') || q.includes('payroll')) {
      return 'HUMAN_RESOURCES';
    }

    if (q.includes('client') || q.includes('deal') || q.includes('crm') || q.includes('pipeline') || q.includes('sales')) {
      return 'SALES';
    }

    if (q.includes('operation') || q.includes('procurement') || q.includes('vendor') || q.includes('logistics')) {
      return 'OPERATIONS';
    }

    if (q.includes('strategy') || q.includes('expansion') || q.includes('market share') || q.includes('acquisition')) {
      return 'COMPANY_STRATEGY';
    }

    return 'FINANCE';
  }
}

export const domainClassifier = DomainClassifier.getInstance();
