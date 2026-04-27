export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Link from "next/link";
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

  // DB articles (admin-created, published) — optionally filtered by category
  const dbArticles: ArticleRow[] = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      ...(activeCategory
        ? { category: { name: activeCategory } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 48,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      readTime: true,
      createdAt: true,
      coverImage: true,
      category: { select: { name: true } },
    },
  });

  // Normalize static articles to the same shape
  const dbSlugs = new Set(dbArticles.map((a) => a.slug));
  const staticArticles: ArticleRow[] = ARTICLES.filter(
    (a) =>
      !dbSlugs.has(a.slug) &&
      (!activeCategory || a.category === activeCategory)
  ).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    readTime: a.readTime,
    createdAt: new Date(a.publishedAt),
    coverImage: a.coverImage,
    category: { name: a.category },
  }));

  // Merge and sort newest-first
  const articles = [...dbArticles, ...staticArticles].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

  return (
    <div className="flex-1">
      {/* Hero header */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "5rem 2.5rem 3.5rem",
          maxWidth: 1160,
          margin: "0 auto",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: "1.25rem" }}>
          Intelligence & Analysis
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "flex-end",
            gap: "3rem",
          }}
          className="insights-header-grid"
        >
          <h1 className="display-lg" style={{ maxWidth: 560 }}>
            Global <em>Insights</em>
          </h1>
          <p
            className="body-sm"
            style={{ maxWidth: 340, paddingBottom: "0.35rem" }}
          >
            In-depth analysis and perspectives on foreign direct investment,
            financial services, and the forces shaping global capital markets.
          </p>
        </div>
      </div>

      {/* Category filter strip */}
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: "1.5rem 2.5rem 0",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Link
          href="/insights"
          style={{
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "0.35rem 0.8rem",
            textDecoration: "none",
            borderRadius: 2,
            transition: "all 0.2s",
            ...(activeCategory === null
              ? {
                  background: "#c9a84c",
                  color: "#0a0a0f",
                  border: "1px solid #c9a84c",
                }
              : {
                  background: "transparent",
                  color: "rgba(255,255,255,0.35)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }),
          }}
          className="cat-pill"
        >
          All
        </Link>
        {ALL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <Link
              key={cat}
              href={`/insights?category=${encodeURIComponent(cat)}`}
              style={{
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "0.35rem 0.8rem",
                textDecoration: "none",
                borderRadius: 2,
                transition: "all 0.2s",
                ...(isActive
                  ? {
                      background: "#c9a84c",
                      color: "#0a0a0f",
                      border: "1px solid #c9a84c",
                    }
                  : {
                      background: "transparent",
                      color: "rgba(255,255,255,0.35)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }),
              }}
              className="cat-pill"
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Active filter label */}
      {activeCategory && (
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "1rem 2.5rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Showing {articles.length}{" "}
            {articles.length === 1 ? "article" : "articles"} in
          </span>
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#c9a84c",
            }}
          >
            {activeCategory}
          </span>
          <Link
            href="/insights"
            style={{
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.2)",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "0.2rem 0.5rem",
              borderRadius: 2,
            }}
            className="cat-clear"
          >
            ✕ Clear
          </Link>
        </div>
      )}

      <div
        style={{ maxWidth: 1160, margin: "0 auto", padding: "2.5rem 2.5rem 6rem" }}
      >
        {articles.length === 0 ? (
          /* Empty state */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "6rem 2rem",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                />
              </svg>
            </div>
            <p
              className="display-md"
              style={{
                marginBottom: "0.5rem",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {activeCategory
                ? `No articles in "${activeCategory}" yet`
                : "No insights published yet"}
            </p>
            <p className="body-sm">
              {activeCategory ? (
                <Link
                  href="/insights"
                  style={{ color: "#c9a84c", textDecoration: "none" }}
                >
                  ← View all insights
                </Link>
              ) : (
                "Check back soon for the latest intelligence and analysis."
              )}
            </p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <Link
                href={`/insights/${featured.slug}`}
                style={{ display: "block", marginBottom: "2.5rem" }}
              >
                <article
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    transition: "border-color 0.3s, background 0.3s",
                  }}
                  className="featured-card"
                >
                  {/* Left: content */}
                  <div
                    style={{
                      padding: "2.75rem 3rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "2rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.62rem",
                            fontWeight: 600,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "#c9a84c",
                            background: "rgba(201,168,76,0.1)",
                            padding: "0.3rem 0.75rem",
                          }}
                        >
                          {featured.category?.name ?? "General"}
                        </span>
                        <span
                          style={{
                            fontSize: "0.62rem",
                            fontWeight: 600,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.25)",
                            background: "rgba(255,255,255,0.06)",
                            padding: "0.3rem 0.75rem",
                          }}
                        >
                          Featured
                        </span>
                      </div>
                      <h2
                        className="display-md"
                        style={{ marginBottom: "1rem" }}
                      >
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p
                          className="body-sm"
                          style={{ lineHeight: 1.8 }}
                        >
                          {featured.excerpt}
                        </p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", gap: "1.25rem" }}>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "rgba(255,255,255,0.3)",
                          }}
                        >
                          {new Date(featured.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                        {featured.readTime && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "rgba(255,255,255,0.3)",
                            }}
                          >
                            {featured.readTime} min read
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          color: "#c9a84c",
                          fontSize: "0.72rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          fontWeight: 500,
                        }}
                      >
                        Read Article
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Right: cover image or decorative fallback */}
                  <div
                    style={{
                      borderLeft: "1px solid rgba(255,255,255,0.04)",
                      position: "relative",
                      overflow: "hidden",
                      minHeight: 320,
                    }}
                  >
                    {featured.coverImage ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to right, rgba(10,10,15,0.35) 0%, rgba(10,10,15,0.1) 100%)",
                          }}
                        />
                      </>
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "3rem",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <p
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: "6rem",
                              fontWeight: 300,
                              color: "rgba(201,168,76,0.12)",
                              lineHeight: 1,
                              userSelect: "none",
                            }}
                          >
                            &ldquo;
                          </p>
                          <p
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: "1rem",
                              fontStyle: "italic",
                              fontWeight: 300,
                              color: "rgba(255,255,255,0.2)",
                              maxWidth: 260,
                              lineHeight: 1.7,
                            }}
                          >
                            {featured.excerpt?.slice(0, 120)}…
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            )}

            {/* Divider with count */}
            {rest.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  marginBottom: "2rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.18)",
                    flexShrink: 0,
                  }}
                >
                  {rest.length} More{" "}
                  {rest.length === 1 ? "Article" : "Articles"}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "rgba(255,255,255,0.04)",
                  }}
                />
              </div>
            )}

            {/* Article grid */}
            {rest.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1px",
                  background: "rgba(255,255,255,0.04)",
                }}
                className="insights-grid"
              >
                {rest.map((article) => (
                  <Link
                    key={article.id}
                    href={`/insights/${article.slug}`}
                    style={{ display: "block" }}
                  >
                    <article
                      style={{
                        background: "rgba(255,255,255,0.015)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "background 0.25s",
                      }}
                      className="insight-card"
                    >
                      {/* Cover image */}
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: 180,
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        {article.coverImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                              display: "block",
                              transition: "transform 0.4s ease",
                            }}
                            className="card-img"
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background:
                                "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(255,255,255,0.01) 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="rgba(201,168,76,0.2)"
                              strokeWidth={1}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      {/* Card body */}
                      <div
                        style={{
                          padding: "1.25rem 1.5rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.85rem",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "0.75rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.6rem",
                              fontWeight: 600,
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              color: "#c9a84c",
                              background: "rgba(201,168,76,0.08)",
                              padding: "0.25rem 0.6rem",
                              flexShrink: 0,
                            }}
                          >
                            {article.category?.name ?? "General"}
                          </span>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              color: "rgba(255,255,255,0.22)",
                            }}
                          >
                            {new Date(article.createdAt).toLocaleDateString(
                              "en-GB",
                              { day: "numeric", month: "short" }
                            )}
                          </span>
                        </div>

                        <h3 className="heading" style={{ flex: 1 }}>
                          {article.title}
                        </h3>

                        {article.excerpt && (
                          <p
                            className="body-sm"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            } as React.CSSProperties}
                          >
                            {article.excerpt}
                          </p>
                        )}

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingTop: "0.75rem",
                            borderTop: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          {article.readTime && (
                            <span
                              style={{
                                fontSize: "0.68rem",
                                color: "rgba(255,255,255,0.2)",
                              }}
                            >
                              {article.readTime} min read
                            </span>
                          )}
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="rgba(201,168,76,0.5)"
                            strokeWidth={2}
                            style={{ marginLeft: "auto" }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                            />
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
        .featured-card:hover { border-color: rgba(201,168,76,0.2) !important; background: rgba(255,255,255,0.03) !important; }
        .insight-card:hover { background: rgba(255,255,255,0.03) !important; }
        .insight-card:hover .card-img { transform: scale(1.04); }
        .cat-pill:hover { color: rgba(255,255,255,0.7) !important; border-color: rgba(255,255,255,0.2) !important; }
        .cat-clear:hover { color: rgba(255,255,255,0.5) !important; border-color: rgba(255,255,255,0.15) !important; }
        @media (max-width: 860px) {
          .featured-card { grid-template-columns: 1fr !important; }
          .featured-card > div:last-child { display: none !important; }
          .insights-grid { grid-template-columns: 1fr 1fr !important; }
          .insights-header-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .insights-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
