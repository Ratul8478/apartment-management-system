// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// MASTER PROMPT 2: Enterprise AI Memory Engine Type Definitions
// =======================================================

export type MemoryLayer = 'WORKING' | 'SHORT_TERM' | 'LONG_TERM' | 'ORGANIZATIONAL' | 'SEMANTIC';

export type MemoryCategory =
  | 'USER_PREFERENCE'
  | 'COMMUNICATION_STYLE'
  | 'PROJECT_CONTEXT'
  | 'FINANCIAL_RULE'
  | 'DECISION_LOG'
  | 'EXECUTIVE_SUMMARY'
  | 'CONVERSATION_FACT';

export interface MemoryObject {
  id: string;
  tenantId: string;
  userId: string;
  departmentId?: string;
  projectId?: string;
  layer: MemoryLayer;
  category: MemoryCategory;
  content: string;
  tags: string[];
  importanceScore: number; // 0.0 to 1.0
  confidenceScore: number;  // 0.0 to 1.0
  isPinned: boolean;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
  lastRetrievedAt?: string;
  accessCount: number;
  expirationPolicy: 'TTL_SESSION' | 'TTL_30_DAYS' | 'PERMANENT';
}

export interface WorkingMemorySession {
  sessionId: string;
  tenantId: string;
  userId: string;
  currentPrompt?: string;
  currentProjectId?: string;
  currentReportId?: string;
  recentUploadedFiles: string[];
  activeExecutionPlan?: any;
  createdAt: number;
  lastActiveAt: number;
}

export interface MemoryRetrievalQuery {
  tenantId: string;
  userId: string;
  userRole: string;
  question: string;
  projectId?: string;
  departmentId?: string;
  topK?: number;
}

export interface RankedMemoryResult {
  memory: MemoryObject;
  similarityScore: number;
  decayFactor: number;
  finalRankScore: number;
}
