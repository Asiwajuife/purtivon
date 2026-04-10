import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ARTICLES } from "@/app/api/articles/route";
import TipTapRenderer from "@/components/editor/TipTapRenderer";
import type { JSONContent } from "@tiptap/react";

async function getArticle(slug: string) {
  // Database first — only published articles are public
  const dbArticle = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true, title: true, slug: true, content: true,
      excerpt: true, readTime: true, createdAt: true, coverImage: true,
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  });
  if (dbArticle) return { ...dbArticle, isRichContent: true };

  // Fall back to static seed articles
  const staticArticle = ARTICLES.find((a) => a.slug === slug);
  if (!staticArticle) return null;

  return {
    id: staticArticle.id,
    title: staticArticle.title,
    slug: staticArticle.slug,
    content: null,
    excerpt: staticArticle.excerpt,
    readTime: staticArticle.readTime,
    createdAt: new Date(staticArticle.publishedAt),
    coverImage: staticArticle.coverImage,
    author: { name: staticArticle.author },
    category: { name: staticArticle.category },
    isRichContent: false,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article Not Found" };
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://purtivon.com';
  const url = `${baseUrl}/insights/${slug}`;
  const description = article.excerpt ?? undefined;
  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description,
      images: article.coverImage ? [{ url: article.coverImage }] : [],
      publishedTime: article.createdAt.toISOString(),
      authors: [article.author?.name ?? 'Purtivon Research'],
      tags: [article.category?.name ?? 'Insights'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const date = article.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const authorName = article.author?.name ?? "Purtivon Research";
  const authorInitials = authorName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const category = article.category?.name ?? "General";

  const richContent = article.isRichContent ? (article.content as JSONContent | null) : null;
  const hasContent = richContent && (richContent as { content?: unknown[] }).content && (richContent as { content: unknown[] }).content.length > 0;

  return (
    <div className="flex-1">

      {/* Full-bleed hero */}
      <div style={{ position: "relative", width: "100%", height: "clamp(420px, 60vh, 680px)", overflow: "hidden" }}>
        {article.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.72) 40%, rgba(10,10,15,0.25) 75%, rgba(10,10,15,0.15) 100%)" }} />
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0f0f16 0%, #141420 100%)" }} />
        )}

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2.5rem clamp(1.25rem, 5vw, 5rem) 2.5rem" }}>
          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Link href="/insights" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Insights
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem" }}>/</span>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{category}</span>
          </nav>

          {/* Category badge */}
          <div style={{ marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", background: "rgba(201,168,76,0.15)", padding: "0.3rem 0.8rem" }}>
              {category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem, 3.5vw, 3rem)", fontWeight: 300, lineHeight: 1.15, color: "#f0ede6", maxWidth: 820, marginBottom: "1rem" }}>
            {article.title}
          </h1>

          {/* Meta row */}
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
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3.5rem 2.5rem 7rem" }}>

        {/* Excerpt lead */}
        {article.excerpt && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.75, color: "rgba(240,237,230,0.8)", marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {article.excerpt}
          </p>
        )}

        {/* Gold accent rule */}
        <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, #c9a84c, transparent)", marginBottom: "2.5rem" }} />

        {/* Content */}
        {hasContent ? (
          <TipTapRenderer content={richContent} />
        ) : (
          /* Static fallback for seed articles */
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <p className="body-lg" style={{ lineHeight: 1.9 }}>
              This analysis draws on data from central banks, multilateral development institutions, and
              investment promotion agencies across the relevant markets. Our research team has synthesised
              findings from over 200 proprietary sources to deliver the intelligence presented here.
            </p>
            <p className="body-lg" style={{ lineHeight: 1.9 }}>
              The trends identified in this report reflect both short-term market dynamics and longer-term
              structural shifts in the global investment landscape. We believe the implications will be
              material for institutional investors, corporates, and policymakers alike over the coming
              12 to 24 months.
            </p>
            <blockquote style={{ margin: "0.5rem 0", padding: "2rem 2.25rem", borderLeft: "2px solid #c9a84c", background: "rgba(201,168,76,0.03)" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontStyle: "italic", fontWeight: 300, lineHeight: 1.75, color: "#f0ede6" }}>
                &ldquo;The data is unambiguous: capital is moving toward markets that combine political stability,
                regulatory transparency, and credible ESG frameworks.&rdquo;
              </p>
              <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "1rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Purtivon Research Team
              </p>
            </blockquote>
            <p className="body-lg" style={{ lineHeight: 1.9 }}>
              For subscribers seeking the full version of this report, please contact our research team at{" "}
              <a href="mailto:research@purtivon.com" style={{ color: "#c9a84c" }}>research@purtivon.com</a>.
            </p>
          </div>
        )}

        {/* Footer nav */}
        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <Link href="/insights" className="btn btn-outline btn-sm">← All Insights</Link>
          <Link href="/contact" className="btn btn-ghost btn-sm">Enquire About Full Report →</Link>
        </div>
      </div>
    </div>
  );
}
