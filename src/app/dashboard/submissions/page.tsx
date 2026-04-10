import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SubmissionsClient from "./SubmissionsClient";
export const metadata: Metadata = { title: "Submissions" };
async function getSubmissions(userId: string, isAdmin: boolean) {
  const where = isAdmin ? {} : { userId };
  return prisma.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      contactEmail: true,
      status: true,
      createdAt: true,
      award: { select: { id: true, title: true, category: true, year: true } },
      ...(isAdmin
        ? { user: { select: { id: true, name: true, email: true } } }
        : {}),
    },
  });
}
export default async function SubmissionsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const isAdmin = session.user.role === "ADMIN";
  const submissions = await getSubmissions(session.user.id, isAdmin);
  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div>
        <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#c9a84c] mb-3">
          {isAdmin ? "All Entries" : "My Entries"}
        </span>
        <h1
          className="text-3xl font-light text-white tracking-wide"
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
          }}
        >
          Award Submissions
        </h1>
      </div>
      <SubmissionsClient
        submissions={submissions as unknown as Parameters<typeof SubmissionsClient>[0]["submissions"]}
        isAdmin={isAdmin}
      />
    </div>
  );
}
