import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TipTapRenderer from "@/components/editor/TipTapRenderer";
import type { JSONContent } from "@tiptap/react";

export const metadata: Metadata = { title: "Article Preview" };

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  REVIEW: "In Review",
  PUBLISHED: "Published",
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "rgba(255,255,255,0.35)",
  REVIEW: "#f59e0b",
  PUBLISHED: "#c9a84c",
};

export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, email: true } },
      category: { select: { name: true } },
    },
  });

  if (!article) notFound();

  const date = article.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const authorName = article.author.name ?? article.author.email;
  const authorInitials = authorName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const category = article.category?.name ?? "General";
  const content = article.content as JSONContent | null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>

      {/* Preview banner */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.65rem 1.5rem",
        background: "rgba(10,10,15,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.2rem 0.6rem", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", borderRadius: 3 }}>
            Preview
          </span>
          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>
            This is how the article will appear when published
          </span>
          <span style={{
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "0.18rem 0.55rem",
            borderRadius: 3,
            color: STATUS_COLOR[article.status] ?? "rgba(255,255,255,0.35)",
            background: `${STATUS_COLOR[article.status]}18`,
            border: `1px solid ${STATUS_COLOR[article.status]}33`,
          }}>
            {STATUS_LABEL[article.status] ?? article.status}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link
            href={`/dashboard/articles/${id}`}
            style={{
              padding: "0.4rem 1rem",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
              color: "#0a0a0f",
              borderRadius: 3,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            ← Back to Editor
          </Link>
        </div>
      </div>

      {/* Full-bleed hero */}
      <div style={{ position: "relative", width: "100%", height: "clamp(380px, 55vh, 620px)", overflow: "hidden" }}>
        {article.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.72) 40%, rgba(10,10,15,0.2) 100%)" }} />
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0f0f16 0%, #141420 100%)" }} />
        )}

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2.5rem clamp(1.5rem, 5vw, 5rem)" }}>
          {/* Category badge */}
          <div style={{ marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", background: "rgba(201,168,76,0.15)", padding: "0.3rem 0.8rem" }}>
              {category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.6rem, 3.5vw, 3rem)",
            fontWeight: 300,
            lineHeight: 1.15,
            color: "#f0ede6",
            maxWidth: 820,
            marginBottom: "1rem",
          }}>
            {article.title}
          </h1>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.58rem", fontWeight: 700, color: "#c9a84c" }}>
                {authorInitials}
              </div>
              <span style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.65)" }}>{authorName}</span>
            </div>
            <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)", display: "block" }} />
            <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>{date}</span>
            {article.readTime && (
              <>
                <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.15)", display: "block" }} />
                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>{article.readTime} min read</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3.5rem 2.5rem 8rem" }}>

        {/* Excerpt lead */}
        {article.excerpt && (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
            fontStyle: "italic",
            fontWeight: 300,
            lineHeight: 1.75,
            color: "rgba(240,237,230,0.8)",
            marginBottom: "2.5rem",
            paddingBottom: "2.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            {article.excerpt}
          </p>
        )}

        {/* Gold accent */}
        <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, #c9a84c, transparent)", marginBottom: "2.5rem" }} />

        {/* Rich content */}
        {content && (content as { content?: unknown[] }).content && (content as { content: unknown[] }).content.length > 0 ? (
          <TipTapRenderer content={content} />
        ) : (
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
            No content written yet. Go back to the editor to add content.
          </p>
        )}

        {/* Bottom nav */}
        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href={`/dashboard/articles/${id}`}
            style={{
              padding: "0.55rem 1.2rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
              color: "#0a0a0f",
              borderRadius: 3,
              textDecoration: "none",
            }}
          >
            ← Back to Editor
          </Link>
          <Link
            href="/dashboard/articles"
            style={{
              padding: "0.55rem 1.2rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "transparent",
              color: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 3,
              textDecoration: "none",
            }}
          >
            All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
