import { getRealtimeDatabase } from './config';
import { ref, set, update } from 'firebase/database';

export interface RealtimeUserData {
  id: string;
  email: string;
  fullName: string;
  role: string;
  organizationId?: string | null;
  isVerified?: boolean;
  registeredAt?: string;
  lastLoginAt?: string;
  lastActiveSessionId?: string;
}

/**
  * Synchronizes User Authentication State to Firebase Realtime Database
  */
export async function syncUserRealtimeAuth(userData: RealtimeUserData): Promise<boolean> {
  try {
    const db = getRealtimeDatabase();
    if (!db) return false;

    const userRef = ref(db, `auth/users/${userData.id}`);
    
    await update(userRef, {
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      organizationId: userData.organizationId || null,
      isVerified: userData.isVerified ?? true,
      lastLoginAt: userData.lastLoginAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (err) {
    console.warn('[Firebase Realtime Auth Sync Notice]', err);
    return false;
  }
}
