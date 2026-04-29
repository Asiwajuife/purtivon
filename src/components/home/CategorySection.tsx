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
    <div style={{ marginBottom: '3.5rem' }}>
      {/* Category header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0 1.5rem 0.75rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: 3, height: 18, background: 'var(--gold)', display: 'block', flexShrink: 0 }} aria-hidden="true" />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--text-primary)', margin: 0 }}>
            {category}
          </h3>
        </div>
        <Link
          href={viewAllHref}
          style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dim)', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          More →
        </Link>
      </div>

      {/* Article grid — up to 4 per section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }} className="cat-grid">
        {articles.slice(0, 4).map((a) => (
          <Link key={a.id} href={`/insights/${a.slug}`} className="cat-card-link" style={{ display: 'block' }}>
            <article style={{ background: 'var(--dark-100)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {/* Thumbnail */}
              <div style={{ position: 'relative', height: 150, overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #111118, #1a1a24)' }} />
                {a.coverImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={a.coverImage}
                    alt={a.title}
                    className="cat-card-img"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    loading="lazy"
                  />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.15)' }} />
              </div>

              {/* Content */}
              <div style={{ padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.38, color: 'var(--text-primary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                  {a.title}
                </h4>
                {a.excerpt && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-lo)', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                    {a.excerpt}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.9rem', marginTop: 'auto', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-4)' }}>{fmtShort(a.publishedAt)}</span>
                  {a.readTime && (
                    <span style={{ fontSize: '0.62rem', color: 'var(--gold-dim)' }}>{a.readTime} min</span>
                  )}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <style>{`
        .cat-card-link:hover .cat-card-img { transform: scale(1.06); }
        @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px)  { .cat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
