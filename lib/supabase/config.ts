export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/** True once the public Supabase env vars are present. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON);

/** True once the server-side service-role key is present. */
export const supabaseAdminConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE);

/** Emails allowed into the admin (comma-separated). Empty = any authenticated user. */
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const isAdminEmail = (email?: string | null) =>
  !!email && (ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(email.toLowerCase()));
