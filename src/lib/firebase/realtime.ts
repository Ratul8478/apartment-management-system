import {
  ref,
  get,
  set,
  update,
  push,
  remove,
  onValue,
  off,
  runTransaction,
  QueryConstraint,
  query,
  DataSnapshot,
  Unsubscribe,
} from 'firebase/database';
import { getRealtimeDatabase } from './config';

/**
 * Firebase Realtime Database Utility Helpers
 */

/**
 * Write/Overwrite data at a specific path
 */
export async function writeRealtimeData<T>(path: string, data: T): Promise<void> {
  const db = getRealtimeDatabase();
  const dbRef = ref(db, path);
  await set(dbRef, data);
}

/**
 * Update specific child keys at a path without overwriting entire node
 */
export async function updateRealtimeData(path: string, data: Record<string, unknown>): Promise<void> {
  const db = getRealtimeDatabase();
  const dbRef = ref(db, path);
  await update(dbRef, data);
}

/**
 * Push new record into a list node (generates unique key)
 */
export async function pushRealtimeData<T>(path: string, data: T): Promise<string> {
  const db = getRealtimeDatabase();
  const listRef = ref(db, path);
  const newRef = push(listRef);
  await set(newRef, data);
  if (!newRef.key) {
    throw new Error(`Failed to generate key for push at path: ${path}`);
  }
  return newRef.key;
}

/**
 * Delete node at a path
 */
export async function removeRealtimeData(path: string): Promise<void> {
  const db = getRealtimeDatabase();
  const dbRef = ref(db, path);
  await remove(dbRef);
}

/**
 * Fetch a single snapshot of data at a path
 */
export async function getRealtimeData<T>(path: string): Promise<T | null> {
  const db = getRealtimeDatabase();
  const dbRef = ref(db, path);
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    return snapshot.val() as T;
  }
  return null;
}

/**
 * Subscribe to real-time updates at a given path
 */
export function subscribeToRealtimePath<T>(
  path: string,
  onData: (data: T | null, snapshot: DataSnapshot) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = getRealtimeDatabase();
  const dbRef = ref(db, path);

  const unsubscribe = onValue(
    dbRef,
    (snapshot) => {
      onData(snapshot.exists() ? (snapshot.val() as T) : null, snapshot);
    },
    (error) => {
      if (onError) onError(error);
    }
  );

  return () => {
    off(dbRef);
    unsubscribe();
  };
}

/**
 * Perform atomic transaction at a path
 */
export async function transactionRealtimeData<T>(
  path: string,
  updateFn: (currentValue: T | null) => T | null
): Promise<{ committed: boolean; snapshot: DataSnapshot }> {
  const db = getRealtimeDatabase();
  const dbRef = ref(db, path);
  return await runTransaction(dbRef, updateFn);
}
