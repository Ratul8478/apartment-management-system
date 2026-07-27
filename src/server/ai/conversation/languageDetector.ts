// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 4: Language & Corporate Register Detector
// =======================================================

export class LanguageDetector {
  private static instance: LanguageDetector;

  private constructor() {}

  public static getInstance(): LanguageDetector {
    if (!LanguageDetector.instance) {
      LanguageDetector.instance = new LanguageDetector();
    }
    return LanguageDetector.instance;
  }

  /**
   * Detects language and corporate register
   */
  public detectLanguage(question: string): 'ENGLISH' | 'HINDI' | 'BENGALI' | 'CORPORATE_FINANCIAL' {
    const q = question.toLowerCase();

    // Check Hindi Devanagari script or common Hinglish keywords
    if (/[\u0900-\u097F]/.test(question) || q.includes('kya') || q.includes('kaise') || q.includes('kitna')) {
      return 'HINDI';
    }

    // Check Bengali script or common Bengali keywords
    if (/[\u0980-\u09FF]/.test(question) || q.includes('kemon') || q.includes('koto') || q.includes('amader')) {
      return 'BENGALI';
    }

    // Check Corporate Financial terminology
    if (
      q.includes('turnover') ||
      q.includes('ebitda') ||
      q.includes('roi') ||
      q.includes('p&l') ||
      q.includes('cagr') ||
      q.includes('amortization') ||
      q.includes('balance sheet')
    ) {
      return 'CORPORATE_FINANCIAL';
    }

    return 'ENGLISH';
  }
}

export const languageDetector = LanguageDetector.getInstance();
