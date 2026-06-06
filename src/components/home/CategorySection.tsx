import Link from 'next/link'
import type React from 'react'
import type { HomepageArticle } from './FeaturedArticles'

interface CategorySectionProps {
  category: string
  articles: HomepageArticle[]
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function CategorySection({ category, articles }: CategorySectionProps) {
  if (articles.length === 0) return null

  const viewAllHref = `/insights?category=${encodeURIComponent(category)}`

  return (
    <div style={{ marginBottom: '3.75rem' }}>
      {/* Category header — constrained */}
      <div className="container" style={{ marginBottom: '1.1rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: '0.8rem',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ width: 3, height: 20, background: 'linear-gradient(to bottom, var(--gold), var(--gold-dim))', display: 'block', flexShrink: 0, borderRadius: 2 }} aria-hidden="true" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.05rem, 1.4vw, 1.35rem)', fontWeight: 400, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.01em' }}>
              {category}
            </h3>
          </div>
          <Link
            href={viewAllHref}
            style={{ fontSize: '0.63rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-lo)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            className="cat-viewall"
          >
            View All
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Card grid — full-bleed */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', width: '100%' }}
        className="cat-grid"
      >
        {articles.slice(0, 4).map((a, idx) => (
          <Link key={a.id} href={`/insights/${a.slug}`} className="cat-card-link" style={{ display: 'block' }}>
            <article
              className="cat-card"
              style={{ background: 'var(--dark-100)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', transition: 'background 0.22s' }}
            >
              {/* Thumbnail — aspect-ratio based */}
              <div style={{ position: 'relative', width: '100%', paddingBottom: '54%', flexShrink: 0, overflow: 'hidden', background: 'linear-gradient(135deg, #0E1120, #141827)' }}>
                {a.coverImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={a.coverImage}
                    alt={a.title}
                    className="cat-card-img"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s var(--ease-out)' }}
                    loading="lazy"
                  />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,32,0.55) 0%, rgba(14,17,32,0.05) 55%)' }} aria-hidden="true" />
                {/* Gold bottom accent on hover */}
                <div className="cat-card-underline" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--gold), var(--gold-light))', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.33s var(--ease-out)' }} />
                {/* Issue number / rank for visual interest */}
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }} aria-hidden="true">
                  {String(idx + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1.1rem 1.3rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.55rem' }}>
                <span style={{
                  fontSize: '0.54rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--gold)', background: 'var(--gold-subtle)', padding: '0.16rem 0.45rem',
                  border: '1px solid var(--gold-border)', display: 'inline-block', alignSelf: 'flex-start',
                }}>
                  {a.category}
                </span>
                <h4 style={{
                  fontFamily: 'var(--font-serif)', fontSize: '0.97rem', fontWeight: 400,
                  lineHeight: 1.4, color: 'var(--text-primary)', margin: 0,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                } as React.CSSProperties}>
                  {a.title}
                </h4>
                {a.excerpt && (
                  <p style={{
                    fontSize: '0.75rem', color: 'var(--text-lo)', lineHeight: 1.58, margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  } as React.CSSProperties}>
                    {a.excerpt}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-4)' }}>{fmtShort(a.publishedAt)}</span>
                  {a.readTime && (
                    <span style={{ fontSize: '0.6rem', color: 'var(--gold-dim)' }}>{a.readTime} min</span>
                  )}
                  <span className="cat-card-cta" style={{ marginLeft: 'auto', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0, transform: 'translateX(-5px)', transition: 'opacity 0.22s, transform 0.22s var(--ease-out)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Read
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
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
        .cat-viewall:hover { color: var(--gold) !important; }
        .cat-card-link:hover .cat-card { background: rgba(201,168,76,0.025) !important; }
        .cat-card-link:hover .cat-card-img { transform: scale(1.06); }
        .cat-card-link:hover .cat-card-underline { transform: scaleX(1) !important; }
        .cat-card-link:hover .cat-card-cta { opacity: 1 !important; transform: translateX(0) !important; }
        @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px)  { .cat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
