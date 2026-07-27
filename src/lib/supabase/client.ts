import { env } from '../config/env';

/**
 * FinTrack Pro — Supabase Enterprise Backend Integration
 * 
 * Provides unified helper client interfaces for Supabase PostgreSQL database,
 * Row Level Security (RLS), and Cloud Bucket Storage operations.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-project.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '',
  };
}

export async function fetchSupabaseRest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const config = getSupabaseConfig();
  const headers = new Headers(options.headers);

  headers.set('apikey', config.anonKey);
  headers.set('Authorization', `Bearer ${config.anonKey}`);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${config.url}/rest/v1${cleanEndpoint}`;

  return fetch(fullUrl, {
    ...options,
    headers,
  });
}
