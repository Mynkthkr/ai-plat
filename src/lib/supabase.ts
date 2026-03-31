/**
 * Supabase Client
 *
 * Lazy-initialized Supabase clients for database operations.
 * Won't crash if env vars are missing (demo mode).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Database types
export interface Article {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  rewritten_content: string;
  full_rewritten_content: string;
  original_url: string;
  source_name: string | null;
  image_url: string | null;
  category: string;
  tags: string[];
  hype_score?: number;
  reality_check?: string;
  published_date: string;
  created_at?: string;
}

export interface Subscriber {
  id?: string;
  email: string;
  joined_date?: string;
  is_active: boolean;
}

// Lazy-initialized clients
let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Client-side Supabase (anon key, RLS enforced)
 * Returns null if not configured.
 */
export function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  _supabase = createClient(url, anonKey);
  return _supabase;
}

/**
 * Server-side Supabase (service role, bypasses RLS)
 * Returns null if not configured.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  _supabaseAdmin = createClient(url, serviceKey);
  return _supabaseAdmin;
}
