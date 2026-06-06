export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Purtivon is a global award and media PR consultancy serving the foreign direct investment and financial services communities. Learn about our mission, values, and the sectors we work with.',
};

const VALUES = [
  {
    title: 'Integrity',
    desc: 'Every award is decided by an independent judging panel. We maintain strict separation between commercial relationships and editorial outcomes — without exception.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: 'Rigour',
    desc: 'Nominations are assessed against published criteria. We do not recognise every entrant — our awards carry weight precisely because not everyone wins.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
      </svg>
    ),
  },
  {
    title: 'Global Perspective',
    desc: 'We operate across 48 countries and six continents. Our intelligence and recognition programmes reflect the full breadth of global capital markets and investment flows.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
      </svg>
    ),
  },
  {
    title: 'Impact',
    desc: 'Recognition should create tangible value. We measure success by the opportunities our awards open for winners and the capital our intelligence helps to direct.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

const INDUSTRIES = [
  { name: 'Investment Promotion', icon: '◈', desc: 'National and regional investment promotion agencies seeking to attract foreign direct investment.' },
  { name: 'Development Finance', icon: '⬡', desc: 'DFIs and multilateral lenders financing infrastructure across emerging and frontier markets.' },
  { name: 'Banking',             icon: '◉', desc: 'Commercial and investment banks recognised for cross-border excellence and capital facilitation.' },
  { name: 'Asset Management',    icon: '◇', desc: 'Asset managers, PE firms, and sovereign wealth funds allocating capital globally.' },
  { name: 'Fintech',             icon: '⟁', desc: 'Technology-driven financial companies transforming payments, lending, and capital markets.' },
  { name: 'Infrastructure',      icon: '◈', desc: 'Project developers and investors financing energy, transport, and digital infrastructure.' },
  { name: 'Sustainability',      icon: '◉', desc: 'ESG-focused funds, green bond issuers, and impact investors driving sustainable capital flows.' },
  { name: 'Financial Advisory',  icon: '◇', desc: 'M&A advisory, wealth management, and consulting firms guiding complex capital decisions.' },
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── Cinematic Hero ── */}
      <section
        style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
        aria-label="About Purtivon"
      >
        <Image
          src="/images/about-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center top', opacity: 0.55 }}
        />
        {/* Multi-layer overlay for cinematic depth */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(4,6,18,0.92) 0%, rgba(4,6,18,0.65) 55%, rgba(4,6,18,0.35) 100%)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,6,18,0.9) 0%, transparent 50%)' }} />

        {/* Dot matrix */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div className="about-hero-inner" style={{ position: 'relative', zIndex: 1, padding: '5rem 2.5rem 4rem', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: 32, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
              About Purtivon
            </div>
            <h1 className="display-xl" style={{ marginBottom: '1.75rem', color: '#fff' }}>
              Where <em>investment excellence</em>
              <br />meets global recognition
            </h1>
            <p className="body-lg" style={{ maxWidth: 560, marginBottom: '2.5rem', color: 'rgba(240,237,230,0.85)' }}>
              Purtivon is a specialist award and media PR consultancy operating at the intersection
              of foreign direct investment and international financial services. We ensure the institutions,
              agencies, and firms driving global capital flows receive the recognition they deserve.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/awards" className="btn btn-primary">View Our Awards</Link>
              <Link href="/contact" className="btn btn-outline-white">Get in Touch</Link>
            </div>
          </div>

          {/* Animated stat counters */}
          <div className="about-hero-stats" style={{
            display: 'flex', gap: '3.5rem', marginTop: '5rem',
            paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)',
            flexWrap: 'wrap',
          }}>
            {[
              { value: '48',   label: 'Countries Covered' },
              { value: '500+', label: 'Institutions Featured' },
              { value: '5',    label: 'Years of Excellence' },
            ].map(({ value, label }) => (
              <div key={label}>
                <AnimatedCounter
                  value={value}
                  label={label}
                  style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#C9A84C', lineHeight: 1 }}
                  labelStyle={{ marginTop: '0.3rem', color: 'rgba(255,255,255,0.45)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission — two-column pull quote layout ── */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden', background: '#060812' }} aria-label="Our mission">
        <Image src="/images/mission-bg.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover', opacity: 0.12 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(4,6,18,0.88)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '6rem', alignItems: 'start' }} className="about-split">
            <ScrollReveal>
              {/* Large pull quote (left) */}
              <div>
                <div className="eyebrow" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: 28, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
                  Our Mission
                </div>
                <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1.75rem', marginBottom: '2rem' }}>
                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.3rem, 2.2vw, 1.85rem)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    lineHeight: 1.45,
                    color: '#F0EDE6',
                  }}>
                    &ldquo;Connecting capital with the recognition it deserves.&rdquo;
                  </p>
                </div>
                <Link href="/awards" className="btn btn-outline btn-sm">Explore Our Awards →</Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div style={{ paddingTop: '2.5rem' }}>
                <h2 className="display-md mission-shimmer-heading" style={{ marginBottom: '1.75rem', color: '#fff' }}>
                  Elevating the institutions<br /><em>shaping the global economy</em>
                </h2>
                <p className="body-lg" style={{ marginBottom: '1.5rem', color: 'rgba(240,237,230,0.82)' }}>
                  Excellent work in foreign direct investment and financial services too often goes
                  unrecognised. The agencies attracting transformative investment into emerging
                  markets, the banks pioneering sustainable finance, and the funds facilitating
                  landmark cross-border transactions rarely receive the visibility their impact warrants.
                </p>
                <p className="body-lg" style={{ marginBottom: '1.5rem', color: 'rgba(240,237,230,0.82)' }}>
                  Purtivon exists to change that. Through independent award programmes, strategic
                  media PR, and authoritative FDI intelligence, we elevate organisations shaping
                  the global economy — and ensure the right audiences take notice.
                </p>
                <p className="body-lg" style={{ color: 'rgba(240,237,230,0.82)' }}>
                  Our work bridges two deeply interdependent communities: the investment promotion
                  and development finance world that facilitates the movement of capital, and the
                  financial services sector that deploys it.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .about-split { grid-template-columns: 1fr !important; gap: 3rem !important; } }
          @media (max-width: 640px) {
            .about-hero-inner { padding: 3rem 1.25rem 2.5rem !important; }
            .about-hero-stats { margin-top: 2.5rem !important; gap: 2rem !important; }
          }
        `}</style>
      </section>

      {/* ── Values — glassmorphism card grid ── */}
      <section className="section section--alt" aria-label="Our values">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 3.5rem' }}>
              <div className="eyebrow" style={{ marginBottom: '0.75rem', justifyContent: 'center', display: 'flex' }}>What We Stand For</div>
              <h2 className="display-md">Our core <em>values</em></h2>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="values-grid">
            {VALUES.map(({ title, desc, icon }, i) => (
              <ScrollReveal key={title} delay={i * 0.08}>
                <div
                  className="card--glass card-lift"
                  style={{
                    padding: '2rem 1.75rem',
                    height: '100%',
                    display: 'flex', flexDirection: 'column', gap: '1rem',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(10,12,22,0.72)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44,
                    borderRadius: '50%',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#C9A84C',
                    flexShrink: 0,
                  }}>
                    {icon}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400, color: '#C9A84C' }}>{title}</h3>
                  <p className="body-sm" style={{ color: 'rgba(240,237,230,0.72)', flex: 1 }}>{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 1024px) { .values-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 560px)  { .values-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ── Who We Serve ── */}
      <section className="section" aria-label="Who we serve">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start', marginBottom: '3.5rem' }} className="about-split">
            <ScrollReveal>
              <div className="eyebrow" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: 28, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
                Who We Serve
              </div>
              <h2 className="display-md" style={{ marginBottom: '1.25rem' }}>
                Two communities.<br /><em>One standard</em> of excellence.
              </h2>
              <p className="body-lg">
                Purtivon serves organisations across the foreign direct investment ecosystem and
                the broader financial services sector. While these communities operate in different
                contexts, they share a common need: credible, independent recognition that carries
                weight with investors, regulators, and peers worldwide.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingTop: '0.75rem' }}>
                {[
                  {
                    title: 'The FDI Community',
                    body: 'Investment promotion agencies, economic development boards, government ministries, development finance institutions, and free zone authorities working to attract, facilitate, and grow foreign direct investment in their jurisdictions.',
                  },
                  {
                    title: 'The Financial Services Sector',
                    body: 'Banks, asset managers, private equity firms, fintech companies, capital markets specialists, insurance groups, and financial advisory firms operating across global markets and seeking recognition for their performance, innovation, and impact.',
                  },
                ].map(({ title, body }) => (
                  <div key={title} style={{
                    padding: '1.75rem',
                    background: 'rgba(10,12,22,0.6)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderLeft: '3px solid var(--gold)',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--gold)', marginBottom: '0.75rem' }}>{title}</p>
                    <p className="body-sm">{body}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section className="section section--alt" aria-label="Industries served">
        <div className="container">
          <ScrollReveal>
            <div style={{ maxWidth: 560, marginBottom: '3.5rem' }}>
              <div className="eyebrow" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: 28, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
                Industries Served
              </div>
              <h2 className="display-md" style={{ marginBottom: '1rem' }}>
                Built for the world&apos;s <em>investment community</em>
              </h2>
              <p className="body-lg">
                From national agencies to global banks, Purtivon&apos;s programmes are designed
                for the institutions that move capital — and the sectors that depend on it.
              </p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }} className="ind-grid">
            {INDUSTRIES.map(({ name, icon, desc }, i) => (
              <ScrollReveal key={name} delay={i * 0.05}>
                <div className="card card-lift" style={{
                  border: '1px solid var(--border)',
                  background: 'var(--dark-100)',
                  padding: '1.5rem',
                  height: '100%',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    color: 'rgba(201,168,76,0.5)',
                    marginBottom: '0.75rem',
                    lineHeight: 1,
                  }} aria-hidden="true">
                    {icon}
                  </div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400, color: 'var(--gold)', marginBottom: '0.6rem' }}>{name}</p>
                  <p className="body-sm" style={{ fontSize: '0.8rem', color: 'var(--text-lo)' }}>{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .ind-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 480px) { .ind-grid { grid-template-columns: 1fr !important; } }
          @media (max-width: 900px) { .about-split { grid-template-columns: 1fr !important; gap: 3rem !important; } }
        `}</style>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', textAlign: 'center', overflow: 'hidden', minHeight: 400, display: 'flex', alignItems: 'center' }}>
        <Image src="/images/globe-routes.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover', opacity: 0.2 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(4,6,18,0.82)', zIndex: 1 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 65%)', zIndex: 1 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '4rem', paddingBottom: '4rem' }}>
          <ScrollReveal>
            <div aria-hidden="true" style={{ width: 56, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '0 auto 2rem' }} />
            <h2 className="display-lg" style={{ marginBottom: '1.25rem', color: '#fff' }}>
              Work with <em>Purtivon</em>
            </h2>
            <p className="body-lg" style={{ maxWidth: 480, margin: '0 auto 2.5rem', color: 'rgba(240,237,230,0.82)' }}>
              Whether you represent an investment promotion agency, a financial institution, or a
              government body seeking to attract capital, we would be glad to discuss how Purtivon
              can serve your organisation.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary btn-lg hero-cta-glow">Contact Us</Link>
              <Link href="/services" className="btn btn-border-glow btn-lg">Our Services</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
