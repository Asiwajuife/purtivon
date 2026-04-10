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

  const hero      = articles[0]
  const secondary = articles.slice(1, 3)

  return (
    <section
      className="section"
      style={{ paddingTop: 'var(--space-xl)', paddingBottom: 0 }}
      aria-labelledby="featured-heading"
    >
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>Latest Intelligence</div>
            <h2 id="featured-heading" className="display-md">
              Featured <em>Insights</em>
            </h2>
          </div>
          <Link href="/insights" className="btn btn-outline btn-sm">All Insights →</Link>
        </div>

        {/* Hero + secondary */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}
          className="feat-row"
        >
          {/* Hero card */}
          <Link href={`/insights/${hero.slug}`} className="feat-hero-link" style={{ display: 'block' }}>
            <article style={{ position: 'relative', height: 500, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f0f16, #141420)' }} />
              {hero.coverImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={hero.coverImage}
                  alt={hero.title}
                  className="feat-hero-img"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  loading="eager"
                />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.97) 0%, rgba(10,10,15,0.55) 45%, rgba(10,10,15,0.1) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', background: 'rgba(201,168,76,0.15)', padding: '0.25rem 0.7rem' }}>
                    {hero.category}
                  </span>
                  {hero.featured && (
                    <span className="badge badge--gold" style={{ fontSize: '0.58rem' }}>Featured</span>
                  )}
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', fontWeight: 300, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '0.9rem', maxWidth: 580 }}>
                  {hero.title}
                </h3>
                {hero.excerpt && (
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: 520, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                    {hero.excerpt}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>{fmt(hero.publishedAt)}</span>
                  {hero.readTime && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--gold-dim)' }}>{hero.readTime} min read</span>
                  )}
                </div>
              </div>
            </article>
          </Link>

          {/* Secondary stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {secondary.map((a) => (
              <Link key={a.id} href={`/insights/${a.slug}`} className="feat-sec-link" style={{ display: 'block', flex: 1 }}>
                <article style={{ position: 'relative', height: '100%', minHeight: 248, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f0f16, #141420)' }} />
                  {a.coverImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={a.coverImage}
                      alt={a.title}
                      className="feat-sec-img"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      loading="lazy"
                    />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.96) 0%, rgba(10,10,15,0.5) 50%, rgba(10,10,15,0.12) 100%)' }} />
                  <div style={{ position: 'absolute', inset: 0, padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.56rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', background: 'rgba(201,168,76,0.15)', padding: '0.2rem 0.6rem', alignSelf: 'flex-start', marginBottom: '0.6rem' }}>
                      {a.category}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {a.title}
                    </h3>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>{fmtShort(a.publishedAt)}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .feat-hero-link:hover .feat-hero-img { transform: scale(1.03); }
        .feat-sec-link:hover .feat-sec-img  { transform: scale(1.06); }
        @media (max-width: 860px) {
          .feat-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
