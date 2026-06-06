import Link from 'next/link'
import type React from 'react'

export interface HomepageArticle {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  category: string
  publishedAt: string
  readTime: number | null
  featured: boolean
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function FeaturedArticles({ articles }: { articles: HomepageArticle[] }) {
  if (articles.length === 0) return null

  const hero = articles[0]
  const secondary = articles.slice(1, 3)

  return (
    <section
      aria-labelledby="featured-heading"
      style={{ padding: 'var(--space-xl) 0', background: 'var(--surface-page)' }}
    >
      {/* Section header — constrained width */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow" style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: 28, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
              Featured Intelligence
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem' }}>
              <h2 id="featured-heading" className="display-md" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                Featured <em>Insights</em>
              </h2>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--border-hover), transparent)', marginBottom: '0.45rem' }} aria-hidden="true" />
            </div>
          </div>
          <Link href="/insights" className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
            All Insights →
          </Link>
        </div>
      </div>

      {/* Full-width editorial grid — all 3 columns as direct grid children */}
      <div
        className="feat-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.65fr 1fr 1fr',
          gap: '1px',
          background: 'var(--border)',
          width: '100%',
        }}
      >

        {/* ── Hero card (left, full height) ── */}
        <Link
          href={`/insights/${hero.slug}`}
          className="feat-hero-link"
          style={{ display: 'block', background: 'var(--dark-100)' }}
        >
          <article style={{ position: 'relative', height: 580, overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0D1020, #111827)' }} />
            {hero.coverImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={hero.coverImage}
                alt={hero.title}
                className="feat-hero-img"
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                loading="eager"
              />
            )}

            {/* Overlay gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,10,20,0.97) 0%, rgba(8,10,20,0.45) 50%, rgba(8,10,20,0.06) 100%)' }} />

            {/* Gold underline hover accent */}
            <div className="feat-hero-underline" style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: 2,
              background: 'linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold))',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }} />

            {/* Top-left category badge */}
            <div style={{ position: 'absolute', top: '1.75rem', left: '2.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge--glass">{hero.category}</span>
              {hero.featured && (
                <span className="badge badge--gold" style={{ fontSize: '0.56rem' }}>Featured</span>
              )}
            </div>

            <div style={{ position: 'absolute', inset: 0, padding: '2.25rem 2.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 2.4vw, 2.15rem)',
                fontWeight: 300,
                lineHeight: 1.15,
                color: '#F0EDE6',
                marginBottom: '0.85rem',
                maxWidth: 620,
              }}>
                {hero.title}
              </h3>

              {hero.excerpt && (
                <p style={{
                  fontSize: '0.88rem',
                  color: 'rgba(240,237,230,0.62)',
                  lineHeight: 1.68,
                  marginBottom: '1.5rem',
                  maxWidth: 560,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                } as React.CSSProperties}>
                  {hero.excerpt}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.66rem', color: 'rgba(240,237,230,0.45)' }}>{fmt(hero.publishedAt)}</span>
                {hero.readTime && (
                  <span style={{ fontSize: '0.66rem', color: 'var(--gold-dim)' }}>{hero.readTime} min read</span>
                )}
                <span className="feat-read-cta" style={{ marginLeft: 'auto', fontSize: '0.64rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0, transform: 'translateX(-8px)', transition: 'opacity 0.3s, transform 0.3s var(--ease-out)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Read Article
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>
          </article>
        </Link>

        {/* ── Secondary cards — each as a direct grid child (full height) ── */}
        {secondary.map((a) => (
          <Link
            key={a.id}
            href={`/insights/${a.slug}`}
            className="feat-sec-link"
            style={{ display: 'block', background: '#0c0c12' }}
          >
            <article style={{ position: 'relative', height: 580, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0D1020, #111827)' }} />
              {a.coverImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={a.coverImage}
                  alt={a.title}
                  className="feat-sec-img"
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  loading="lazy"
                />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,10,20,0.97) 0%, rgba(8,10,20,0.35) 55%, rgba(8,10,20,0.08) 100%)' }} />

              {/* Gold bottom accent */}
              <div className="feat-sec-underline" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 2,
                background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />

              {/* Top category badge */}
              <div style={{ position: 'absolute', top: '1.5rem', left: '1.75rem' }}>
                <span className="badge badge--glass" style={{ fontSize: '0.58rem' }}>{a.category}</span>
              </div>

              <div style={{ position: 'absolute', inset: 0, padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
                  fontWeight: 300,
                  lineHeight: 1.28,
                  color: '#F0EDE6',
                  marginBottom: '0.65rem',
                }}>
                  {a.title}
                </h3>
                {a.excerpt && (
                  <p style={{
                    fontSize: '0.78rem',
                    color: 'rgba(240,237,230,0.5)',
                    lineHeight: 1.6,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  } as React.CSSProperties}>
                    {a.excerpt}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.62rem', color: 'rgba(240,237,230,0.4)' }}>{fmtShort(a.publishedAt)}</span>
                  {a.readTime && (
                    <span style={{ fontSize: '0.62rem', color: 'var(--gold-dim)' }}>{a.readTime} min</span>
                  )}
                  <span className="feat-sec-cta" style={{ marginLeft: 'auto', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0, transform: 'translateX(-6px)', transition: 'opacity 0.28s, transform 0.28s var(--ease-out)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Read
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <style>{`
        .feat-hero-link:hover .feat-hero-img { transform: scale(1.04); }
        .feat-hero-link:hover .feat-hero-underline { transform: scaleX(1) !important; }
        .feat-hero-link:hover .feat-read-cta { opacity: 1 !important; transform: translateX(0) !important; }
        .feat-sec-link:hover .feat-sec-img { transform: scale(1.06); }
        .feat-sec-link:hover .feat-sec-underline { transform: scaleX(1) !important; }
        .feat-sec-link:hover .feat-sec-cta { opacity: 1 !important; transform: translateX(0) !important; }
        @media (max-width: 1024px) {
          .feat-grid { grid-template-columns: 1.65fr 1fr !important; }
          .feat-grid .feat-sec-link:last-child { display: none !important; }
        }
        @media (max-width: 700px) {
          .feat-grid { grid-template-columns: 1fr !important; }
          .feat-grid .feat-sec-link:last-child { display: block !important; }
          .feat-grid article { height: 420px !important; }
        }
        @media (max-width: 480px) {
          .feat-grid article { height: 340px !important; }
        }
      `}</style>
    </section>
  )
}
