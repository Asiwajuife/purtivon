import Link from 'next/link'

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20} aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20} aria-hidden="true">
    <path d="M3 3v18h18"/>
    <path d="M18 17V9M13 17V5M8 17v-3"/>
  </svg>
)

const BroadcastIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20} aria-hidden="true">
    <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35z"/>
    <path d="M6 18h12M6 14h12M6 10h12"/>
  </svg>
)

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20} aria-hidden="true">
    <path d="M8 21h8M12 17v4M17 10a5 5 0 0 1-10 0V5h10v5z"/>
    <path d="M7 5H5a2 2 0 0 0-2 2v2a2 2 0 0 1 2 2h2M17 5h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/>
  </svg>
)

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20} aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const SERVICES = [
  {
    Icon: GlobeIcon,
    title: 'FDI Intelligence',
    desc: 'In-depth research reports, market analysis, and investment intelligence covering emerging and developed markets across four continents. Tracking capital flows in real time.',
    highlight: true,
  },
  {
    Icon: ChartIcon,
    title: 'Financial Intelligence',
    desc: 'Comprehensive financial services intelligence — regulatory landscapes, banking sector analysis, capital market dynamics, and cross-border transaction monitoring.',
    highlight: true,
  },
  {
    Icon: BroadcastIcon,
    title: 'Media & PR',
    desc: 'Strategic communications, press release distribution, and media placement across leading global financial publications and wire services.',
    highlight: false,
  },
  {
    Icon: TrophyIcon,
    title: 'Award Programmes',
    desc: 'Prestigious recognition across FDI, financial services, ESG, and capital markets. Our rigorous judging process ensures every award carries genuine weight.',
    highlight: false,
  },
  {
    Icon: ProfileIcon,
    title: 'Executive Profiling',
    desc: 'Thought leadership campaigns, executive interviews, and speaker placement that establish your leadership team as voices of authority.',
    highlight: false,
  },
] as const

export default function ServicesSection() {
  return (
    <section className="section section--alt" aria-labelledby="services-heading">
      <div className="container">
        <div className="section-header" style={{ maxWidth: 580 }}>
          <div className="eyebrow">What We Do</div>
          <h2 id="services-heading" className="display-md" style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
            FDI & Financial Services <em>Intelligence</em>
          </h2>
          <p className="body-lg">
            From intelligence reports to award programmes and strategic media, we provide every
            tool a financial organisation needs to claim its place on the global stage.
          </p>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1.25rem' }}
          className="svc-responsive"
        >
          {SERVICES.map(({ Icon, title, desc, highlight }, i) => (
            <article
              key={title}
              className={`svc-card svc-card--${i + 1}`}
              style={{
                background: highlight ? 'rgba(201,168,76,0.04)' : 'var(--dark-200)',
                border: '1px solid var(--border)',
                borderTop: `2px solid ${highlight ? 'var(--gold)' : 'var(--gold-dim)'}`,
                borderRadius: 4,
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'border-color 0.25s, background 0.25s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, border: `1px solid ${highlight ? 'rgba(201,168,76,0.5)' : 'var(--border-gold)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }} aria-hidden="true">
                  <Icon />
                </div>
                <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--gold-dim)', opacity: 0.7 }}>0{i + 1}</span>
              </div>
              <h3 className="heading" style={{ fontSize: '1.05rem', marginBottom: 0, color: highlight ? 'var(--gold)' : undefined }}>
                {title}
              </h3>
              <p className="body-sm" style={{ lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>{desc}</p>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/services" className="btn btn-outline">View All Services →</Link>
        </div>
      </div>

      <style>{`
        .svc-card--1 { grid-column: 1 / 3; }
        .svc-card--2 { grid-column: 3 / 5; }
        .svc-card--3 { grid-column: 5 / 7; }
        .svc-card--4 { grid-column: 2 / 4; }
        .svc-card--5 { grid-column: 4 / 6; }
        .svc-card:hover { border-color: var(--border-gold) !important; background: rgba(201,168,76,0.04) !important; }
        @media (max-width: 900px) {
          .svc-responsive { grid-template-columns: 1fr 1fr !important; }
          .svc-card { grid-column: auto !important; }
        }
        @media (max-width: 560px) {
          .svc-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
