import { redirect } from "next/navigation";
import { supabaseConfigured } from "@/lib/supabase/config";
import { getAdminUser } from "@/lib/supabase/auth";
import AdminShell from "@/components/admin/AdminShell";
import SetupNotice from "@/components/admin/SetupNotice";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!supabaseConfigured) return <SetupNotice />;

  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return <AdminShell email={user.email}>{children}</AdminShell>;
}
