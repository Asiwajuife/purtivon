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

const CARDS_PER_ROW = 4

function PlaceholderCard() {
  return (
    <div
      style={{
        background: 'var(--dark-100)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          background: 'linear-gradient(135deg, #0e0e18 0%, #111120 100%)',
          position: 'relative',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(201,168,76,0.025) 0px, rgba(201,168,76,0.025) 1px, transparent 1px, transparent 14px)',
          }}
        />
      </div>
      <div
        style={{
          padding: '0.5rem 0.75rem',
          flexShrink: 0,
          borderTop: '1px solid var(--border)',
          background: 'var(--dark-100)',
        }}
      >
        <div style={{ height: 7, width: '68%', background: 'var(--border)', borderRadius: 2, marginBottom: '0.35rem' }} />
        <div style={{ height: 6, width: '42%', background: 'var(--border)', borderRadius: 2, opacity: 0.55 }} />
      </div>
    </div>
  )
}

export default function CategorySection({ category, articles }: CategorySectionProps) {
  if (articles.length === 0) return null

  const viewAllHref = `/insights?category=${encodeURIComponent(category)}`

  const filledArticles = articles.slice(0, CARDS_PER_ROW)
  const placeholderCount = Math.max(0, CARDS_PER_ROW - filledArticles.length)
  const filled: (HomepageArticle | null)[] = [
    ...filledArticles,
    ...Array.from<null>({ length: placeholderCount }).fill(null),
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 200,
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* ── Compact category header (32px) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          height: 32,
          flexShrink: 0,
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-page)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: 2,
              height: 12,
              background: 'var(--gold)',
              display: 'block',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          <h3
            style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {category}
          </h3>
        </div>
        <Link
          href={viewAllHref}
          style={{
            fontSize: '0.55rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold-dim)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          More →
        </Link>
      </div>

      {/* ── Card grid — fills remaining height ── */}
      <div
        className="cat-grid"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${CARDS_PER_ROW}, 1fr)`,
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderTop: 'none',
        }}
      >
        {filled.map((a, i) =>
          a ? (
            <Link
              key={a.id}
              href={`/insights/${a.slug}`}
              className="cat-card-link"
              style={{ display: 'flex', height: '100%' }}
            >
              <article
                style={{
                  background: 'var(--dark-100)',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, #111118, #1a1a24)',
                    }}
                  />
                  {a.coverImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={a.coverImage}
                      alt={a.title}
                      className="cat-card-img"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        transition: 'transform 0.5s ease',
                      }}
                      loading="lazy"
                    />
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.08) 55%, transparent 100%)',
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: '0.5rem 0.75rem',
                    flexShrink: 0,
                    borderTop: '1px solid var(--border)',
                    background: 'var(--dark-100)',
                  }}
                >
                  <h4
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.78rem',
                      fontWeight: 400,
                      lineHeight: 1.35,
                      color: 'var(--text-primary)',
                      margin: '0 0 0.3rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    } as React.CSSProperties}
                  >
                    {a.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.58rem', color: 'var(--text-4)' }}>
                      {fmtShort(a.publishedAt)}
                    </span>
                    {a.readTime && (
                      <span style={{ fontSize: '0.58rem', color: 'var(--gold-dim)' }}>
                        {a.readTime} min
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ) : (
            <PlaceholderCard key={`ph-${i}`} />
          )
        )}
      </div>

      <style>{`
        .cat-card-link:hover .cat-card-img { transform: scale(1.06); }
        @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px)  { .cat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
