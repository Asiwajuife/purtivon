export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { STATIC_WINNERS } from '@/lib/staticWinners';
import { prisma } from '@/lib/prisma';
import type { Winner } from '@/components/home/AwardWinners';

export const metadata: Metadata = {
  title: 'Award Winners — Purtivon',
  description: 'Past and current award winners recognised by Purtivon across global finance, FDI, and investment excellence.',
};

interface WinnerRow {
  id: string; name: string; slug: string | null; category: string;
  year: number; quarter: number | null; company: string | null;
  region: string | null; featured: boolean; link: string | null;
  image: string | null; logo: string | null; profile: string | null;
}

async function getWinners(): Promise<Winner[]> {
  const dbRows = await prisma.$queryRawUnsafe<WinnerRow[]>(
    `SELECT id, name, slug, category, year, quarter, company, region, featured, link, image, logo, profile
     FROM award_winners ORDER BY year DESC, name ASC`
  ).catch(() => [] as WinnerRow[]);

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
  }));

  const dbIds = new Set(dbWinners.map((w) => w.id));
  return [
    ...dbWinners,
    ...STATIC_WINNERS.filter((w) => !dbIds.has(w.id)),
  ].sort(
    (a, b) =>
      (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
      b.year - a.year ||
      a.name.localeCompare(b.name)
  );
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function quarterLabel(q: number | null): string {
  return q ? `Q${q}` : '';
}

function WinnerCard({ winner, featured = false }: { winner: Winner; featured?: boolean }) {
  const href = winner.slug ? `/winners/${winner.slug}` : winner.link ?? null;
  const logoSrc = winner.logo ?? winner.image;
  const isExternal = !winner.slug && !!winner.link;

  const card = (
    <article
      className="wpage-card"
      style={{
        background: "rgba(10,12,22,0.72)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderTop: featured ? "2px solid rgba(201,168,76,0.6)" : "1px solid rgba(201,168,76,0.15)",
        padding: featured ? "1.75rem" : "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: featured ? "1.1rem" : "0.85rem",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.28s var(--ease-out), box-shadow 0.28s var(--ease-out), border-color 0.28s",
        cursor: href ? "pointer" : "default",
      }}
    >
      {/* Featured badge */}
      {featured && (
        <div style={{
          position: "absolute", top: "0.85rem", right: "0.85rem",
          display: "flex", alignItems: "center", gap: "0.3rem",
          fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "var(--gold)",
          background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)",
          padding: "0.18rem 0.5rem",
        }}>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Featured
        </div>
      )}

      {/* Avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoSrc}
            alt={winner.name}
            style={{
              width: featured ? 52 : 40, height: featured ? 52 : 40,
              borderRadius: "50%", objectFit: "cover",
              border: "1.5px solid rgba(201,168,76,0.3)",
              flexShrink: 0, background: "var(--dark-100)",
            }}
          />
        ) : (
          <div style={{
            width: featured ? 52 : 40, height: featured ? 52 : 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.04))",
            border: "1.5px solid rgba(201,168,76,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: featured ? "0.95rem" : "0.72rem", fontWeight: 700,
            color: "var(--gold)", flexShrink: 0,
          }}>
            {initials(winner.name)}
          </div>
        )}

        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontSize: featured ? "1rem" : "0.82rem",
            fontWeight: featured ? 500 : 500,
            color: "var(--text-primary)", margin: 0, lineHeight: 1.3,
          }}>
            {winner.name}
          </p>
          {winner.company && (
            <p style={{ fontSize: "0.65rem", color: "var(--text-lo)", margin: "0.15rem 0 0", lineHeight: 1.3 }}>
              {winner.company}
            </p>
          )}
        </div>
      </div>

      {/* Category + meta badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
        <span style={{
          fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", color: "var(--gold)",
          background: "rgba(201,168,76,0.1)", padding: "0.2rem 0.55rem",
          border: "1px solid rgba(201,168,76,0.22)",
        }}>
          {winner.category}
        </span>
        {winner.region && (
          <span style={{
            fontSize: "0.55rem", color: "var(--text-4)",
            padding: "0.2rem 0.45rem",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
          }}>
            {winner.region}
          </span>
        )}
        <span style={{
          fontSize: "0.55rem", color: "var(--text-5)",
          marginLeft: "auto", flexShrink: 0,
        }}>
          {quarterLabel(winner.quarter) ? `${quarterLabel(winner.quarter)} · ` : ''}{winner.year}
        </span>
      </div>

      {/* CTA */}
      {href && (
        <p style={{
          fontSize: "0.62rem", fontWeight: 600,
          color: "rgba(201,168,76,0.6)", margin: 0,
          letterSpacing: "0.08em", marginTop: "auto",
          display: "flex", alignItems: "center", gap: "0.4rem",
        }}>
          View profile
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </p>
      )}
    </article>
  );

  if (href) {
    return (
      <Link
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        style={{ display: 'block', textDecoration: 'none', height: '100%' }}
        className="wpage-link"
      >
        {card}
      </Link>
    );
  }
  return <div style={{ height: '100%' }}>{card}</div>;
}

export default async function WinnersPage() {
  const winners = await getWinners();
  const featured = winners.filter((w) => w.featured);
  const rest = winners.filter((w) => !w.featured);

  // Group by year+quarter
  const groups = new Map<string, { label: string; year: number; quarter: number | null; items: Winner[] }>();
  for (const w of rest) {
    const key   = w.quarter ? `Q${w.quarter}-${w.year}` : String(w.year);
    const label = w.quarter ? `Q${w.quarter} ${w.year}` : String(w.year);
    if (!groups.has(key)) groups.set(key, { label, year: w.year, quarter: w.quarter, items: [] });
    groups.get(key)!.items.push(w);
  }

  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── Hero ── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #030510 0%, #060812 60%, var(--dark) 100%)',
        padding: '5.5rem 0 3.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Gradient mesh */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: [
            'radial-gradient(ellipse 65% 60% at 50% 20%, rgba(201,168,76,0.07) 0%, transparent 65%)',
            'radial-gradient(ellipse 35% 40% at 15% 80%, rgba(59,130,246,0.05) 0%, transparent 55%)',
            'radial-gradient(ellipse 30% 35% at 88% 75%, rgba(201,168,76,0.04) 0%, transparent 50%)',
          ].join(','),
        }} />

        {/* Dot matrix */}
        <div aria-hidden="true" className="dot-matrix" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

        {/* Trophy watermark */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '5%', bottom: '-10%',
          opacity: 0.04, pointerEvents: 'none',
        }}>
          <svg width="480" height="480" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="0.4" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
          </svg>
        </div>

        {/* Gold top line */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6) 30%, rgba(232,201,122,0.8) 50%, rgba(201,168,76,0.6) 70%, transparent)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2.5rem', position: 'relative', textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: '1rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: 28, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
            Global Recognition
            <span style={{ width: 28, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
          </div>

          <h1 className="display-xl" style={{ marginBottom: '1.25rem', color: '#fff' }}>
            Award <em>Winners</em>
          </h1>

          <p className="body-lg" style={{ maxWidth: 520, margin: '0 auto 2.5rem', color: 'var(--text-lo)', lineHeight: 1.8 }}>
            Companies and institutions recognised for excellence across global finance,
            FDI, and investment leadership.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link href="/awards" className="btn btn-primary">
              Submit Nomination
            </Link>
            <Link href="/awards" className="btn btn-outline">
              View Award Categories →
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' }}>
            {[
              { value: winners.length || '—', label: 'Total Winners' },
              { value: featured.length || '—', label: 'Featured' },
              { value: groups.size || '—', label: 'Award Periods' },
            ].map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.08)', margin: '0 2.5rem' }} />}
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1, marginBottom: '0.3rem' }}>
                    {s.value}
                  </p>
                  <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-4)' }}>
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Winners grid ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2.5rem 5rem' }}>

        {winners.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 300, color: 'var(--text-4)', marginBottom: '0.5rem' }}>
              Award winners will be announced after each quarterly cycle.
            </p>
            <Link href="/awards" style={{ fontSize: '0.78rem', color: 'var(--gold)', textDecoration: 'none' }}>
              View current award categories →
            </Link>
          </div>
        )}

        {/* Featured winners */}
        {featured.length > 0 && (
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', flexShrink: 0 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Featured Winners
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.2)' }} />
              <span style={{ fontSize: '0.58rem', color: 'var(--text-5)', flexShrink: 0 }}>{featured.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }} className="wpage-featured-grid">
              {featured.map((w) => <WinnerCard key={w.id} winner={w} featured />)}
            </div>
          </div>
        )}

        {/* Grouped winners */}
        {rest.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {[...groups.entries()].map(([key, { label, items }]) => (
              <div key={key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 300,
                    color: 'rgba(201,168,76,0.28)', letterSpacing: '0.08em', flexShrink: 0,
                  }}>
                    {label}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border-faint)' }} />
                  <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-5)', flexShrink: 0 }}>
                    {items.length} {items.length === 1 ? 'winner' : 'winners'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)' }} className="wpage-grid">
                  {items.map((w) => <WinnerCard key={w.id} winner={w} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .wpage-link:hover .wpage-card {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,168,76,0.18) !important;
          border-color: rgba(201,168,76,0.28) !important;
        }
        @media (max-width: 1024px) {
          .wpage-featured-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .wpage-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .wpage-featured-grid { grid-template-columns: 1fr !important; }
          .wpage-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .wpage-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
