import Link from 'next/link'

const SERVICES = [
  {
    icon: '◉',
    title: 'FDI Intelligence',
    desc: 'In-depth research reports, market analysis, and investment intelligence covering emerging and developed markets across four continents. Tracking capital flows in real time.',
    highlight: true,
  },
  {
    icon: '⬡',
    title: 'Financial Intelligence',
    desc: 'Comprehensive financial services intelligence — regulatory landscapes, banking sector analysis, capital market dynamics, and cross-border transaction monitoring.',
    highlight: true,
  },
  {
    icon: '◇',
    title: 'Media & PR',
    desc: 'Strategic communications, press release distribution, and media placement across leading global financial publications and wire services.',
    highlight: false,
  },
  {
    icon: '◈',
    title: 'Award Programmes',
    desc: 'Prestigious recognition across FDI, financial services, ESG, and capital markets. Our rigorous judging process ensures every award carries genuine weight.',
    highlight: false,
  },
  {
    icon: '⟁',
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
          {SERVICES.map(({ icon, title, desc, highlight }, i) => (
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
                <div style={{ width: 40, height: 40, border: `1px solid ${highlight ? 'rgba(201,168,76,0.5)' : 'var(--border-gold)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '1rem', flexShrink: 0 }} aria-hidden="true">
                  {icon}
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
