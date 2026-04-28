"use client";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        width: 48,
        height: 26,
        borderRadius: 13,
        padding: "3px",
        border: "1px solid",
        borderColor: isDark ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.4)",
        background: isDark
          ? "rgba(201,168,76,0.08)"
          : "rgba(201,168,76,0.18)",
        cursor: "pointer",
        transition: "background 0.25s ease, border-color 0.25s ease",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Moon label (left side, visible in dark mode) */}
      <svg
        width="10" height="10" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth={2}
        style={{
          position: "absolute", left: 6,
          opacity: isDark ? 0.7 : 0,
          transition: "opacity 0.2s",
          pointerEvents: "none",
        }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      {/* Sun label (right side, visible in light mode) */}
      <svg
        width="10" height="10" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth={2}
        style={{
          position: "absolute", right: 6,
          opacity: isDark ? 0 : 0.8,
          transition: "opacity 0.2s",
          pointerEvents: "none",
        }}
      >
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Sliding thumb */}
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "var(--gold)",
          transform: isDark ? "translateX(0)" : "translateX(22px)",
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          flexShrink: 0,
          boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
          display: "block",
        }}
      />
    </button>
  );
}
