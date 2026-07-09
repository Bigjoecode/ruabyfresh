import { createClient } from "./server";
import { isAdminEmail } from "./config";

/** Returns the signed-in admin user, or null if not authed / not allowlisted. */
export async function getAdminUser() {
  try {
    const sb = await createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user || !isAdminEmail(user.email)) return null;
    return user;
  } catch {
    return null;
  }
}
