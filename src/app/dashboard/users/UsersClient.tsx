"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const P = {
  surface: "var(--surface-card)",
  border: "var(--border-dim)",
  gold: "#c9a84c",
  textPrimary: "var(--text-hi)",
  textMuted: "var(--text-lo)",
} as const;

const inputStyle: React.CSSProperties = {
  background: "var(--surface-hover)",
  border: "1px solid var(--border-dim)",
  color: P.textPrimary,
  fontSize: "0.82rem",
  padding: "0.55rem 0.85rem",
  outline: "none",
  borderRadius: 3,
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.58rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: P.textMuted,
  marginBottom: "0.35rem",
  display: "block",
};

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan: string;
  createdAt: string;
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    ADMIN: { bg: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "rgba(201,168,76,0.3)" },
    USER: { bg: "var(--border-faint)", color: "var(--text-lo)", border: "var(--border-dim)" },
  };
  const s = styles[role] ?? styles.USER;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.18rem 0.5rem", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: 3, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {role}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const isPaid = plan !== "FREE";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.18rem 0.5rem", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: 3, background: isPaid ? "rgba(201,168,76,0.08)" : "var(--surface-hover)", color: isPaid ? P.gold : P.textMuted, border: `1px solid ${isPaid ? "rgba(201,168,76,0.2)" : "var(--border-faint)"}` }}>
      {plan}
    </span>
  );
}

export default function UsersClient({ users: initial }: { users: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) return;
    setCreating(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setError(data.error ?? "Failed to create user."); return; }
    setUsers((prev) => [{ ...data.user, plan: "FREE", createdAt: data.user.createdAt }, ...prev]);
    setForm({ name: "", email: "", password: "", role: "USER" });
    setSuccess(`Account created for ${data.user.email}`);
    router.refresh();
  }

  const thStyle: React.CSSProperties = { padding: "0.6rem 1rem", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: P.textMuted, textAlign: "left", borderBottom: `1px solid ${P.border}`, whiteSpace: "nowrap" };
  const tdStyle: React.CSSProperties = { padding: "0.75rem 1rem", fontSize: "0.72rem", color: P.textMuted, borderBottom: "1px solid var(--surface-hover)", verticalAlign: "middle" };

  return (
    <>
      {/* Create user form */}
      <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, padding: "1.25rem 1.5rem" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: P.gold, marginBottom: "1rem" }}>
          Grant Access — Create Account
        </p>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Full Name <span style={{ color: P.gold }}>*</span></label>
              <input style={inputStyle} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" required />
            </div>
            <div>
              <label style={labelStyle}>Email Address <span style={{ color: P.gold }}>*</span></label>
              <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" required />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Temporary Password <span style={{ color: P.gold }}>*</span></label>
              <input type="password" style={inputStyle} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Min. 8 characters" required minLength={8} />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button type="submit" disabled={creating} style={{ padding: "0.55rem 1.2rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "var(--surface-page)", border: "none", borderRadius: 3, cursor: creating ? "not-allowed" : "pointer", opacity: creating ? 0.7 : 1 }}>
              {creating ? "Creating…" : "Create Account"}
            </button>
            {error && <p style={{ fontSize: "0.72rem", color: "#f87171", margin: 0 }}>{error}</p>}
            {success && <p style={{ fontSize: "0.72rem", color: "#34d399", margin: 0 }}>{success}</p>}
          </div>
        </form>
      </div>

      {/* Users table */}
      <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 4, overflow: "hidden" }}>
        {users.length === 0 ? (
          <p style={{ padding: "2.5rem", textAlign: "center", color: P.textMuted, fontSize: "0.78rem", margin: 0 }}>No users yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface-subtle)" }}>
                  <th style={thStyle}>Name / Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Plan</th>
                  <th style={thStyle}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} style={{ background: idx % 2 === 0 ? "transparent" : "var(--surface-subtle)" }}>
                    <td style={{ ...tdStyle, color: P.textPrimary }}>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: "0.74rem" }}>{user.name ?? "—"}</p>
                      <p style={{ margin: "0.15rem 0 0", fontSize: "0.62rem", color: P.textMuted }}>{user.email}</p>
                    </td>
                    <td style={tdStyle}><RoleBadge role={user.role} /></td>
                    <td style={tdStyle}><PlanBadge plan={user.plan} /></td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(user.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
