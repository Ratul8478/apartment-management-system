// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 4: Behavioral Pattern & Preference Engine
// =======================================================

import { BehaviorModel, PreferredExportFormat } from './types';

export class BehaviorModelEngine {
  private static instance: BehaviorModelEngine;

  private constructor() {}

  public static getInstance(): BehaviorModelEngine {
    if (!BehaviorModelEngine.instance) {
      BehaviorModelEngine.instance = new BehaviorModelEngine();
    }
    return BehaviorModelEngine.instance;
  }

  /**
   * Evaluates user behavioral pattern and preferred export formats
   */
  public evaluateBehaviorModel(role: string, question: string): { behavior: BehaviorModel; suggestedExportFormat: PreferredExportFormat } {
    const qLower = question.toLowerCase();

    let suggestedExportFormat: PreferredExportFormat = 'PDF';
    if (qLower.includes('ppt') || qLower.includes('presentation') || qLower.includes('slide')) {
      suggestedExportFormat = 'POWERPOINT';
    } else if (qLower.includes('excel') || qLower.includes('spreadsheet') || qLower.includes('xlsx')) {
      suggestedExportFormat = 'EXCEL';
    } else if (qLower.includes('csv') || qLower.includes('raw data')) {
      suggestedExportFormat = 'CSV';
    }

    return {
      behavior: {
        activityScore: 0.92,
        productivityIndex: 0.94,
        financialInterestPattern: ['TURNOVER', 'NET_PROFIT', 'COST_RATIO'],
        reportingFrequencyPattern: 'WEEKLY',
        favoriteVisualizationTypes: ['BAR_CHART', 'SHARE_PRICE_LINE_CHART'],
      },
      suggestedExportFormat,
    };
  }
}

export const behaviorModelEngine = BehaviorModelEngine.getInstance();
