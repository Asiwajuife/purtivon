export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import UserInfo from "@/components/dashboard/UserInfo";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
    <div style={{ minHeight: '100vh', background: 'var(--surface-page)', display: 'flex' }}>
      <DashboardSidebar user={session.user} />

      {/* md:ml-[200px] matches sidebar width; pl-14 on mobile clears the 48px hamburger */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[200px]">
        <header
          className="pl-14 md:pl-5 pr-5"
          style={{
            position: 'sticky', top: 0, zIndex: 30, height: 44,
            borderBottom: '1px solid var(--border-faint)',
            background: 'var(--nav-backdrop)', backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-4)' }}>
              Dashboard
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle />
            <UserInfo user={session.user} />
          </div>
        </header>

        <main style={{ flex: 1, padding: '1.25rem' }}>{children}</main>
      </div>
    </div>
  );
}
