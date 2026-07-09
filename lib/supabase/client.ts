import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON } from "./config";

/** Browser Supabase client (used in admin client components for auth). */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
}
