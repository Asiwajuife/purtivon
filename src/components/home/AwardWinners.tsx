import Link from 'next/link'

export interface Winner {
  id: string
  name: string
  slug: string | null
  category: string
  year: number
  quarter: number | null
  company: string | null
  region: string | null
  featured: boolean
  link: string | null
  image: string | null
  logo: string | null
  profile: string | null
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function quarterLabel(q: number | null): string {
  if (!q) return ''
  return `Q${q}`
}

function FeaturedWinnerCard({ winner }: { winner: Winner }) {
  const inner = (
    <article
      className="featured-winner-card"
      style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.02) 100%)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderTop: '3px solid #c9a84c',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        cursor: winner.link ? 'pointer' : 'default',
        transition: 'border-color 0.25s, background 0.25s, transform 0.25s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Featured badge */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        fontSize: '0.52rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#c9a84c',
        background: 'rgba(201,168,76,0.12)',
        border: '1px solid rgba(201,168,76,0.3)',
        padding: '0.2rem 0.5rem',
      }}>
        ★ Featured
      </div>

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {(winner.logo || winner.image) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={winner.logo ?? winner.image!}
            alt={winner.name}
            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(201,168,76,0.35)', flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '2px solid rgba(201,168,76,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#c9a84c', flexShrink: 0 }}>
            {initials(winner.name)}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-hi)', margin: 0, lineHeight: 1.3 }}>
            {winner.name}
          </p>
          {winner.company && (
            <p style={{ fontSize: '0.72rem', color: 'var(--text-lo)', margin: '0.2rem 0 0' }}>
              {winner.company}
            </p>
          )}
        </div>
      </div>

      {/* Category + meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', padding: '0.22rem 0.6rem', border: '1px solid rgba(201,168,76,0.25)' }}>
          {winner.category}
        </span>
        {winner.region && (
          <span style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--text-lo)', background: 'var(--border-faint)', padding: '0.22rem 0.5rem', border: '1px solid var(--border-dim)' }}>
            {winner.region}
          </span>
        )}
        <span style={{ fontSize: '0.58rem', color: 'var(--text-lo)', marginLeft: 'auto' }}>
          {quarterLabel(winner.quarter) ? `${quarterLabel(winner.quarter)} · ` : ''}{winner.year}
        </span>
      </div>

      {(winner.slug || winner.link) && (
        <p style={{ fontSize: '0.64rem', fontWeight: 600, color: '#c9a84c', margin: 0, letterSpacing: '0.08em' }}>
          View profile →
        </p>
      )}
    </article>
  )

  const href = winner.slug ? `/winners/${winner.slug}` : winner.link
  if (href) {
    const isExternal = !winner.slug && !!winner.link
    return (
      <Link href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})} style={{ display: 'block', textDecoration: 'none' }} className="featured-winner-link">
        {inner}
      </Link>
    )
  }
  return <div>{inner}</div>
}

function WinnerCard({ winner }: { winner: Winner }) {
  const inner = (
    <article
      className="winner-card"
      style={{
        background: 'var(--dark-200)',
        border: '1px solid var(--border)',
        borderTop: '2px solid rgba(201,168,76,0.25)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        cursor: winner.link ? 'pointer' : 'default',
        transition: 'border-color 0.25s, background 0.25s',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {(winner.logo || winner.image) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={winner.logo ?? winner.image!}
            alt={winner.name}
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(201,168,76,0.2)', flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>
            {initials(winner.name)}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
            {winner.name}
          </p>
          {winner.company && (
            <p style={{ fontSize: '0.62rem', color: 'var(--text-4)', margin: '0.1rem 0 0' }}>
              {winner.company}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', background: 'rgba(201,168,76,0.08)', padding: '0.18rem 0.5rem', border: '1px solid rgba(201,168,76,0.18)' }}>
          {winner.category}
        </span>
        {winner.region && (
          <span style={{ fontSize: '0.55rem', color: 'var(--text-4)', padding: '0.18rem 0.4rem', border: '1px solid var(--border-faint)', background: 'var(--surface-hover)' }}>
            {winner.region}
          </span>
        )}
        <span style={{ fontSize: '0.55rem', color: 'var(--text-4)', marginLeft: 'auto' }}>
          {quarterLabel(winner.quarter) ? `${quarterLabel(winner.quarter)} · ` : ''}{winner.year}
        </span>
      </div>

      {(winner.slug || winner.link) && (
        <p style={{ fontSize: '0.6rem', color: 'var(--text-lo)', margin: 0, marginTop: 'auto' }}>
          View profile →
        </p>
      )}
    </article>
  )

  const href = winner.slug ? `/winners/${winner.slug}` : winner.link
  if (href) {
    const isExternal = !winner.slug && !!winner.link
    return (
      <Link href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})} style={{ display: 'block', textDecoration: 'none', height: '100%' }} className="winner-link">
        {inner}
      </Link>
    )
  }
  return <div style={{ height: '100%' }}>{inner}</div>
}

export default function AwardWinners({ winners }: { winners: Winner[] }) {
  if (winners.length === 0) return null

  const featured = winners.filter((w) => w.featured)
  const rest = winners.filter((w) => !w.featured)

  // Group non-featured by year+quarter for the grid
  const quarters = new Map<string, Winner[]>()
  for (const w of rest) {
    const key = w.quarter ? `Q${w.quarter} ${w.year}` : String(w.year)
    quarters.set(key, [...(quarters.get(key) ?? []), w])
  }

  return (
    <section className="section section--alt" aria-labelledby="winners-heading">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>Global Recognition</div>
            <h2 id="winners-heading" className="display-md">
              Award <em>Winners</em>
            </h2>
          </div>
          <Link href="/awards" className="btn btn-outline btn-sm">Submit Nomination →</Link>
        </div>

        {/* Featured winners row */}
        {featured.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', marginBottom: '1rem' }}>
              ★ Featured Winners
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }} className="featured-winners-grid">
              {featured.map((w) => (
                <FeaturedWinnerCard key={w.id} winner={w} />
              ))}
            </div>
          </div>
        )}

        {/* Remaining winners — grouped or plain grid */}
        {rest.length > 0 && (
          quarters.size <= 1 ? (
            // No quarter grouping — flat grid
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} className="winners-grid">
              {rest.map((w) => <WinnerCard key={w.id} winner={w} />)}
            </div>
          ) : (
            // Grouped by quarter
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[...quarters.entries()].map(([label, group]) => (
                <div key={label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-lo)' }}>{label}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-faint)' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} className="winners-grid">
                    {group.map((w) => <WinnerCard key={w.id} winner={w} />)}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <style>{`
        .featured-winner-link:hover .featured-winner-card {
          border-color: rgba(201,168,76,0.5) !important;
          background: linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.04) 100%) !important;
          transform: translateY(-2px);
        }
        .winner-link:hover .winner-card {
          border-color: rgba(201,168,76,0.35) !important;
          background: rgba(201,168,76,0.04) !important;
        }
        @media (max-width: 1024px) {
          .featured-winners-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .winners-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 760px) {
          .featured-winners-grid { grid-template-columns: 1fr !important; }
          .winners-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .winners-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
