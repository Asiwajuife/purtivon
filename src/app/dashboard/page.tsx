import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Link from "next/link";
export const metadata: Metadata = { title: "Dashboard" };
interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: boolean;
}
function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 p-6 rounded-sm border transition-all duration-200 ${
        accent
          ? "border-[#c9a84c]/20 bg-[#c9a84c]/5"
          : "border-white/5 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30">
          {label}
        </p>
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-sm ${
            accent
              ? "bg-[#c9a84c]/15 text-[#c9a84c]"
              : "bg-white/[0.04] text-white/25"
          }`}
        >
          {icon}
        </span>
      </div>
      <div>
        <p
          className={`text-3xl font-light tracking-wide ${
            accent ? "text-[#c9a84c]" : "text-white/90"
          }`}
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
          }}
        >
          {value}
        </p>
        {sub && (
          <p className="mt-1 text-white/25 text-xs tracking-wide">{sub}</p>
        )}
      </div>
    </div>
}
  );
async function getDashboardStats(userId: string, isAdmin: boolean) {
  const submissionWhere = isAdmin ? {} : { userId };
  const [
    totalSubmissions,
    pendingSubmissions,
    approvedSubmissions,
    totalArticles,
    stripeBalance,
  ] = await Promise.all([
    prisma.submission.count({ where: submissionWhere }),
    prisma.submission.count({
      where: { ...submissionWhere, status: "PENDING" },
    }),
    prisma.submission.count({
      where: { ...submissionWhere, status: "APPROVED" },
    }),
    prisma.article.count({ where: { published: true } }),
    isAdmin ? stripe.balance.retrieve().catch(() => null) : null,
  ]);
  const totalRevenue = stripeBalance
    ? stripeBalance.available.reduce((sum, b) => sum + b.amount, 0) / 100
    : null;
  return {
    totalSubmissions,
    pendingSubmissions,
    approvedSubmissions,
    totalArticles,
    totalRevenue,
  };
}
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";
  const stats = await getDashboardStats(session!.user.id, isAdmin);
  const quickActions = [
    {
      label: "View Submissions",
      href: "/dashboard/submissions",
      description: "Review your award entries",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      ),
    },
    {
      label: "Browse Awards",
      href: "/awards",
      description: "Submit a new award entry",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
          />
        </svg>
      ),
    },
    {
      label: "Read Insights",
      href: "/insights",
      description: "Latest FDI intelligence",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
          />
        </svg>
      ),
    },
  ];
  return (
    <div className="flex flex-col gap-10 max-w-5xl">
      <div>
        <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#c9a84c] mb-3">
          {isAdmin ? "Platform Overview" : "My Account"}
        </span>
        <h1
          className="text-3xl md:text-4xl font-light text-white tracking-wide"
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
          }}
        >
          Welcome back,{" "}
          <span className="text-white/50">
            {session?.user?.name?.split(" ")[0] ?? "there"}
          </span>
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Submissions"
          value={String(stats.totalSubmissions)}
          sub={isAdmin ? "Across all users" : "Your entries"}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          }
        />
        <StatCard
          label="Pending Review"
          value={String(stats.pendingSubmissions)}
          sub="Awaiting decision"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          }
        />
        <StatCard
          label="Approved"
          value={String(stats.approvedSubmissions)}
          sub="Successful entries"
          accent
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          }
        />
        {isAdmin ? (
          <StatCard
            label="Total Revenue"
            value={
              stats.totalRevenue !== null
                ? formatCurrency(stats.totalRevenue)
                : "—"
            }
            sub="Stripe available balance"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            }
          />
        ) : (
          <StatCard
            label="Published Articles"
            value={String(stats.totalArticles)}
            sub="Platform insights"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                />
              </svg>
            }
          />
        )}
      </div>
      <div>
        <div className="flex items-center gap-4 mb-6">
          <h2
            className="text-lg font-light text-white/60 tracking-wide"
            style={{
              fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
            }}
          >
            Quick Actions
          </h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map(({ label, href, description, icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 p-5 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#c9a84c]/15 rounded-sm transition-all duration-200"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-sm bg-white/[0.03] border border-white/5 text-white/25 group-hover:text-[#c9a84c] group-hover:border-[#c9a84c]/20 group-hover:bg-[#c9a84c]/5 transition-all duration-200 shrink-0">
                {icon}
              </span>
              <div className="min-w-0">
                <p className="text-white/70 text-sm font-medium group-hover:text-white transition-colors duration-200">
                  {label}
                </p>
                <p className="text-white/25 text-xs mt-0.5 truncate">
                  {description}
                </p>
              </div>
              <svg
                className="w-3.5 h-3.5 text-white/10 group-hover:text-[#c9a84c]/50 group-hover:translate-x-0.5 transition-all duration-200 ml-auto shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
