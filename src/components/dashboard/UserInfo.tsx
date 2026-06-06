"use client";

export default function UserInfo({ user }: { user: { name?: string | null; email?: string | null } }) {
  const initials = user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "U";
  return (
    <>
      <span className="text-white/25 text-xs hidden sm:block truncate max-w-[160px]">{user.email}</span>
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06))", border: "1px solid rgba(201,168,76,0.28)" }}>
        <span style={{ color: "#c9a84c", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.04em" }}>
          {initials}
        </span>
      </div>
    </>
  );
}
