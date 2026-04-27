"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

const PALETTE = {
  surface: "#141420",
  border: "rgba(255,255,255,0.07)",
  gold: "#c9a84c",
  textPrimary: "#f0ede6",
  textMuted: "rgba(255,255,255,0.35)",
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)",
  fontSize: "0.8rem", padding: "0.55rem 0.75rem", outline: "none",
  borderRadius: 3, boxSizing: "border-box", fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.62rem", fontWeight: 600,
  letterSpacing: "0.15em", textTransform: "uppercase",
  color: PALETTE.textMuted, marginBottom: "0.4rem",
};

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const body: Record<string, string> = { name };
      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        await update({ name: data.name });
        setSuccess("Settings saved successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 560 }}>
      {/* Header */}
      <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: PALETTE.gold, marginBottom: "0.3rem" }}>Account</span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: PALETTE.textPrimary, letterSpacing: "0.01em", margin: 0 }}>Settings</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Profile */}
        <div style={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 4, padding: "1.25rem 1.4rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: PALETTE.textMuted }}>Profile</span>

          <div>
            <label style={labelStyle}>Display Name</label>
            <input style={inputStyle} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input style={{ ...inputStyle, opacity: 0.45, cursor: "not-allowed" }} type="email" value={session?.user?.email ?? ""} disabled />
            <p style={{ fontSize: "0.6rem", color: PALETTE.textMuted, marginTop: "0.35rem" }}>Email cannot be changed here.</p>
          </div>
        </div>

        {/* Password */}
        <div style={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 4, padding: "1.25rem 1.4rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: PALETTE.textMuted }}>Change Password</span>

          <div>
            <label style={labelStyle}>Current Password</label>
            <input style={inputStyle} type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input style={inputStyle} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
          </div>
          <div>
            <label style={labelStyle}>Confirm New Password</label>
            <input style={inputStyle} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
          </div>
        </div>

        {error && (
          <p style={{ fontSize: "0.72rem", color: "#f87171", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", padding: "0.5rem 0.75rem", borderRadius: 3, margin: 0 }}>{error}</p>
        )}
        {success && (
          <p style={{ fontSize: "0.72rem", color: "#4ade80", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", padding: "0.5rem 0.75rem", borderRadius: 3, margin: 0 }}>{success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ alignSelf: "flex-start", padding: "0.65rem 1.5rem", background: "linear-gradient(90deg,#c9a84c,#e8c97a)", color: "#0a0a0f", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", border: "none", borderRadius: 3, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}
        >
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
