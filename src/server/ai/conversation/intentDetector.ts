// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 1: Intent Detection & Classification Engine
// =======================================================

import { DetectedIntent } from './types';

export class IntentDetector {
  private static instance: IntentDetector;

  private constructor() {}

  public static getInstance(): IntentDetector {
    if (!IntentDetector.instance) {
      IntentDetector.instance = new IntentDetector();
    }
    return IntentDetector.instance;
  }

  /**
   * Detects intent from user question with high precision
   */
  public detectIntent(question: string): { intent: DetectedIntent; confidence: number } {
    const q = question.toLowerCase();

    if (q.includes('forecast') || q.includes('predict') || q.includes('next quarter') || q.includes('future growth')) {
      return { intent: 'PROFIT_FORECAST', confidence: 0.96 };
    }

    if (q.includes('invest') || q.includes('portfolio') || q.includes('share price') || q.includes('equity')) {
      return { intent: 'INVESTMENT_ANALYSIS', confidence: 0.95 };
    }

    if (q.includes('ppt') || q.includes('presentation') || q.includes('slides') || q.includes('deck')) {
      return { intent: 'GENERATE_PPT', confidence: 0.98 };
    }

    if (q.includes('cost') || q.includes('expense') || q.includes('spending') || q.includes('outflow')) {
      return { intent: 'EXPENSE_REPORT', confidence: 0.94 };
    }

    if (q.includes('chart') || q.includes('graph') || q.includes('visualize') || q.includes('plot')) {
      return { intent: 'DATA_VISUALIZATION', confidence: 0.95 };
    }

    if (q.includes('budget') || q.includes('allocation') || q.includes('cap')) {
      return { intent: 'BUDGET_PLANNING', confidence: 0.93 };
    }

    if (q.includes('cash flow') || q.includes('liquidity') || q.includes('runway')) {
      return { intent: 'CASH_FLOW', confidence: 0.95 };
    }

    if (q.includes('dashboard') || q.includes('summary') || q.includes('overview') || q.includes('metrics')) {
      return { intent: 'FINANCIAL_DASHBOARD', confidence: 0.92 };
    }

    if (q.includes('recommend') || q.includes('advice') || q.includes('suggest') || q.includes('optimize')) {
      return { intent: 'RECOMMENDATION_REQUEST', confidence: 0.94 };
    }

    return { intent: 'GENERAL_FINANCIAL_QUERY', confidence: 0.90 };
  }
}

export const intentDetector = IntentDetector.getInstance();
