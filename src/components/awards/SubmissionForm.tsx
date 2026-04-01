"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface Award {
  id: string;
  title: string;
  category: string;
  year: number;
}
interface SubmissionFormProps {
  awards: Award[];
  isAuthenticated: boolean;
}
interface FormState {
  awardId: string;
  companyName: string;
  companyWebsite: string;
  contactName: string;
  contactEmail: string;
  details: string;
  additionalInfo: string;
}
const INITIAL_STATE: FormState = {
  awardId: "",
  companyName: "",
  companyWebsite: "",
  contactName: "",
  contactEmail: "",
  details: "",
  additionalInfo: "",
};
export default function SubmissionForm({
  awards,
  isAuthenticated,
}: SubmissionFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");
      setSuccess(true);
      setForm(INITIAL_STATE);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm placeholder-white/20 px-4 py-3 rounded-sm focus:outline-none focus:border-[#c9a84c]/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass =
    "block text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-1.5";
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-4 p-6 border border-white/5 bg-white/[0.02] rounded-sm text-center">
        <div className="w-10 h-10 rounded-full border border-[#c9a84c]/20 flex items-center justify-center mx-auto">
          <svg
            className="w-4 h-4 text-[#c9a84c]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
        <p
          className="text-white/70 font-light text-lg"
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
          }}
        >
          Login to Submit
        </p>
        <p className="text-white/30 text-xs leading-relaxed">
          You must be signed in to submit an award entry.
        </p>
        <Link
          href="/login"
          className="mt-2 flex items-center justify-center py-3 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0f] text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:opacity-90 transition-opacity"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="flex items-center justify-center py-3 border border-white/10 text-white/40 text-xs font-medium tracking-[0.15em] uppercase rounded-sm hover:border-white/20 hover:text-white/60 transition-all"
        >
          Create Account
        </Link>
      </div>
    );
  }
  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 border border-[#c9a84c]/20 bg-[#c9a84c]/5 rounded-sm text-center">
        <div className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-[#c9a84c]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
        <p
          className="text-white/80 font-light text-lg"
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
          }}
        >
          Entry Submitted
        </p>
        <p className="text-white/30 text-xs leading-relaxed">
          Thank you. Your submission has been received and is under review.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs tracking-[0.15em] uppercase text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 p-6 border border-white/5 bg-white/[0.02] rounded-sm"
    >
      <div>
        <label htmlFor="awardId" className={labelClass}>
          Award Category <span className="text-[#c9a84c]">*</span>
        </label>
        <select
          id="awardId"
          name="awardId"
          value={form.awardId}
          onChange={handleChange}
          required
          className={`${inputClass} cursor-pointer`}
        >
          <option value="" disabled className="bg-[#0a0a0f]">
            Select an award…
          </option>
          {awards.map((award) => (
            <option key={award.id} value={award.id} className="bg-[#0a0a0f]">
              {award.title} ({award.year})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="companyName" className={labelClass}>
          Company Name <span className="text-[#c9a84c]">*</span>
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={form.companyName}
          onChange={handleChange}
          required
          placeholder="Acme Corporation"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="companyWebsite" className={labelClass}>
          Company Website
        </label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="url"
          value={form.companyWebsite}
          onChange={handleChange}
          placeholder="https://example.com"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="contactName" className={labelClass}>
          Contact Name <span className="text-[#c9a84c]">*</span>
        </label>
        <input
          id="contactName"
          name="contactName"
          type="text"
          value={form.contactName}
          onChange={handleChange}
          required
          placeholder="Jane Smith"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="contactEmail" className={labelClass}>
          Contact Email <span className="text-[#c9a84c]">*</span>
        </label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={form.contactEmail}
          onChange={handleChange}
          required
          placeholder="jane@example.com"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="details" className={labelClass}>
          Submission Details <span className="text-[#c9a84c]">*</span>
        </label>
        <textarea
          id="details"
          name="details"
          value={form.details}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Describe why your organisation deserves this award…"
          className={`${inputClass} resize-none`}
        />
      </div>
      <div>
        <label htmlFor="additionalInfo" className={labelClass}>
          Additional Information
        </label>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          value={form.additionalInfo}
          onChange={handleChange}
          rows={2}
          placeholder="Any supporting evidence or links…"
          className={`${inputClass} resize-none`}
        />
      </div>
      {error && (
        <p className="text-red-400/80 text-xs tracking-wide border border-red-400/10 bg-red-400/5 px-4 py-3 rounded-sm">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0f] text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        {loading ? (
          <>
            <svg
              className="w-3.5 h-3.5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Submitting…
          </>
        ) : (
          "Submit Entry"
        )}
      </button>
    </form>
  );
}
