// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 2: Financial & Corporate Entity Extractor
// =======================================================

import { ExtractedEntity } from './types';

export class EntityExtractor {
  private static instance: EntityExtractor;

  private constructor() {}

  public static getInstance(): EntityExtractor {
    if (!EntityExtractor.instance) {
      EntityExtractor.instance = new EntityExtractor();
    }
    return EntityExtractor.instance;
  }

  /**
   * Extracts financial and corporate entities from raw text
   */
  public extractEntities(question: string): { entities: ExtractedEntity[]; metrics: { referencedTurnover?: number; referencedProfit?: number; referencedCost?: number; currency?: string } } {
    const entities: ExtractedEntity[] = [];
    const metrics: { referencedTurnover?: number; referencedProfit?: number; referencedCost?: number; currency?: string } = {};

    // Currency Detection (INR, ₹, USD, $, EUR, €)
    if (question.includes('INR') || question.includes('₹') || question.includes('Rupees') || question.includes('Lakhs') || question.includes('Crores')) {
      metrics.currency = 'INR';
      entities.push({ type: 'CURRENCY', value: 'INR', rawText: 'INR / ₹' });
    } else if (question.includes('$') || question.includes('USD')) {
      metrics.currency = 'USD';
      entities.push({ type: 'CURRENCY', value: 'USD', rawText: 'USD / $' });
    }

    // Number extraction regex (e.g. 50 Lakhs, 100000)
    const numberMatches = question.match(/(\d+(?:\.\d+)?)\s*(lakhs|crores|k|m|million)?/gi);
    if (numberMatches) {
      for (const raw of numberMatches) {
        entities.push({ type: 'KPI', value: raw, rawText: raw });
      }
    }

    // Department Extraction
    const departments = ['Finance', 'Engineering', 'Marketing', 'Sales', 'Operations', 'Human Resources', 'HR', 'Legal'];
    for (const dep of departments) {
      if (question.toLowerCase().includes(dep.toLowerCase())) {
        entities.push({ type: 'DEPARTMENT', value: dep, rawText: dep });
      }
    }

    // Metric References
    const qLower = question.toLowerCase();
    if (qLower.includes('turnover') || qLower.includes('revenue')) {
      entities.push({ type: 'REVENUE', value: 'Turnover', rawText: 'Turnover' });
    }
    if (qLower.includes('profit') || qLower.includes('margin')) {
      entities.push({ type: 'KPI', value: 'Profit Margin', rawText: 'Profit Margin' });
    }
    if (qLower.includes('cost') || qLower.includes('expense')) {
      entities.push({ type: 'EXPENSE', value: 'Operating Expense', rawText: 'Expense' });
    }

    return { entities, metrics };
  }
}

export const entityExtractor = EntityExtractor.getInstance();
