import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AwardsList from "@/components/awards/AwardsList";
import SubmissionForm from "@/components/awards/SubmissionForm";
export const metadata: Metadata = {
  title: "Awards",
  description:
    "Recognising excellence in foreign direct investment and global financial services.",
};
interface Award {
  id: string;
  title: string;
  category: string;
  recipient: string;
  year: number;
  description: string | null;
  createdAt: string;
}
interface AwardsResponse {
  awards: Award[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
async function getAwards(): Promise<AwardsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/awards?limit=24`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch awards.");
  return res.json();
}
export default async function AwardsPage() {
  const [{ awards, pagination }, session] = await Promise.all([
    getAwards(),
    getServerSession(authOptions),
  ]);
  return (
    <section className="flex-1 max-w-7xl mx-auto w-full px-6 py-20 md:py-28">
      <div className="mb-14 max-w-2xl">
        <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#c9a84c] mb-4">
          Recognition & Excellence
        </span>
        <h1
          className="text-4xl md:text-5xl font-light text-white leading-tight tracking-wide mb-5"
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
          }}
        >
          Global Awards
        </h1>
        <p className="text-white/40 text-sm leading-relaxed max-w-lg">
          Celebrating the institutions, leaders, and initiatives defining
          excellence across foreign direct investment and international financial
          services.
        </p>
      </div>
      <div className="flex items-center gap-4 mb-16">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-white/20 text-xs tracking-widest uppercase">
          {pagination.total} {pagination.total === 1 ? "Award" : "Awards"}
        </span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <AwardsList awards={awards} />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <div className="mb-6">
              <h2
                className="text-xl font-light text-white mb-2 tracking-wide"
                style={{
                  fontFamily:
                    "'Cormorant Garamond', 'Didot', 'Georgia', serif",
                }}
              >
                Submit an Entry
              </h2>
              <p className="text-white/30 text-xs leading-relaxed">
                Nominate your organisation for recognition across our global
                award categories.
              </p>
            </div>
            <SubmissionForm awards={awards} isAuthenticated={!!session} />
          </div>
        </div>
      </div>
    </section>
  );
}
