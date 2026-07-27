// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 5: Adaptive Prompt Construction Engine
// =======================================================

import { EmployeePersonalityProfile, ExplanationDepthLevel } from './types';

export class AdaptivePromptBuilder {
  private static instance: AdaptivePromptBuilder;

  private constructor() {}

  public static getInstance(): AdaptivePromptBuilder {
    if (!AdaptivePromptBuilder.instance) {
      AdaptivePromptBuilder.instance = new AdaptivePromptBuilder();
    }
    return AdaptivePromptBuilder.instance;
  }

  /**
   * Generates tailored system instruction instructions without modifying foundation LLM weights directly
   */
  public buildAdaptivePrompt(profile: EmployeePersonalityProfile, depth: ExplanationDepthLevel, question: string): string {
    const depthInstructions: Record<ExplanationDepthLevel, string> = {
      LEVEL_1_EXECUTIVE_SUMMARY: 'Provide a concise, high-level Executive Summary (1-2 paragraphs max) highlighting key financial metrics in bold.',
      LEVEL_2_BUSINESS_OVERVIEW: 'Provide a structured Business Overview focusing on operational impact, net profit margins, and turnover ratios.',
      LEVEL_3_DETAILED_EXPLANATION: 'Provide a comprehensive financial explanation with structured bullet points, ledger data breakdowns, and analytical context.',
      LEVEL_4_TECHNICAL: 'Provide a technical financial analysis detailing exact calculation formulas, profit-to-cost ratios, and quantitative metrics.',
      LEVEL_5_ENGINEERING: 'Provide an engineering & data architecture explanation including exact database metrics, service APIs, and technical ledger logs.',
    };

    return `User Role: ${profile.role} | Department: ${profile.department} | Language Register: ${profile.preferredLanguage}
Personalized Explanation Depth: ${depthInstructions[depth]}
Preferred Tone: ${profile.preferredTone}
Preferred Export Format: ${profile.preferredReportFormat}

Grounded Dataset Rules: Ground all financial values strictly in active ledger data. Never fabricate numbers.`;
  }
}

export const adaptivePromptBuilder = AdaptivePromptBuilder.getInstance();
