'use client';

import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, off, getDatabase } from 'firebase/database';
import { getRealtimeDatabase } from '@/lib/firebase/config';

export interface UseRealtimeResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * React Hook to subscribe to live updates for a single value/object at a Firebase Realtime Database path.
 */
export function useRealtimeValue<T = unknown>(path: string): UseRealtimeResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let dbRef;
    try {
      const db = getRealtimeDatabase();
      dbRef = ref(db, path);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      return;
    }

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val() as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      if (dbRef) {
        off(dbRef);
      }
      unsubscribe();
    };
  }, [path]);

  return { data, loading, error };
}

export interface RealtimeListItem<T> {
  id: string;
  data: T;
}

/**
 * React Hook to subscribe to live updates for a list/collection of items at a Firebase Realtime Database path.
 */
export function useRealtimeList<T = Record<string, unknown>>(path: string) {
  const [items, setItems] = useState<RealtimeListItem<T>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let dbRef;
    try {
      const db = getRealtimeDatabase();
      dbRef = ref(db, path);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      return;
    }

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const result: RealtimeListItem<T>[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnap) => {
            result.push({
              id: childSnap.key || '',
              data: childSnap.val() as T,
            });
          });
        }
        setItems(result);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      if (dbRef) {
        off(dbRef);
      }
      unsubscribe();
    };
  }, [path]);

  return { items, loading, error };
}

/**
 * React Hook to track live client connection status to Firebase Realtime Database (`.info/connected`).
 */
export function useRealtimeStatus() {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    let dbRef;
    try {
      const db = getRealtimeDatabase();
      dbRef = ref(db, '.info/connected');
    } catch {
      setConnected(false);
      return;
    }

    const unsubscribe = onValue(dbRef, (snap) => {
      setConnected(Boolean(snap.val()));
    });

    return () => {
      if (dbRef) off(dbRef);
      unsubscribe();
    };
  }, []);

  return { connected };
}
