import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create a lazy-initialized supabase admin client
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    // Only validate environment variables when actually creating the client
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
    }

    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          }
        }
      }
    );
  }
  
  return _supabaseAdmin;
}

// Export the lazy-initialized client
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseAdmin();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
}); 