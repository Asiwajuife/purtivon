import type { Metadata } from 'next'
import Link from 'next/link'
import { STATIC_WINNERS } from '@/lib/staticWinners'
import { prisma } from '@/lib/prisma'
import type { Winner } from '@/components/home/AwardWinners'

export const metadata: Metadata = {
  title: 'Award Winners — Purtivon',
  description: 'Past and current award winners recognised by Purtivon across global finance, FDI, and investment excellence.',
}

interface WinnerRow {
  id: string; name: string; slug: string | null; category: string
  year: number; quarter: number | null; company: string | null
  region: string | null; featured: boolean; link: string | null
  image: string | null; logo: string | null; profile: string | null
}

async function getWinners(): Promise<Winner[]> {
  const dbRows = await prisma.$queryRawUnsafe<WinnerRow[]>(
    `SELECT id, name, slug, category, year, quarter, company, region, featured, link, image, logo, profile
     FROM award_winners ORDER BY year DESC, name ASC`
  ).catch(() => [] as WinnerRow[])

  const dbWinners: Winner[] = dbRows.map((w) => ({
    id:       String(w.id),
    name:     String(w.name),
    slug:     w.slug    != null ? String(w.slug)    : null,
    category: String(w.category),
    year:     Number(w.year),
    quarter:  w.quarter != null ? Number(w.quarter) : null,
    company:  w.company != null ? String(w.company) : null,
    region:   w.region  != null ? String(w.region)  : null,
    featured: Boolean(w.featured),
    link:     w.link    != null ? String(w.link)    : null,
    image:    w.image   != null ? String(w.image)   : null,
    logo:     w.logo    != null ? String(w.logo)    : null,
    profile:  w.profile != null ? String(w.profile) : null,
  }))

  const dbIds = new Set(dbWinners.map((w) => w.id))
  return [
    ...dbWinners,
    ...STATIC_WINNERS.filter((w) => !dbIds.has(w.id)),
  ].sort(
    (a, b) =>
      (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
      b.year - a.year ||
      a.name.localeCompare(b.name)
  )
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function WinnerCard({ winner }: { winner: Winner }) {
  const href = winner.slug ? `/winners/${winner.slug}` : null
  const logoSrc = winner.logo ?? winner.image

  const card = (
    <article
      className="winner-logo-card"
      style={{
        background: '#fff',
        border: '1px solid #e8e3db',
        borderTop: winner.featured ? '3px solid #c9a84c' : '1px solid #e8e3db',
        borderRadius: 4,
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        minHeight: 160,
        position: 'relative',
        transition: 'box-shadow 0.25s, transform 0.25s',
        cursor: href ? 'pointer' : 'default',
        textAlign: 'center',
      }}
    >
      {winner.featured && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#c9a84c',
          background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
          padding: '0.18rem 0.45rem',
        }}>
          ★
        </div>
      )}

      {/* Logo or initials badge */}
      {logoSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logoSrc}
          alt={winner.name}
          style={{ maxWidth: 120, maxHeight: 72, objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
          border: '2px solid rgba(201,168,76,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '0.05em',
          flexShrink: 0,
        }}>
          {initials(winner.name)}
        </div>
      )}

      {/* Category badge */}
      <span style={{
        fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: '#c9a84c',
        background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
        padding: '0.2rem 0.55rem', borderRadius: 2,
      }}>
        {winner.category}
      </span>

      <p style={{
        fontSize: '0.78rem', fontWeight: 600, color: '#1a1a24',
        margin: 0, lineHeight: 1.3,
      }}>
        {winner.name}
      </p>

      {winner.company && (
        <p style={{ fontSize: '0.65rem', color: '#888', margin: 0 }}>
          {winner.company}
        </p>
      )}
    </article>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block' }} className="winner-logo-link">
        {card}
      </Link>
    )
  }
  return card
}

export default async function WinnersPage() {
  const winners = await getWinners()
  const featured = winners.filter((w) => w.featured)
  const rest = winners.filter((w) => !w.featured)

  // Group rest by year+quarter
  const groups = new Map<string, { label: string; year: number; quarter: number | null; items: Winner[] }>()
  for (const w of rest) {
    const key   = w.quarter ? `Q${w.quarter}-${w.year}` : String(w.year)
    const label = w.quarter ? `Q${w.quarter} ${w.year}` : String(w.year)
    if (!groups.has(key)) groups.set(key, { label, year: w.year, quarter: w.quarter, items: [] })
    groups.get(key)!.items.push(w)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f5f1' }}>

      {/* ── Hero ── */}
      <div style={{
        background: '#0a0a0f',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '6rem 2.5rem 4rem',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1rem',
        }}>
          Global Recognition · Award Winners
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300,
          color: '#f0ede6', lineHeight: 1.15, margin: '0 auto 1.25rem',
          maxWidth: 640,
        }}>
          Award <em style={{ fontStyle: 'italic', color: '#c9a84c' }}>Winners</em>
        </h1>
        <p style={{
          fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)',
          maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.75,
        }}>
          Companies and institutions recognised for excellence across global finance, FDI, and investment.
        </p>
        <Link
          href="/awards"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 1.5rem',
            border: '1px solid rgba(201,168,76,0.5)', color: '#c9a84c',
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em',
            textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
          }}
        >
          Submit Nomination →
        </Link>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 2.5rem 5rem' }}>

        {/* ── Featured ── */}
        {featured.length > 0 && (
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.75rem' }}>
              <p style={{
                fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: '#c9a84c', whiteSpace: 'nowrap',
              }}>
                ★ Featured Winners
              </p>
              <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.2)' }} />
            </div>
            <div className="winners-grid-featured">
              {featured.map((w) => <WinnerCard key={w.id} winner={w} />)}
            </div>
          </div>
        )}

        {/* ── Grouped by period ── */}
        {[...groups.values()].map(({ label, items }) => (
          <div key={label} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'rgba(26,26,36,0.4)', whiteSpace: 'nowrap',
              }}>
                {label}
              </p>
              <div style={{ flex: 1, height: 1, background: '#e8e3db' }} />
            </div>
            <div className="winners-grid">
              {items.map((w) => <WinnerCard key={w.id} winner={w} />)}
            </div>
          </div>
        ))}

        {winners.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '0.8rem', color: 'rgba(26,26,36,0.35)' }}>
              Award winners will be announced here after each quarterly cycle.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .winners-grid-featured {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .winners-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .winner-logo-link:hover .winner-logo-card {
          box-shadow: 0 8px 32px rgba(201,168,76,0.15);
          transform: translateY(-3px);
        }
        @media (max-width: 1024px) {
          .winners-grid-featured, .winners-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .winners-grid-featured, .winners-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .winners-grid-featured, .winners-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
