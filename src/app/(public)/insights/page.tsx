export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Link from "next/link";
import type React from "react";
import { prisma } from "@/lib/prisma";
import { ARTICLES } from "@/app/api/articles/route";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "In-depth analysis, intelligence, and perspectives on FDI trends and global financial services.",
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  readTime: number | null;
  createdAt: Date;
  coverImage: string | null;
  category: { name: string } | null;
};

const ALL_CATEGORIES = [
  "Featured Insight",
  "Awards",
  "Report",
  "Analysis",
  "News",
  "FDI Intelligence",
  "Financial Services Intelligence",
  "Banks",
  "Economy",
  "Tech",
  "ESG",
];

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolved = await searchParams;
  const activeCategory = resolved.category
    ? decodeURIComponent(resolved.category)
    : null;

  const dbArticles: ArticleRow[] = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      ...(activeCategory ? { category: { name: activeCategory } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 48,
    select: {
      id: true, slug: true, title: true, excerpt: true,
      readTime: true, createdAt: true, coverImage: true,
      category: { select: { name: true } },
    },
  });

  const dbSlugs = new Set(dbArticles.map((a) => a.slug));
  const staticArticles: ArticleRow[] = ARTICLES.filter(
    (a) => !dbSlugs.has(a.slug) && (!activeCategory || a.category === activeCategory)
  ).map((a) => ({
    id: a.id, slug: a.slug, title: a.title, excerpt: a.excerpt,
    readTime: a.readTime, createdAt: new Date(a.publishedAt),
    coverImage: a.coverImage, category: { name: a.category },
  }));

  const articles = [...dbArticles, ...staticArticles].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

  return (
    <div style={{ paddingTop: 68, paddingBottom: 80 }}>

      {/* ── Page header ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #03050f 0%, #050810 60%, var(--dark) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "4.5rem 0 3rem",
      }}>
        {/* Gradient mesh */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: [
            "radial-gradient(ellipse 60% 70% at 75% 40%, rgba(201,168,76,0.06) 0%, transparent 60%)",
            "radial-gradient(ellipse 45% 55% at 10% 70%, rgba(59,130,246,0.04) 0%, transparent 55%)",
            "radial-gradient(ellipse 50% 60% at 50% 20%, rgba(201,168,76,0.04) 0%, transparent 65%)",
          ].join(","),
        }} />

        {/* Dot matrix */}
        <div aria-hidden="true" className="dot-matrix" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />

        {/* Gold top line */}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5) 30%, rgba(232,201,122,0.7) 50%, rgba(201,168,76,0.5) 70%, transparent)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem", position: "relative" }}>
          <div className="eyebrow" style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ width: 28, height: 1, background: "var(--gold-dim)", display: "block" }} />
            Intelligence &amp; Analysis
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "flex-end", gap: "2rem" }} className="ins-header-grid">
            <h1 className="display-lg" style={{ maxWidth: 520 }}>
              Global <em>Insights</em>
            </h1>
            <p className="body-sm" style={{ maxWidth: 340, paddingBottom: "0.35rem", color: "var(--text-lo)", lineHeight: 1.8 }}>
              In-depth analysis and perspectives on foreign direct investment,
              financial services, and the forces shaping global capital markets.
            </p>
          </div>
        </div>
      </div>

      {/* ── Scrollable pill filter bar ── */}
      <div style={{
        position: "sticky",
        top: 68,
        zIndex: 40,
        background: "rgba(4,6,18,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem" }}>
          <div style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            padding: "0.875rem 0",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }} className="ins-filter-bar">
            <Link
              href="/insights"
              className="filter-pill"
              style={activeCategory === null ? { background: "var(--gold)", borderColor: "var(--gold)", color: "var(--dark)" } : {}}
            >
              All
            </Link>
            {ALL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Link
                  key={cat}
                  href={`/insights?category=${encodeURIComponent(cat)}`}
                  className="filter-pill"
                  style={isActive ? { background: "var(--gold)", borderColor: "var(--gold)", color: "var(--dark)" } : {}}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Active filter context ── */}
      {activeCategory && (
        <div style={{ maxWidth: 1200, margin: "0.75rem auto 0", padding: "0 2.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-4)" }}>
            {articles.length} {articles.length === 1 ? "article" : "articles"} in
          </span>
          <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)" }}>
            {activeCategory}
          </span>
          <Link href="/insights" style={{
            fontSize: "0.6rem", color: "var(--text-4)", textDecoration: "none",
            border: "1px solid var(--border-faint)", padding: "0.2rem 0.55rem", borderRadius: "var(--radius-sm)",
            transition: "color 0.2s",
          }} className="ins-clear">
            × Clear
          </Link>
        </div>
      )}

      <div className="ins-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 2.5rem 2rem" }}>
        {articles.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "6rem 2rem", textAlign: "center",
            border: "1px solid var(--border-faint)", background: "var(--surface-subtle)",
          }}>
            <p className="display-md" style={{ marginBottom: "0.75rem", color: "var(--text-4)" }}>
              {activeCategory ? `No articles in "${activeCategory}" yet` : "No insights published yet"}
            </p>
            <p className="body-sm">
              {activeCategory ? (
                <Link href="/insights" style={{ color: "var(--gold)", textDecoration: "none" }}>← View all insights</Link>
              ) : (
                "Check back soon for the latest intelligence and analysis."
              )}
            </p>
          </div>
        ) : (
          <>
            {/* ── Featured article — full-width hero card ── */}
            {featured && (
              <Link href={`/insights/${featured.slug}`} style={{ display: "block", marginBottom: "2.5rem", textDecoration: "none" }} className="ins-featured-link">
                <article style={{
                  position: "relative",
                  minHeight: 400,
                  overflow: "hidden",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(10,12,22,0.7)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderTop: "2px solid rgba(201,168,76,0.4)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }} className="ins-featured-card">

                  {/* Left: content */}
                  <div style={{ padding: "2.75rem 3rem", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "2rem", position: "relative", zIndex: 1 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                        <span className="badge badge--glass">{featured.category?.name ?? "General"}</span>
                        <span className="badge badge--outline" style={{ fontSize: "0.56rem" }}>Featured</span>
                      </div>
                      <h2 className="display-md" style={{ marginBottom: "1rem", lineHeight: 1.18 }}>{featured.title}</h2>
                      {featured.excerpt && (
                        <p className="body-sm" style={{ lineHeight: 1.8, color: "var(--text-lo)" }}>{featured.excerpt}</p>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                      <div style={{ display: "flex", gap: "1.25rem" }}>
                        <span style={{ fontSize: "0.68rem", color: "var(--text-4)" }}>
                          {new Date(featured.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                        {featured.readTime && (
                          <span style={{ fontSize: "0.68rem", color: "var(--gold-dim)" }}>{featured.readTime} min read</span>
                        )}
                      </div>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>
                        Read Article
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Right: cover image */}
                  <div style={{ position: "relative", overflow: "hidden", borderLeft: "1px solid rgba(255,255,255,0.06)", minHeight: 360 }}>
                    {featured.coverImage ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          className="ins-feat-img"
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.55s var(--ease-out)" }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,12,22,0.25) 0%, rgba(10,12,22,0.05) 100%)" }} aria-hidden="true" />
                      </>
                    ) : (
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, var(--dark-100) 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <p style={{ fontFamily: "var(--font-serif)", fontSize: "8rem", fontWeight: 300, color: "rgba(201,168,76,0.08)", lineHeight: 1, userSelect: "none" }}>&ldquo;</p>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            )}

            {/* ── Divider ── */}
            {rest.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2rem" }}>
                <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-5)", flexShrink: 0 }}>
                  {rest.length} More {rest.length === 1 ? "Article" : "Articles"}
                </span>
                <div style={{ flex: 1, height: 1, background: "var(--border-faint)" }} />
              </div>
            )}

            {/* ── Article grid ── */}
            {rest.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="ins-grid">
                {rest.map((article) => (
                  <Link key={article.id} href={`/insights/${article.slug}`} style={{ display: "block", textDecoration: "none" }} className="ins-card-link">
                    <article className="ins-card" style={{
                      background: "rgba(10,12,22,0.65)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      transition: "transform 0.28s var(--ease-out), box-shadow 0.28s var(--ease-out), border-color 0.28s",
                    }}>
                      {/* Cover image */}
                      <div style={{ position: "relative", height: 190, overflow: "hidden", flexShrink: 0 }}>
                        {article.coverImage ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="ins-card-img"
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.45s var(--ease-out)" }}
                            />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,12,22,0.4) 0%, transparent 60%)" }} aria-hidden="true" />
                          </>
                        ) : (
                          <div style={{
                            width: "100%", height: "100%",
                            background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, var(--dark-200) 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth={1} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div style={{ padding: "1.25rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                          <span className="badge badge--glass" style={{ fontSize: "0.58rem" }}>
                            {article.category?.name ?? "General"}
                          </span>
                          <span style={{ fontSize: "0.65rem", color: "var(--text-4)", flexShrink: 0 }}>
                            {new Date(article.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                        </div>

                        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 400, lineHeight: 1.38, color: "var(--text-primary)", flex: 1 }}>
                          {article.title}
                        </h3>

                        {article.excerpt && (
                          <p style={{
                            fontSize: "0.78rem", color: "var(--text-lo)", lineHeight: 1.65,
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                          } as React.CSSProperties}>
                            {article.excerpt}
                          </p>
                        )}

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid var(--border-faint)", marginTop: "auto" }}>
                          {article.readTime && (
                            <span style={{ fontSize: "0.65rem", color: "var(--text-4)" }}>{article.readTime} min read</span>
                          )}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.45)" strokeWidth={2} style={{ marginLeft: "auto" }} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .ins-filter-bar::-webkit-scrollbar { display: none; }
        .ins-featured-card:hover { border-color: rgba(201,168,76,0.35) !important; box-shadow: 0 12px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,168,76,0.12) !important; }
        .ins-featured-link:hover .ins-feat-img { transform: scale(1.04); }
        .ins-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,168,76,0.15) !important; border-color: rgba(201,168,76,0.22) !important; }
        .ins-card-link:hover .ins-card-img { transform: scale(1.06); }
        .ins-clear:hover { color: var(--text-mid) !important; }
        @media (max-width: 900px) {
          .ins-featured-card { grid-template-columns: 1fr !important; }
          .ins-featured-card > div:last-child { min-height: 220px !important; }
          .ins-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ins-header-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .ins-grid { grid-template-columns: 1fr !important; }
          .ins-content { padding: 1.5rem 1.25rem !important; }
          .ins-featured-card { min-height: 280px !important; }
        }
      `}</style>
    </div>
  );
}
