import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { STATIC_WINNERS } from '@/lib/staticWinners'
import type { Winner } from '@/components/home/AwardWinners'

interface WinnerRow {
  id: string; name: string; slug: string | null; category: string
  year: number; quarter: number | null; company: string | null
  region: string | null; featured: boolean; link: string | null
  image: string | null; logo: string | null; profile: string | null
}

async function getWinner(slug: string): Promise<Winner | null> {
  const rows = await prisma.$queryRawUnsafe<WinnerRow[]>(
    `SELECT id, name, slug, category, year, quarter, company, region, featured, link, image, logo, profile
     FROM award_winners WHERE slug = $1 LIMIT 1`,
    slug
  ).catch(() => [] as WinnerRow[])

  if (rows.length > 0) {
    const w = rows[0]
    return {
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
    }
  }

  return STATIC_WINNERS.find((w) => w.slug === slug) ?? null
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const winner = await getWinner(slug)
  if (!winner) return { title: 'Winner Not Found' }
  return {
    title: `${winner.name} — Award Winner · Purtivon`,
    description: winner.profile
      ? winner.profile.slice(0, 160)
      : `${winner.name} — ${winner.category} winner recognised by Purtivon.`,
  }
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default async function WinnerProfilePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const winner = await getWinner(slug)
  if (!winner) notFound()

  const logoSrc = winner.logo ?? winner.image
  const periodLabel = winner.quarter ? `Q${winner.quarter} ${winner.year}` : String(winner.year)

  return (
    <div style={{ minHeight: '100vh', background: '#f7f5f1' }}>

      {/* ── Hero ── */}
      <div style={{
        background: '#0a0a0f',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '5rem 2.5rem 4rem',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Link href="/winners" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.1em' }}>
              Winners
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.65rem' }}>›</span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
              {winner.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2.5rem', flexWrap: 'wrap' }}>

            {/* Logo / initials */}
            <div style={{
              width: 120, height: 120, flexShrink: 0,
              background: logoSrc ? 'white' : 'rgba(201,168,76,0.12)',
              border: '2px solid rgba(201,168,76,0.35)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {logoSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoSrc}
                  alt={winner.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }}
                />
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '0.05em' }}>
                  {initials(winner.name)}
                </span>
              )}
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 200 }}>
              {winner.featured && (
                <p style={{
                  fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.65rem',
                }}>
                  ★ Featured Winner
                </p>
              )}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
                fontSize: 'clamp(1.6rem, 4vw, 2.75rem)', fontWeight: 300,
                color: '#f0ede6', lineHeight: 1.15, margin: '0 0 1rem',
              }}>
                {winner.name}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: '#c9a84c',
                  background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
                  padding: '0.25rem 0.65rem',
                }}>
                  {winner.category}
                </span>
                <span style={{
                  fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
                  padding: '0.25rem 0.65rem',
                }}>
                  {periodLabel}
                </span>
                {winner.region && (
                  <span style={{
                    fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
                    padding: '0.25rem 0.65rem',
                  }}>
                    {winner.region}
                  </span>
                )}
                {winner.company && (
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                    {winner.company}
                  </span>
                )}
              </div>

              {winner.link && (
                <a
                  href={winner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    marginTop: '1.25rem',
                    fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
                    color: '#c9a84c', textDecoration: 'none',
                  }}
                >
                  Visit website →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile body ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 2.5rem 5rem' }}>
        {winner.profile ? (
          <div>
            <p style={{
              fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1.5rem',
            }}>
              Company Profile
            </p>
            <div style={{
              fontSize: '1rem', lineHeight: 1.85, color: '#2a2a36',
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400,
              borderLeft: '3px solid rgba(201,168,76,0.3)',
              paddingLeft: '1.75rem',
            }}>
              {winner.profile.split('\n\n').map((para, i) => (
                <p key={i} style={{ margin: '0 0 1.25rem' }}>{para}</p>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            padding: '3rem 2rem', border: '1px solid #e8e3db',
            background: '#fff', textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.8rem', color: '#aaa' }}>
              Company profile coming soon.
            </p>
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e8e3db' }}>
          <Link
            href="/winners"
            style={{
              fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#c9a84c', textDecoration: 'none',
            }}
          >
            ← All Winners
          </Link>
        </div>
      </div>
    </div>
  )
}
