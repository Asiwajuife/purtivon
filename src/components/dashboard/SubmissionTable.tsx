"use client";
import { useState } from "react";
type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";
interface Award {
  id: string;
  title: string;
  category: string;
  year: number;
}
interface Submission {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  status: SubmissionStatus;
  createdAt: string;
  award: Award;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
interface SubmissionTableProps {
  submissions: Submission[];
  isAdmin?: boolean;
  onStatusChange?: (id: string, status: SubmissionStatus) => Promise<void>;
}
const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; classes: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    classes: "text-yellow-400/80 bg-yellow-400/[0.08] border-yellow-400/15",
    dot: "bg-yellow-400",
  },
  APPROVED: {
    label: "Approved",
    classes: "text-emerald-400/80 bg-emerald-400/[0.08] border-emerald-400/15",
    dot: "bg-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    classes: "text-red-400/70 bg-red-400/[0.08] border-red-400/15",
    dot: "bg-red-400",
  },
};
function StatusBadge({ status }: { status: SubmissionStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[10px] font-semibold tracking-[0.15em] uppercase ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
export default function SubmissionTable({
  submissions,
  isAdmin = false,
  onStatusChange,
}: SubmissionTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | "ALL">(
    "ALL"
  );
  const filtered =
    filterStatus === "ALL"
      ? submissions
      : submissions.filter((s) => s.status === filterStatus);
  async function handleStatusChange(id: string, status: SubmissionStatus) {
    if (!onStatusChange) return;
    setUpdatingId(id);
    try {
      await onStatusChange(id, status);
    } finally {
      setUpdatingId(null);
    }
  }
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-white/5 bg-white/[0.02] rounded-sm text-center">
        <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-5">
          <svg
            className="w-5 h-5 text-white/20"
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
        </div>
        <p
          className="text-white/30 text-xl font-light mb-1.5"
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
          }}
        >
          No submissions yet
        </p>
        <p className="text-white/15 text-xs tracking-wide">
          Submissions will appear here once entries are made.
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map(
          (status) => {
            const count =
              status === "ALL"
                ? submissions.length
                : submissions.filter((s) => s.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-semibold tracking-[0.15em] uppercase transition-all duration-200 ${
                  filterStatus === status
                    ? "border-[#c9a84c]/25 bg-[#c9a84c]/[0.08] text-[#c9a84c]"
                    : "border-white/5 bg-white/[0.02] text-white/30 hover:text-white/50 hover:border-white/10"
                }`}
              >
                {status === "ALL" ? "All" : STATUS_CONFIG[status].label}
                <span
                  className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${
                    filterStatus === status
                      ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                      : "bg-white/5 text-white/25"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          }
        )}
      </div>
      <div className="hidden md:block border border-white/5 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              {[
                "Company",
                "Award",
                "Category",
                "Status",
                "Submitted",
                ...(isAdmin ? ["Submitted By"] : []),
                ...(isAdmin && onStatusChange ? ["Actions"] : []),
              ].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 text-left text-[9px] font-semibold tracking-[0.2em] uppercase text-white/25"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((submission) => (
              <tr
                key={submission.id}
                className="group hover:bg-white/[0.02] transition-colors duration-150"
              >
                <td className="px-5 py-4">
                  <p className="text-white/80 text-sm font-medium">
                    {submission.companyName}
                  </p>
                  <p className="text-white/25 text-xs mt-0.5">
                    {submission.contactName}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-white/60 text-sm line-clamp-1">
                    {submission.award.title}
                  </p>
                  <p className="text-white/25 text-xs mt-0.5">
                    {submission.award.year}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-block text-[10px] font-semibold tracking-[0.15em] uppercase text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded-sm">
                    {submission.award.category}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={submission.status} />
                </td>
                <td className="px-5 py-4">
                  <p className="text-white/30 text-xs">
                    {formatDate(submission.createdAt)}
                  </p>
                </td>
                {isAdmin && (
                  <td className="px-5 py-4">
                    {submission.user ? (
                      <div>
                        <p className="text-white/50 text-xs">
                          {submission.user.name}
                        </p>
                        <p className="text-white/20 text-[11px] mt-0.5">
                          {submission.user.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-white/15 text-xs">—</span>
                    )}
                  </td>
                )}
                {isAdmin && onStatusChange && (
                  <td className="px-5 py-4">
                    {submission.status === "PENDING" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleStatusChange(submission.id, "APPROVED")
                          }
                          disabled={updatingId === submission.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-emerald-400/80 border border-emerald-400/15 bg-emerald-400/5 hover:bg-emerald-400/10 rounded-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(submission.id, "REJECTED")
                          }
                          disabled={updatingId === submission.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-red-400/70 border border-red-400/15 bg-red-400/5 hover:bg-red-400/10 rounded-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-white/15 text-xs">—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-white/20 text-xs tracking-widest uppercase">
            No {filterStatus.toLowerCase()} submissions
          </div>
        )}
      </div>
      <div className="md:hidden flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-center py-10 text-white/20 text-xs tracking-widest uppercase">
            No {filterStatus.toLowerCase()} submissions
          </p>
        ) : (
          filtered.map((submission) => (
            <div
              key={submission.id}
              className="border border-white/5 bg-white/[0.02] rounded-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId === submission.id ? null : submission.id
                  )
                }
                className="w-full flex items-start justify-between gap-4 p-4 text-left"
              >
                <div className="min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">
                    {submission.companyName}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5 truncate">
                    {submission.award.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={submission.status} />
                  <svg
                    className={`w-3.5 h-3.5 text-white/20 transition-transform duration-200 ${
                      expandedId === submission.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              </button>
              {expandedId === submission.id && (
                <div className="px-4 pb-4 border-t border-white/5 pt-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-white/20 mb-1">
                        Category
                      </p>
                      <span className="inline-block text-[10px] font-semibold tracking-[0.15em] uppercase text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded-sm">
                        {submission.award.category}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-white/20 mb-1">
                        Year
                      </p>
                      <p className="text-white/50 text-xs">
                        {submission.award.year}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-white/20 mb-1">
                        Contact
                      </p>
                      <p className="text-white/50 text-xs">
                        {submission.contactName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-white/20 mb-1">
                        Submitted
                      </p>
                      <p className="text-white/50 text-xs">
                        {formatDate(submission.createdAt)}
                      </p>
                    </div>
                  </div>
                  {isAdmin && submission.user && (
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-white/20 mb-1">
                        Submitted By
                      </p>
                      <p className="text-white/50 text-xs">
                        {submission.user.name} · {submission.user.email}
                      </p>
                    </div>
                  )}
                  {isAdmin &&
                    onStatusChange &&
                    submission.status === "PENDING" && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() =>
                            handleStatusChange(submission.id, "APPROVED")
                          }
                          disabled={updatingId === submission.id}
                          className="flex-1 py-2.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-emerald-400/80 border border-emerald-400/15 bg-emerald-400/5 hover:bg-emerald-400/10 rounded-sm transition-all duration-200 disabled:opacity-40"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(submission.id, "REJECTED")
                          }
                          disabled={updatingId === submission.id}
                          className="flex-1 py-2.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-red-400/70 border border-red-400/15 bg-red-400/5 hover:bg-red-400/10 rounded-sm transition-all duration-200 disabled:opacity-40"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
