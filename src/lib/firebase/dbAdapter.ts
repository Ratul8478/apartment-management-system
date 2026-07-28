import { getRealtimeDatabase } from './config';
import { ref, get, set, push, update, remove } from 'firebase/database';

/**
 * FinTrack Pro — Firebase Realtime Database Persistence & Fallback Adapter
 * 
 * Provides fallback CRUD persistence layer when PostgreSQL / Supabase connection is unreachable
 * or when deployed on Vercel without active PostgreSQL instance.
 */

export interface FirebaseUser {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: string;
  organizationId?: string | null;
  isActive: boolean;
  isMfaEnabled?: boolean;
  mfaEnabled?: boolean;
  failedLogins?: number;
  lockedUntil?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FirebaseFinanceRecord {
  id: string;
  recordDate: string;
  metricType: string;
  amount: number;
  currency: string;
  notes?: string | null;
  source: string;
  createdById: string;
  createdAt: string;
}

export interface FirebaseEmployee {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  salary: number;
  email: string;
  phone?: string | null;
  linkedUserId?: string | null;
  createdAt: string;
}

export interface FirebaseAuditLog {
  id: string;
  actorUserId: string;
  action: string;
  targetTable: string;
  targetId?: string | null;
  metadata?: string | null;
  createdAt: string;
}

export const firebaseDbAdapter = {
  /**
   * Tests connection to Firebase Realtime Database
   */
  async testConnection(): Promise<boolean> {
    try {
      const db = getRealtimeDatabase();
      if (!db) return false;
      const testRef = ref(db, '.info/connected');
      const snapshot = await get(testRef);
      return snapshot.exists() ? Boolean(snapshot.val()) : true;
    } catch {
      return false;
    }
  },

  // ================= USERS =================
  async findUserByEmail(email: string): Promise<FirebaseUser | null> {
    try {
      const db = getRealtimeDatabase();
      if (!db) return null;
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      if (!snapshot.exists()) return null;
      const users = snapshot.val();
      const matchKey = Object.keys(users).find(
        (key) => users[key]?.email?.toLowerCase() === email.toLowerCase()
      );
      return matchKey ? { id: matchKey, ...users[matchKey] } : null;
    } catch {
      return null;
    }
  },

  async findUserById(id: string): Promise<FirebaseUser | null> {
    try {
      const db = getRealtimeDatabase();
      if (!db) return null;
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);
      return snapshot.exists() ? { id, ...snapshot.val() } : null;
    } catch {
      return null;
    }
  },

  async saveUser(user: Partial<FirebaseUser> & { id: string; email: string }): Promise<FirebaseUser> {
    const db = getRealtimeDatabase();
    const now = new Date().toISOString();
    const record: FirebaseUser = {
      id: user.id,
      email: user.email.toLowerCase(),
      fullName: user.fullName || 'User',
      passwordHash: user.passwordHash || '',
      role: user.role || 'ANALYST',
      organizationId: user.organizationId || null,
      isActive: user.isActive ?? true,
      createdAt: user.createdAt || now,
      updatedAt: now,
    };
    if (db) {
      await set(ref(db, `users/${user.id}`), record).catch(() => {});
    }
    return record;
  },

  // ================= FINANCE RECORDS =================
  async getFinanceRecords(): Promise<FirebaseFinanceRecord[]> {
    try {
      const db = getRealtimeDatabase();
      if (!db) return [];
      const snapshot = await get(ref(db, 'finance_records'));
      if (!snapshot.exists()) return [];
      const val = snapshot.val();
      return Object.keys(val).map((k) => ({ id: k, ...val[k] }));
    } catch {
      return [];
    }
  },

  async saveFinanceRecord(data: Omit<FirebaseFinanceRecord, 'id' | 'createdAt'>): Promise<FirebaseFinanceRecord> {
    const id = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record: FirebaseFinanceRecord = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    };
    try {
      const db = getRealtimeDatabase();
      if (db) {
        await set(ref(db, `finance_records/${id}`), record);
      }
    } catch {
      // Fallback
    }
    return record;
  },

  // ================= EMPLOYEES =================
  async getEmployees(): Promise<FirebaseEmployee[]> {
    try {
      const db = getRealtimeDatabase();
      if (!db) return [];
      const snapshot = await get(ref(db, 'employees'));
      if (!snapshot.exists()) return [];
      const val = snapshot.val();
      return Object.keys(val).map((k) => ({ id: k, ...val[k] }));
    } catch {
      return [];
    }
  },

  async saveEmployee(data: Omit<FirebaseEmployee, 'id' | 'createdAt'>): Promise<FirebaseEmployee> {
    const id = `emp_${Date.now()}`;
    const record: FirebaseEmployee = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    };
    try {
      const db = getRealtimeDatabase();
      if (db) {
        await set(ref(db, `employees/${id}`), record);
      }
    } catch {
      // Fallback
    }
    return record;
  },

  // ================= AUDIT LOGS =================
  async saveAuditLog(log: Omit<FirebaseAuditLog, 'id' | 'createdAt'>): Promise<FirebaseAuditLog> {
    const id = `audit_${Date.now()}`;
    const record: FirebaseAuditLog = {
      id,
      ...log,
      createdAt: new Date().toISOString(),
    };
    try {
      const db = getRealtimeDatabase();
      if (db) {
        await set(ref(db, `audit_logs/${id}`), record);
      }
    } catch {
      // Fallback
    }
    return record;
  },
};
