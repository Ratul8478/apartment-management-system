// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 6: Enterprise RAG Engine Types
// =======================================================

export type SensitivityLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED_PAYROLL';

export interface DocumentMetadata {
  documentId: string;
  tenantId: string;
  title: string;
  department: string;
  author: string;
  fileType: 'PDF' | 'DOCX' | 'PPTX' | 'XLSX' | 'CSV' | 'TXT' | 'MARKDOWN';
  fiscalYear?: string;
  currency?: string;
  businessCategory: 'FINANCIAL_REPORT' | 'INVOICE' | 'CONTRACT' | 'BUDGET' | 'SOP' | 'INVESTMENT_REPORT' | 'MEETING_MINUTES';
  sensitivity: SensitivityLevel;
  keywords: string[];
  summary: string;
  createdAt: string;
}

export interface DocumentChunk {
  chunkId: string;
  documentId: string;
  tenantId: string;
  content: string;
  pageNumber?: number;
  sectionName?: string;
  embedding?: number[];
  importanceScore: number; // 0.0 to 1.0
  tokenCount: number;
  createdAt: string;
}

export interface HybridSearchQuery {
  tenantId: string;
  userId: string;
  userRole: string;
  question: string;
  topK?: number;
  filterDepartment?: string;
  filterCategory?: string;
}

export interface RankedChunkResult {
  chunk: DocumentChunk;
  document: DocumentMetadata;
  vectorSimilarity: number;
  keywordScore: number;
  compositeRankScore: number;
}

export interface CitationRecord {
  citationId: string;
  documentTitle: string;
  fileType: string;
  pageNumber?: number;
  sectionName?: string;
  confidenceScore: number;
  excerptSnippet: string;
}

export interface RAGContextPackage {
  retrievedChunks: RankedChunkResult[];
  formattedRAGContext: string;
  citations: CitationRecord[];
  hasSufficientEvidence: boolean;
}
