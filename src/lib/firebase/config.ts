import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { env } from '../config/env';

/**
 * Firebase Realtime Database Configuration & Client Initialization
 * 
 * Safely initializes Firebase App instance singletons across client & SSR runtimes.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-app.firebaseapp.com',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://demo-app-default-rtdb.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-app',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-app.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:1234567890',
};

let appInstance: FirebaseApp | null = null;
let dbInstance: Database | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    // Server-side initialization
    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }

  if (!appInstance) {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return appInstance;
}

export function getRealtimeDatabase(): Database {
  if (!dbInstance) {
    const app = getFirebaseApp();
    dbInstance = getDatabase(app);
  }
  return dbInstance;
}

export { firebaseConfig };
