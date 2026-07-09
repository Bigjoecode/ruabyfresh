import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON } from "./config";

/**
 * Anonymous read-only client with no cookies — safe to call during static
 * generation and in Server Components for public data (products, settings).
 */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
