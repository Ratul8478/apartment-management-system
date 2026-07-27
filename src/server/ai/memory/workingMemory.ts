// =======================================================
// FinTrack Pro Enterprise AI Brain Architecture
// Memory Layer 1: Working Memory Manager (In-Session Active Buffer)
// =======================================================

import { WorkingMemorySession } from './types';

export class WorkingMemoryManager {
  private static instance: WorkingMemoryManager;
  private sessions: Map<string, WorkingMemorySession> = new Map();
  private readonly SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 mins

  private constructor() {
    // Periodic garbage collector for expired session buffers
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.purgeExpiredSessions(), 5 * 60 * 1000);
    }
  }

  public static getInstance(): WorkingMemoryManager {
    if (!WorkingMemoryManager.instance) {
      WorkingMemoryManager.instance = new WorkingMemoryManager();
    }
    return WorkingMemoryManager.instance;
  }

  /**
   * Retrieves or initializes working memory session for active user
   */
  public getOrCreateSession(sessionId: string, tenantId: string, userId: string): WorkingMemorySession {
    let session = this.sessions.get(sessionId);
    const now = Date.now();

    if (!session || now - session.lastActiveAt > this.SESSION_TIMEOUT_MS) {
      session = {
        sessionId,
        tenantId,
        userId,
        recentUploadedFiles: [],
        createdAt: now,
        lastActiveAt: now,
      };
      this.sessions.set(sessionId, session);
    } else {
      session.lastActiveAt = now;
    }

    return session;
  }

  /**
   * Updates working memory active context
   */
  public updateSessionContext(
    sessionId: string,
    updates: Partial<Pick<WorkingMemorySession, 'currentPrompt' | 'currentProjectId' | 'currentReportId' | 'activeExecutionPlan'>>
  ): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates, { lastActiveAt: Date.now() });
    }
  }

  /**
   * Purges expired working memory buffers
   */
  private purgeExpiredSessions(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.lastActiveAt > this.SESSION_TIMEOUT_MS) {
        this.sessions.delete(id);
      }
    }
  }
}

export const workingMemoryManager = WorkingMemoryManager.getInstance();
