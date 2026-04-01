"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
  if (score <= 3) return { score, label: "Fair", color: "bg-yellow-400" };
  return { score, label: "Strong", color: "bg-emerald-400" };
}
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const strength = getPasswordStrength(form.password);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed.");
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm placeholder-white/20 px-4 py-3.5 rounded-sm focus:outline-none focus:border-[#c9a84c]/40 focus:bg-white/[0.05] transition-all duration-200";
  const labelClass =
    "block text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-1.5";
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#0a0a0f]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/[0.03] blur-[120px]" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <Link
          >
            href="/"
            className="flex items-center gap-2.5 mb-8 select-none group"
            <span className="relative flex items-center justify-center w-8 h-8">
              <span className="absolute inset-0 rounded-sm bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] opacity-90" />
              <span className="relative text-[#0a0a0f] font-black text-sm leading-none">
                P
              </span>
            </span>
            <span
              className="text-white/60 group-hover:text-white/80 font-light tracking-[0.25em] uppercase text-sm transition-colors duration-200"
              style={{
                fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
              }}
            >
              Purtivon
            </span>
          </Link>
          <h1
            className="text-3xl font-light text-white tracking-wide mb-2"
            style={{
              fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
            }}
          >
            Request Access
          </h1>
          <p className="text-white/30 text-xs tracking-wide">
            Create your account to get started
          </p>
        </div>
        <div className="border border-white/5 bg-white/[0.02] rounded-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="Jane Smith"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                className={inputClass}
              />
              {form.password && (
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score
                            ? strength.color
                            : "bg-white/[0.08]"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] tracking-widest uppercase font-medium ${
                      strength.score <= 1
                        ? "text-red-400/70"
                        : strength.score <= 3
                        ? "text-yellow-400/70"
                        : "text-emerald-400/70"
                    }`}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Repeat your password"
                className={`${inputClass} ${
                  form.confirmPassword &&
                  form.password !== form.confirmPassword
                    ? "border-red-400/30"
                    : form.confirmPassword &&
                      form.password === form.confirmPassword
                    ? "border-emerald-400/30"
                    : ""
                }`}
              />
              {form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <p className="mt-1.5 text-[10px] text-red-400/60 tracking-wide">
                    Passwords do not match
                  </p>
                )}
            </div>
            <p className="text-white/20 text-[11px] leading-relaxed tracking-wide">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-[#c9a84c]/50 hover:text-[#c9a84c] transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-[#c9a84c]/50 hover:text-[#c9a84c] transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 border border-red-400/10 bg-red-400/5 rounded-sm">
                <svg
                  className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
                <p className="text-red-400/80 text-xs leading-relaxed">
                  {error}
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2.5 w-full py-4 mt-1 bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#0a0a0f] text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
FILE: src/app/(public)/layout.tsx
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
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
        <p className="text-center text-white/25 text-xs tracking-wide mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
