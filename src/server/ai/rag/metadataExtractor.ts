// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Module 1: Metadata Extraction Engine
// =======================================================

import { DocumentMetadata, SensitivityLevel } from './types';

export class MetadataExtractor {
  private static instance: MetadataExtractor;

  private constructor() {}

  public static getInstance(): MetadataExtractor {
    if (!MetadataExtractor.instance) {
      MetadataExtractor.instance = new MetadataExtractor();
    }
    return MetadataExtractor.instance;
  }

  /**
   * Extracts metadata from document content and filename
   */
  public extractMetadata(params: {
    tenantId: string;
    filename: string;
    content: string;
    department?: string;
  }): DocumentMetadata {
    const { tenantId, filename, content, department } = params;
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const lower = (filename + ' ' + content).toLowerCase();

    let sensitivity: SensitivityLevel = 'INTERNAL';
    if (lower.includes('payroll') || lower.includes('salary') || lower.includes('compensation')) {
      sensitivity = 'RESTRICTED_PAYROLL';
    } else if (lower.includes('confidential') || lower.includes('private')) {
      sensitivity = 'CONFIDENTIAL';
    }

    let businessCategory: DocumentMetadata['businessCategory'] = 'FINANCIAL_REPORT';
    if (lower.includes('invoice')) businessCategory = 'INVOICE';
    else if (lower.includes('contract')) businessCategory = 'CONTRACT';
    else if (lower.includes('budget')) businessCategory = 'BUDGET';
    else if (lower.includes('sop') || lower.includes('policy')) businessCategory = 'SOP';
    else if (lower.includes('invest')) businessCategory = 'INVESTMENT_REPORT';
    else if (lower.includes('meeting')) businessCategory = 'MEETING_MINUTES';

    let fileType: DocumentMetadata['fileType'] = 'TXT';
    if (filename.endsWith('.pdf')) fileType = 'PDF';
    else if (filename.endsWith('.docx')) fileType = 'DOCX';
    else if (filename.endsWith('.pptx')) fileType = 'PPTX';
    else if (filename.endsWith('.xlsx')) fileType = 'XLSX';
    else if (filename.endsWith('.csv')) fileType = 'CSV';
    else if (filename.endsWith('.md')) fileType = 'MARKDOWN';

    return {
      documentId,
      tenantId,
      title: filename.replace(/\.[^/.]+$/, ''),
      department: department || 'Finance',
      author: 'Enterprise System',
      fileType,
      fiscalYear: 'FY2026',
      currency: lower.includes('₹') || lower.includes('inr') ? 'INR' : 'USD',
      businessCategory,
      sensitivity,
      keywords: ['finance', businessCategory.toLowerCase(), sensitivity.toLowerCase()],
      summary: content.slice(0, 200) + '...',
      createdAt: new Date().toISOString(),
    };
  }
}

export const metadataExtractor = MetadataExtractor.getInstance();
