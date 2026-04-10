"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '340px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontSize: '0.85rem',
              fontWeight: 300,
              color: '#d4a843',
            }}>
              Purtivon
            </span>
          </Link>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: '#f0ede6', letterSpacing: '0.02em', marginBottom: '0.25rem' }}>
            Sign In
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
            Access your Purtivon account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#141420',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 4,
          padding: '1.5rem',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.4rem' }}>
                Email
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
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.8rem', padding: '0.55rem 0.75rem', outline: 'none',
                  borderRadius: 3, boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor="password" style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                  Password
                </label>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>
                  Forgot password?
                </span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.8rem', padding: '0.55rem 0.75rem', outline: 'none',
                  borderRadius: 3, boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <p style={{ fontSize: '0.72rem', color: '#f87171', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', padding: '0.5rem 0.75rem', borderRadius: 3 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.65rem',
                background: 'linear-gradient(90deg, #c9a84c, #e8c97a)',
                color: '#0a0a0f', fontSize: '0.7rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                border: 'none', borderRadius: 3, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1, marginTop: '0.25rem',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.15)', marginTop: '1rem', letterSpacing: '0.05em' }}>
          Access is by invitation only
        </p>
      </div>
    </div>
  );
}
