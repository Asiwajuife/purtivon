"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[PublicError]", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "4rem 2rem",
    }}>
      <p style={{
        fontFamily: "var(--font-serif)",
        fontSize: "6rem",
        fontWeight: 300,
        color: "rgba(201,168,76,0.35)",
        lineHeight: 1,
        marginBottom: "1.5rem",
        userSelect: "none",
      }}>
        500
      </p>
      <h1 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(1.4rem, 3vw, 2rem)",
        fontWeight: 300,
        marginBottom: "0.75rem",
      }}>
        Something went wrong
      </h1>
      <p style={{
        color: "var(--text-lo)",
        marginBottom: "2.5rem",
        maxWidth: 380,
        lineHeight: 1.7,
        fontSize: "0.9rem",
      }}>
        An unexpected error occurred loading this page. Please try again or return home.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          className="btn btn-primary"
        >
          Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Return home
        </Link>
      </div>
      {error.digest && (
        <p style={{ marginTop: "2rem", fontSize: "0.65rem", color: "var(--text-5)", fontFamily: "var(--font-mono)" }}>
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
