// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 3: Sentiment & Communication Style Analyzer
// =======================================================

import { SentimentTone, CommunicationStyle } from './types';

export class SentimentAnalyzer {
  private static instance: SentimentAnalyzer;

  private constructor() {}

  public static getInstance(): SentimentAnalyzer {
    if (!SentimentAnalyzer.instance) {
      SentimentAnalyzer.instance = new SentimentAnalyzer();
    }
    return SentimentAnalyzer.instance;
  }

  /**
   * Analyzes sentiment tone, urgency, and communication style preferences
   */
  public analyzeToneAndStyle(question: string, userRole: string): { sentiment: SentimentTone; urgency: 'HIGH' | 'MEDIUM' | 'LOW'; style: CommunicationStyle } {
    const q = question.toLowerCase();

    let urgency: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (q.includes('asap') || q.includes('urgent') || q.includes('immediately') || q.includes('critical') || q.includes('emergency')) {
      urgency = 'HIGH';
    } else if (q.includes('today') || q.includes('quick') || q.includes('needed')) {
      urgency = 'MEDIUM';
    }

    let sentiment: SentimentTone = 'PROFESSIONAL';
    if (userRole === 'SUPER_ADMIN' || userRole === 'FINANCE_MANAGER') {
      sentiment = 'EXECUTIVE_BRIEFING';
    } else if (q.includes('why') && q.includes('issue') || q.includes('fail') || q.includes('error')) {
      sentiment = 'FRUSTRATED';
    } else if (q.includes('how do i') || q.includes('don\'t understand') || q.includes('help')) {
      sentiment = 'CONFUSED';
    } else if (urgency === 'HIGH') {
      sentiment = 'URGENT';
    } else if (q.includes('algorithm') || q.includes('formula') || q.includes('ratio')) {
      sentiment = 'TECHNICAL_DISCUSSION';
    }

    let style: CommunicationStyle = 'EXECUTIVE_SUMMARY';
    if (sentiment === 'TECHNICAL_DISCUSSION' || userRole === 'ANALYST') {
      style = 'TECHNICAL';
    } else if (q.includes('step') || q.includes('how to')) {
      style = 'STEP_BY_STEP';
    } else if (q.includes('detail') || q.includes('breakdown')) {
      style = 'DETAILED_EXPLANATION';
    }

    return { sentiment, urgency, style };
  }
}

export const sentimentAnalyzer = SentimentAnalyzer.getInstance();
