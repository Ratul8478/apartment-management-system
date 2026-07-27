// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 2: Communication Style & Explanation Depth Classifier
// =======================================================

import { ExplanationDepthLevel, CommunicationStyleScores } from './types';

export class StyleClassifier {
  private static instance: StyleClassifier;

  private constructor() {}

  public static getInstance(): StyleClassifier {
    if (!StyleClassifier.instance) {
      StyleClassifier.instance = new StyleClassifier();
    }
    return StyleClassifier.instance;
  }

  /**
   * Computes explanation depth level (1 to 5) based on user role and question text
   */
  public computeExplanationDepth(role: string, question: string): ExplanationDepthLevel {
    const qLower = question.toLowerCase();

    if (qLower.includes('executive summary') || qLower.includes('tl;dr') || qLower.includes('high level') || role === 'SUPER_ADMIN') {
      return 'LEVEL_1_EXECUTIVE_SUMMARY';
    }

    if (qLower.includes('overview') || qLower.includes('business impact')) {
      return 'LEVEL_2_BUSINESS_OVERVIEW';
    }

    if (qLower.includes('code') || qLower.includes('architecture') || qLower.includes('api') || qLower.includes('sql')) {
      return 'LEVEL_5_ENGINEERING';
    }

    if (qLower.includes('technical') || qLower.includes('formula') || qLower.includes('algorithm') || role === 'ANALYST') {
      return 'LEVEL_4_TECHNICAL';
    }

    return 'LEVEL_3_DETAILED_EXPLANATION';
  }

  /**
   * Continuously updates communication style scores
   */
  public updateStyleScores(currentScores: CommunicationStyleScores, question: string): CommunicationStyleScores {
    const qLower = question.toLowerCase();
    const scores = { ...currentScores };

    if (qLower.includes('summary') || qLower.includes('concise')) {
      scores.executiveScore = Math.min(1.0, scores.executiveScore + 0.05);
      scores.minimalScore = Math.min(1.0, scores.minimalScore + 0.05);
    }

    if (qLower.includes('technical') || qLower.includes('formula')) {
      scores.technicalScore = Math.min(1.0, scores.technicalScore + 0.05);
      scores.analyticalScore = Math.min(1.0, scores.analyticalScore + 0.05);
    }

    if (qLower.includes('detail') || qLower.includes('breakdown')) {
      scores.detailedScore = Math.min(1.0, scores.detailedScore + 0.05);
    }

    return scores;
  }
}

export const styleClassifier = StyleClassifier.getInstance();
