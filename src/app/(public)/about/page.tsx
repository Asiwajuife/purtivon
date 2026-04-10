import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Purtivon is a global award and media PR consultancy serving the foreign direct investment and financial services communities. Learn about our mission, values, and the sectors we work with.',
}

const VALUES = [
  {
    title: 'Integrity',
    desc: 'Every award is decided by an independent judging panel. We maintain strict separation between commercial relationships and editorial outcomes — without exception.',
  },
  {
    title: 'Rigour',
    desc: 'Nominations are assessed against published criteria. We do not recognise every entrant — our awards carry weight precisely because not everyone wins.',
  },
  {
    title: 'Global Perspective',
    desc: 'We operate across 48 countries and six continents. Our intelligence and recognition programmes reflect the full breadth of global capital markets and investment flows.',
  },
  {
    title: 'Impact',
    desc: 'Recognition should create tangible value. We measure success by the opportunities our awards open for winners and the capital our intelligence helps to direct.',
  },
]

const INDUSTRIES = [
  {
    name: 'Investment Promotion',
    desc: 'National and regional investment promotion agencies seeking to raise their profile and attract foreign direct investment into their jurisdictions.',
  },
  {
    name: 'Development Finance',
    desc: 'Development finance institutions and multilateral lenders financing infrastructure, industry, and growth across emerging and frontier markets.',
  },
  {
    name: 'Banking',
    desc: 'Commercial and investment banks recognised for innovation, cross-border excellence, and their role in facilitating international capital flows.',
  },
  {
    name: 'Asset Management',
    desc: 'Asset managers, private equity firms, and sovereign wealth funds allocating capital across global markets and asset classes.',
  },
  {
    name: 'Fintech',
    desc: 'Technology-driven financial companies transforming payments, lending, and capital markets infrastructure across developed and emerging economies.',
  },
  {
    name: 'Infrastructure',
    desc: 'Project developers and investors financing energy, transport, and digital infrastructure across the globe.',
  },
  {
    name: 'Sustainability',
    desc: 'ESG-focused funds, green bond issuers, and impact investors driving sustainable capital flows and responsible investment.',
  },
  {
    name: 'Financial Advisory',
    desc: 'M&A advisory, wealth management, and consulting firms guiding governments, institutions, and private clients through complex capital decisions.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex-1 pt-24">

      {/* Hero */}
      <section style={{ padding: '5rem 2.5rem 4rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: '1.25rem' }}>About Purtivon</div>
          <h1 className="display-xl" style={{ marginBottom: '1.75rem' }}>
            Where <em>investment excellence</em> meets global recognition
          </h1>
          <p className="body-lg" style={{ maxWidth: 600, marginBottom: '1.25rem' }}>
            Purtivon is a specialist award and media PR consultancy operating at the intersection
            of foreign direct investment and international financial services. We exist to ensure
            that the institutions, agencies, and firms driving global capital flows receive the
            recognition, visibility, and intelligence they deserve.
          </p>
          <p className="body-lg" style={{ maxWidth: 600, marginBottom: '2.5rem' }}>
            From investment promotion agencies and development finance institutions to banks,
            asset managers, and fintech innovators — we serve the full spectrum of the global
            investment community.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/awards" className="btn btn-primary">View Our Awards</Link>
            <Link href="/contact" className="btn btn-outline">Get in Touch</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section--alt">
        <div className="container">
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}
            className="stats-responsive"
          >
            {[
              { value: '48',    label: 'Countries Covered' },
              { value: '500+', label: 'Institutions Featured' },
              { value: '5',     label: 'Years of Excellence' },
            ].map(({ value, label }) => (
              <div key={label} className="card" style={{ border: 'none', borderRadius: 0, textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1, marginBottom: '0.5rem' }}>{value}</p>
                <p className="label">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 600px) { .stats-responsive { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }} className="split-responsive">
            <div>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>Our Mission</div>
              <h2 className="display-md" style={{ marginBottom: '1.5rem' }}>
                Connecting <em>capital</em> with the recognition it deserves
              </h2>
              <p className="body-lg" style={{ marginBottom: '1.5rem' }}>
                Excellent work in foreign direct investment and financial services too often goes
                unrecognised. The agencies attracting transformative investment into emerging
                markets, the banks pioneering sustainable finance, and the funds facilitating
                landmark cross-border transactions rarely receive the visibility their impact warrants.
              </p>
              <p className="body-lg" style={{ marginBottom: '1.5rem' }}>
                Purtivon exists to change that. Through independent award programmes, strategic
                media PR, and authoritative FDI and financial intelligence, we elevate the
                organisations shaping the global economy — and ensure the right audiences
                take notice.
              </p>
              <p className="body-lg">
                Our work bridges two communities that are deeply interdependent: the investment
                promotion and development finance world that facilitates the movement of capital,
                and the financial services sector that deploys it. Understanding both is what
                makes Purtivon uniquely positioned to serve either.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
              {VALUES.map(({ title, desc }) => (
                <div key={title} className="card" style={{ border: 'none', borderRadius: 0 }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--gold)', marginBottom: '0.75rem' }}>{title}</p>
                  <p className="body-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 900px) { .split-responsive { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
      </section>

      {/* Who We Serve */}
      <section className="section section--alt">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start', marginBottom: '3rem' }} className="split-responsive">
            <div>
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>Who We Serve</div>
              <h2 className="display-md" style={{ marginBottom: '1.25rem' }}>
                Two communities. <em>One standard</em> of excellence.
              </h2>
              <p className="body-lg">
                Purtivon serves organisations across the foreign direct investment ecosystem and
                the broader financial services sector. While these communities operate in different
                contexts, they share a common need: credible, independent recognition that carries
                weight with investors, regulators, and peers worldwide.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '0.5rem' }}>
              <div style={{ borderLeft: '2px solid var(--border-gold)', paddingLeft: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>The FDI Community</p>
                <p className="body-sm">
                  Investment promotion agencies, economic development boards, government ministries,
                  development finance institutions, and free zone authorities working to attract,
                  facilitate, and grow foreign direct investment in their jurisdictions.
                </p>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-gold)', paddingLeft: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>The Financial Services Sector</p>
                <p className="body-sm">
                  Banks, asset managers, private equity firms, fintech companies, capital markets
                  specialists, insurance groups, and financial advisory firms operating across
                  global markets and seeking recognition for their performance, innovation, and impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 560, marginBottom: '3rem' }}>
            <div className="eyebrow">Industries Served</div>
            <h2 className="display-md" style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
              Built for the world&apos;s <em>investment community</em>
            </h2>
            <p className="body-lg">
              From national agencies to global banks, Purtivon&apos;s programmes are designed
              for the institutions that move capital — and the sectors that depend on it.
            </p>
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}
            className="industries-responsive"
          >
            {INDUSTRIES.map(({ name, desc }) => (
              <div key={name} className="card" style={{ border: 'none', borderRadius: 0 }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--gold)', marginBottom: '0.65rem' }}>{name}</p>
                <p className="body-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .industries-responsive { grid-template-columns: 1fr 1fr !important; } }
          @media (max-width: 560px) { .industries-responsive { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* CTA */}
      <section className="section section--alt" style={{ textAlign: 'center' }}>
        <div className="container">
          <div aria-hidden="true" style={{ width: 64, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '0 auto 3rem' }} />
          <h2 className="display-lg" style={{ marginBottom: '1.25rem' }}>Work with <em>Purtivon</em></h2>
          <p className="body-lg" style={{ maxWidth: 500, margin: '0 auto 3rem' }}>
            Whether you represent an investment promotion agency, a financial institution, or a
            government body seeking to attract capital, we would be glad to discuss how Purtivon
            can serve your organisation.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Contact Us</Link>
            <Link href="/services" className="btn btn-outline btn-lg">Our Services</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
