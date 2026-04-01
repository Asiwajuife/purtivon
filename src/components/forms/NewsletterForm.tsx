"use client";
import { useState } from "react";
interface NewsletterFormProps {
  variant?: "inline" | "stacked";
  placeholder?: string;
  className?: string;
}
export default function NewsletterForm({
  variant = "inline",
  placeholder = "Enter your email address",
  className = "",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Subscription failed.");
      setSuccess(true);
      setEmail("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  if (success) {
    return (
      <div
        className={`flex flex-col items-center gap-3 py-6 text-center ${className}`}
      >
        <div className="w-10 h-10 rounded-full border border-[#c9a84c]/25 bg-[#c9a84c]/[0.08] flex items-center justify-center">
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
        <div>
          <p
            className="text-white/80 font-light text-lg mb-1"
            style={{
              fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
            }}
          >
            You&apos;re subscribed
          </p>
          <p className="text-white/30 text-xs tracking-wide">
            Thank you. You&apos;ll receive our latest insights and updates.
          </p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="mt-1 text-[10px] tracking-[0.15em] uppercase text-white/20 hover:text-[#c9a84c]/60 transition-colors duration-200"
        >
          Subscribe another address
        </button>
      </div>
    );
  }
  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm placeholder-white/20 px-4 py-3 rounded-sm focus:outline-none focus:border-[#c9a84c]/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass =
    "block text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25 mb-1.5";
  if (variant === "stacked") {
    return (
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-3 ${className}`}
      >
        <div>
          <label htmlFor="newsletter-name" className={labelClass}>
            Full Name{" "}
            <span className="text-white/15 normal-case tracking-normal font-normal">
              (optional)
            </span>
          </label>
          <input
            id="newsletter-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="Jane Smith"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="newsletter-email-stacked" className={labelClass}>
            Email Address <span className="text-[#c9a84c]">*</span>
          </label>
          <input
            id="newsletter-email-stacked"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            required
            placeholder={placeholder}
            className={inputClass}
          />
        </div>
        {error && (
          <p className="text-red-400/70 text-xs tracking-wide border border-red-400/10 bg-red-400/5 px-3 py-2.5 rounded-sm">
            {error}
          </p>
        )}
        <button
          type="submit"
        >
          disabled={loading}
          className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0f] text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          {loading ? (
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
          ) : (
            <>
              Subscribe
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </>
          )}
        </button>
        <p className="text-white/15 text-[10px] tracking-wide text-center">
          No spam. Unsubscribe at any time.
        </p>
      </form>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 ${className}`}
    >
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          required
          placeholder={placeholder}
          className="flex-1 bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm placeholder-white/20 px-4 py-3 rounded-sm focus:outline-none focus:border-[#c9a84c]/40 focus:bg-white/[0.05] transition-all duration-200"
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Subscribe"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0f] text-xs font-bold tracking-[0.18em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
        >
          {loading ? (
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
          ) : (
            <>
              <span className="hidden sm:inline">Subscribe</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-400/70 text-xs tracking-wide border border-red-400/10 bg-red-400/5 px-3 py-2.5 rounded-sm">
          {error}
        </p>
      )}
      <p className="text-white/15 text-[10px] tracking-wide">
        No spam. Unsubscribe at any time.
      </p>
    </form>
  );
}
