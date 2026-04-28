"use client";
import { useState } from "react";
import SubmissionTable from "@/components/dashboard/SubmissionTable";

type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

interface Award { id: string; title: string; category: string; year: number; }
interface Submission {
  id: string; companyName: string; contactName: string; contactEmail: string;
  status: SubmissionStatus; createdAt: string; award: Award;
  user?: { id: string; name: string; email: string };
}

interface Props { submissions: Submission[]; isAdmin: boolean; }

export default function SubmissionsClient({ submissions: initial, isAdmin }: Props) {
  const [submissions, setSubmissions] = useState(initial);

  async function handleStatusChange(id: string, status: SubmissionStatus) {
    const res = await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete submission");
    setSubmissions(prev => prev.filter(s => s.id !== id));
  }

  return (
    <SubmissionTable
      submissions={submissions}
      isAdmin={isAdmin}
      onStatusChange={isAdmin ? handleStatusChange : undefined}
      onDelete={isAdmin ? handleDelete : undefined}
    />
  );
}
