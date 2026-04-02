import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect if user is not logged in
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* DashboardSidebar should be a client component */}
      <DashboardSidebar user={session.user} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <header className="sticky top-0 z-30 h-14 border-b border-white/5 bg-[#0a0a0f]/95 backdrop-blur-md flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-white/30 text-xs tracking-widest uppercase">
              Dashboard
            </span>
          </div>

          {/* User info - move interactive parts into a client component */}
          <div className="flex items-center gap-3">
            <UserInfo user={session.user} />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

// Create a small client component for interactive user info
"use client";
import React from "react";

function UserInfo({ user }: { user: any }) {
  return (
    <>
      <span className="text-white/25 text-xs hidden sm:block">{user.email}</span>
      <div className="w-7 h-7 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
        <span className="text-[#c9a84c] text-[11px] font-semibold uppercase">
          {user.name?.charAt(0) ?? "U"}
        </span>
      </div>
    </>
  );
}
