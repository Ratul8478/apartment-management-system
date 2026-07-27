// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 3: Workflow & Recurring Task Learning Engine
// =======================================================

import { EmployeePersonalityProfile } from './types';

export class WorkflowLearner {
  private static instance: WorkflowLearner;

  private constructor() {}

  public static getInstance(): WorkflowLearner {
    if (!WorkflowLearner.instance) {
      WorkflowLearner.instance = new WorkflowLearner();
    }
    return WorkflowLearner.instance;
  }

  /**
   * Identifies recurring workflow patterns and generates recommendations
   */
  public analyzeAndSuggestWorkflows(profile: EmployeePersonalityProfile): { recommendedWorkflows: string[]; promptSuggestions: string[] } {
    const recommendedWorkflows: string[] = [];
    const promptSuggestions: string[] = [];

    const now = new Date();
    const dayOfWeek = now.getDay(); // 1 = Monday

    if (dayOfWeek === 1) {
      recommendedWorkflows.push('Automated Weekly KPI Dashboard Refresh');
      promptSuggestions.push('Generate Weekly Executive Financial KPI Summary');
    }

    if (profile.role === 'FINANCE_MANAGER' || profile.role === 'SUPER_ADMIN') {
      recommendedWorkflows.push('Monthly EBITDA & Margin Variance Review');
      promptSuggestions.push('Compare Net Profit Margins against Target 15% Threshold');
    }

    if (profile.favoriteMetrics.includes('TURNOVER')) {
      promptSuggestions.push('Forecast Q3 Turnover Growth and Share Value Trend');
    }

    return { recommendedWorkflows, promptSuggestions };
  }
}

export const workflowLearner = WorkflowLearner.getInstance();
