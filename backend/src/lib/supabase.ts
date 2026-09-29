import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const BUCKET = 'media';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required');
    _supabase = createClient(url, key);
  }
  return _supabase;
}
