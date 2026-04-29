export const dynamic = 'force-dynamic';
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Purtivon delivers FDI intelligence, financial services media, award programmes, and strategic communications for investment promotion agencies, banks, and financial institutions worldwide.',
}

const SERVICES = [
  {
    icon: '◉',
    title: 'FDI and Financial Intelligence',
    tagline: 'Insight that moves capital and shapes policy.',
    desc: 'Purtivon produces authoritative intelligence for both the foreign direct investment community and the broader financial services sector. Our research spans inbound and outbound FDI flows, emerging market entry analysis, cross-border capital trends, banking sector performance, and regulatory developments across key jurisdictions. Investment promotion agencies rely on our reports to sharpen their value proposition to investors, while financial institutions use our intelligence to inform capital allocation, market entry decisions, and strategic planning. Every report is produced by sector specialists and distributed to a curated global audience of decision-makers.',
  },
  {
    icon: '◈',
    title: 'Award Programmes',
    tagline: 'Independent recognition across FDI and financial services.',
    desc: 'Our award programmes serve two distinct but complementary communities. For the FDI sector, we recognise investment promotion agencies, development finance institutions, and government bodies that have delivered outstanding results in attracting and facilitating foreign capital. For financial services, we honour banks, asset managers, capital markets firms, and fintech innovators that have demonstrated excellence in their field. Every nomination is assessed by an independent judging panel against published criteria, ensuring that a Purtivon award carries genuine weight with investors, regulators, and peers globally.',
  },
  {
    icon: '◇',
    title: 'Media & Strategic PR',
    tagline: 'Your story, placed where it matters most.',
    desc: 'We provide integrated media and public relations services designed specifically for organisations operating at the intersection of finance and international investment. Whether you are an investment promotion agency seeking to raise your country\'s profile among global investors, or a financial institution looking to build credibility in new markets, our team manages the full communications lifecycle — from narrative development and press release drafting to journalist outreach and placement in tier-one financial and FDI-focused publications. We understand both audiences and know how to position your message to resonate with each.',
  },
  {
    icon: '⬡',
    title: 'Brand Recognition',
    tagline: 'Position your organisation as the benchmark in your sector.',
    desc: 'Beyond formal award programmes, Purtivon designs bespoke recognition and positioning frameworks for both financial services firms and FDI-focused organisations. For banks and investment firms, this means building a reputation as the preferred partner for institutional clients and capital allocators. For investment promotion agencies and government bodies, it means establishing your jurisdiction as an attractive, credible, and well-governed destination for international capital. Every framework is tailored to your sector, geography, competitive landscape, and the specific investor or client audiences you want to reach.',
  },
  {
    icon: '⟁',
    title: 'Executive Profiling',
    tagline: 'Elevate your leadership as a voice of global authority.',
    desc: 'Purtivon helps senior leaders across both financial services and the FDI world build the public profiles that open doors. For executives at banks, asset managers, and financial institutions, we secure thought leadership placements, speaking opportunities at major industry events, and editorial contributions to publications read by their peers and clients. For ministers, agency directors, and government officials working to attract investment, we craft compelling personal narratives that reinforce confidence in their leadership and in their country\'s investment environment. Profile matters — and we know how to build it.',
  },
]

export default function ServicesPage() {
  return (
    <div className="flex-1 pt-24">

      {/* ── Hero with services-hero.jpg ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/images/services-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Dark overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.25) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '3rem 2.5rem 2.5rem',
            maxWidth: 1280,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div style={{ maxWidth: 680 }}>
            <div
              className="eyebrow"
              style={{ marginBottom: '1.25rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
            >
              Our Services
            </div>
            <h1
              className="display-xl"
              style={{
                marginBottom: '1.75rem',
                color: '#fff',
                textShadow: '0 2px 8px rgba(0,0,0,0.7)',
              }}
            >
              Serving the world&apos;s financial institutions and{' '}
              <em>investment communities</em>
            </h1>
            <p
              className="body-lg"
              style={{
                marginBottom: '2.5rem',
                color: 'rgba(240,237,230,0.92)',
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
              }}
            >
              Purtivon works with two distinct but interconnected communities — the global financial
              services sector and the foreign direct investment world. From banks and asset managers
              to investment promotion agencies and development finance institutions, we deliver
              intelligence, recognition, and communications that build credibility, attract capital,
              and open markets.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary">
                Enquire Now
              </Link>
              <Link href="/awards" className="btn btn-outline-white">
                Browse Awards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services grid ── */}
      <section className="section section--alt">
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              background: 'var(--border)',
              border: '1px solid var(--border)',
            }}
          >
            {SERVICES.map(({ icon, title, tagline, desc }, i) => (
              <ScrollReveal key={title} delay={i * 0.05}>
                <div
                  className="card card-lift"
                  style={{
                    border: 'none',
                    borderRadius: 0,
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr',
                    gap: '2.5rem',
                    alignItems: 'start',
                  }}
                  data-service-card
                >
                  <div style={{ paddingTop: '0.25rem' }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        border: '1px solid var(--border-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        color: 'var(--gold)',
                        fontSize: '1.1rem',
                      }}
                      aria-hidden="true"
                    >
                      {icon}
                    </div>
                    <span className="badge badge--outline" style={{ fontSize: '0.6rem' }}>
                      0{i + 1}
                    </span>
                  </div>
                  <div>
                    <h2 className="heading" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                      {title}
                    </h2>
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        color: 'var(--gold)',
                        fontSize: '0.95rem',
                        marginBottom: '1.25rem',
                      }}
                    >
                      {tagline}
                    </p>
                    <p className="body-lg">{desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 560px) { [data-service-card] { grid-template-columns: 1fr !important; gap: 1rem !important; } }
        `}</style>
      </section>

      {/* ── CTA ── */}
      <section
        className="section"
        style={{ position: 'relative', textAlign: 'center', overflow: 'hidden', borderTop: '1px solid var(--border)' }}
      >
        {/* Background image */}
        <Image
          src="/images/flight-routes.jpg"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
        />
        {/* Dark overlay */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)', zIndex: 1 }} />
        {/* Gold radial glow */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 2 }} />

        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          <ScrollReveal>
            <div
              aria-hidden="true"
              style={{
                width: 64,
                height: 1,
                background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                margin: '0 auto 3rem',
              }}
            />
            <h2 className="display-lg" style={{ marginBottom: '1.25rem', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
              Ready to get <em>started?</em>
            </h2>
            <p className="body-lg" style={{ maxWidth: 500, margin: '0 auto 3rem', color: 'rgba(240,237,230,0.92)', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              Whether you represent a financial institution, an investment promotion agency, or a
              government body seeking to attract capital, our team will identify which services best
              align with your objectives. Most engagements begin with a complimentary consultation.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Contact Us Today
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
