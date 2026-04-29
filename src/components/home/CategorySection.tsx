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

function Badge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '0.5rem',
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        border: '1px solid var(--border-gold)',
        background: 'rgba(201,168,76,0.08)',
        padding: '0.2rem 0.5rem',
        marginBottom: '0.65rem',
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  )
}

function HeroCard({ article, category }: { article: HomepageArticle; category: string }) {
  return (
    <Link href={`/insights/${article.slug}`} className="ec-hero-link" style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="ec-hero-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '55% 45%',
          height: 380,
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {/* Image pane */}
        <div className="ec-hero-img-pane" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0e0e18, #111120)' }}>
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
          {article.coverImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={article.coverImage}
              alt={article.title}
              className="ec-hero-img"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform 0.6s ease',
              }}
              loading="eager"
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, transparent 65%, rgba(10,10,15,0.7) 100%)',
            }}
          />
        </div>

        {/* Text pane */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '2rem 2rem 2rem 1.75rem',
            borderLeft: '1px solid var(--border)',
            background: 'var(--dark-100)',
          }}
        >
          <Badge label={category} />
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              fontWeight: 400,
              lineHeight: 1.28,
              color: 'var(--text-primary)',
              margin: '0 0 0.9rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}
          >
            {article.title}
          </h2>
          {article.excerpt && (
            <p
              style={{
                fontSize: '0.72rem',
                lineHeight: 1.7,
                color: 'var(--text-muted)',
                margin: '0 0 1.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              } as React.CSSProperties}
            >
              {article.excerpt}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
            <span style={{ fontSize: '0.58rem', color: 'var(--text-4)' }}>{fmtShort(article.publishedAt)}</span>
            {article.readTime && (
              <span style={{ fontSize: '0.58rem', color: 'var(--gold-dim)' }}>{article.readTime} min</span>
            )}
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.58rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
            >
              Read More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function FeatureCard({ article, category }: { article: HomepageArticle; category: string }) {
  return (
    <Link href={`/insights/${article.slug}`} className="ec-feat-link" style={{ textDecoration: 'none', display: 'flex' }}>
      <div
        style={{
          background: 'var(--dark-100)',
          border: '1px solid var(--border)',
          borderTop: 'none',
          overflow: 'hidden',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ position: 'relative', height: 200, flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0e0e18, #111120)' }}>
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
          {article.coverImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={article.coverImage}
              alt={article.title}
              className="ec-feat-img"
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
              background: 'linear-gradient(to top, rgba(10,10,15,0.5) 0%, transparent 60%)',
            }}
          />
        </div>
        <div style={{ padding: '1rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Badge label={category} />
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.95rem',
              fontWeight: 400,
              lineHeight: 1.4,
              color: 'var(--text-primary)',
              margin: '0 0 auto',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}
          >
            {article.title}
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.85rem' }}>
            <span style={{ fontSize: '0.56rem', color: 'var(--text-4)' }}>{fmtShort(article.publishedAt)}</span>
            {article.readTime && (
              <span style={{ fontSize: '0.56rem', color: 'var(--gold-dim)' }}>{article.readTime} min</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function ArchiveCard({ article, category }: { article: HomepageArticle; category: string }) {
  return (
    <Link href={`/insights/${article.slug}`} className="ec-arc-link" style={{ textDecoration: 'none', display: 'flex' }}>
      <div
        className="ec-arc-card"
        style={{
          background: 'var(--dark-100)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid transparent',
          overflow: 'hidden',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'border-left-color 0.2s ease',
        }}
      >
        <div style={{ position: 'relative', height: 120, flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0e0e18, #111120)' }}>
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
          {article.coverImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={article.coverImage}
              alt={article.title}
              className="ec-arc-img"
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
        </div>
        <div style={{ padding: '0.85rem 1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Badge label={category} />
          <h4
            className="ec-arc-headline"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.8rem',
              fontWeight: 400,
              lineHeight: 1.4,
              color: 'var(--text-primary)',
              margin: '0 0 0.45rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.2s ease',
            } as React.CSSProperties}
          >
            {article.title}
          </h4>
          {article.excerpt && (
            <p
              style={{
                fontSize: '0.63rem',
                lineHeight: 1.65,
                color: 'var(--text-muted)',
                margin: '0 0 0.65rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              } as React.CSSProperties}
            >
              {article.excerpt}
            </p>
          )}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-4)' }}>{fmtShort(article.publishedAt)}</span>
            {article.readTime && (
              <span style={{ fontSize: '0.55rem', color: 'var(--gold-dim)' }}>{article.readTime} min</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function CategorySection({ category, articles }: CategorySectionProps) {
  if (articles.length === 0) return null

  const viewAllHref = `/insights?category=${encodeURIComponent(category)}`
  const [hero, ...rest] = articles
  const featureArticles = rest.slice(0, 2)
  const archiveArticles = rest.slice(2, 6)

  return (
    <section>
      <HeroCard article={hero} category={category} />

      {featureArticles.length > 0 && (
        <div
          className="ec-feat-row"
          style={{
            display: 'grid',
            gridTemplateColumns: featureArticles.length === 1 ? '1fr' : '1fr 1fr',
            gap: '1px',
            background: 'var(--border)',
          }}
        >
          {featureArticles.map((a) => (
            <FeatureCard key={a.id} article={a} category={category} />
          ))}
        </div>
      )}

      {archiveArticles.length > 0 ? (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.7rem 0',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              margin: '1.5rem 0 1.25rem',
            }}
          >
            <span
              style={{
                fontSize: '0.5rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
            >
              More from {category}
            </span>
            <Link
              href={viewAllHref}
              style={{
                fontSize: '0.5rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gold-dim)',
                textDecoration: 'none',
              }}
            >
              View All →
            </Link>
          </div>
          <div className="ec-arc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {archiveArticles.map((a) => (
              <ArchiveCard key={a.id} article={a} category={category} />
            ))}
          </div>
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0.6rem 0',
            borderTop: '1px solid var(--border)',
          }}
        >
          <Link
            href={viewAllHref}
            style={{
              fontSize: '0.5rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--gold-dim)',
              textDecoration: 'none',
            }}
          >
            View All →
          </Link>
        </div>
      )}

      <style>{`
        .ec-hero-link:hover .ec-hero-img   { transform: scale(1.04); }
        .ec-feat-link:hover .ec-feat-img   { transform: scale(1.06); }
        .ec-arc-link:hover .ec-arc-card    { border-left-color: var(--gold) !important; }
        .ec-arc-link:hover .ec-arc-headline { color: var(--gold) !important; }
        .ec-arc-link:hover .ec-arc-img     { transform: scale(1.06); }
        @media (max-width: 1024px) { .ec-arc-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px)  { .ec-hero-grid { grid-template-columns: 1fr !important; height: auto !important; } .ec-hero-img-pane { height: 240px; } }
        @media (max-width: 640px)  { .ec-arc-grid { grid-template-columns: 1fr !important; } .ec-feat-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
