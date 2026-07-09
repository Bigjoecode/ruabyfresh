import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_SERVICE } from "./config";

/**
 * Service-role client — bypasses RLS. SERVER-ONLY (never import in client
 * components). Used to store orders + upload receipts, and for admin writes.
 */
export function createAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
