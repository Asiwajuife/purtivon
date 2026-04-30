export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardShell from "@/components/dashboard/DashboardShell";
import SessionProvider from "@/components/providers/SessionProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <SessionProvider session={session}>
      <div style={{ minHeight: "100vh", background: "var(--surface-page)", display: "flex" }}>
        <DashboardSidebar user={session.user} />
        <DashboardShell user={session.user}>
          {children}
        </DashboardShell>
      </div>
    </SessionProvider>
  );
}
