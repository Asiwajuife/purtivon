export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Purtivon delivers FDI intelligence, financial services media, award programmes, and strategic communications for investment promotion agencies, banks, and financial institutions worldwide.',
};

const SERVICES = [
  {
    num: '01',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: 'FDI and Financial Intelligence',
    tagline: 'Insight that moves capital and shapes policy.',
    desc: 'Purtivon produces authoritative intelligence for both the foreign direct investment community and the broader financial services sector. Our research spans inbound and outbound FDI flows, emerging market entry analysis, cross-border capital trends, banking sector performance, and regulatory developments across key jurisdictions. Investment promotion agencies rely on our reports to sharpen their value proposition, while financial institutions use our intelligence to inform capital allocation and strategic planning.',
  },
  {
    num: '02',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
      </svg>
    ),
    title: 'Award Programmes',
    tagline: 'Independent recognition across FDI and financial services.',
    desc: 'Our award programmes serve two distinct but complementary communities. For the FDI sector, we recognise investment promotion agencies, development finance institutions, and government bodies that have delivered outstanding results in attracting and facilitating foreign capital. For financial services, we honour banks, asset managers, capital markets firms, and fintech innovators. Every nomination is assessed by an independent judging panel against published criteria, ensuring a Purtivon award carries genuine weight globally.',
  },
  {
    num: '03',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
      </svg>
    ),
    title: 'Media & Strategic PR',
    tagline: 'Your story, placed where it matters most.',
    desc: 'We provide integrated media and public relations services designed specifically for organisations operating at the intersection of finance and international investment. Whether you are an investment promotion agency seeking to raise your country\'s profile among global investors, or a financial institution looking to build credibility in new markets, our team manages the full communications lifecycle — from narrative development and press release drafting to journalist outreach and placement in tier-one financial publications.',
  },
  {
    num: '04',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    title: 'Brand Recognition',
    tagline: 'Position your organisation as the benchmark in your sector.',
    desc: 'Beyond formal award programmes, Purtivon designs bespoke recognition and positioning frameworks for both financial services firms and FDI-focused organisations. For banks and investment firms, this means building a reputation as the preferred partner for institutional clients and capital allocators. For investment promotion agencies and government bodies, it means establishing your jurisdiction as an attractive, credible, and well-governed destination for international capital. Every framework is tailored to your sector, geography, and the specific audiences you want to reach.',
  },
  {
    num: '05',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    title: 'Executive Profiling',
    tagline: 'Elevate your leadership as a voice of global authority.',
    desc: 'Purtivon helps senior leaders across both financial services and the FDI world build the public profiles that open doors. For executives at banks, asset managers, and financial institutions, we secure thought leadership placements, speaking opportunities at major industry events, and editorial contributions to publications read by their peers and clients. For ministers, agency directors, and government officials working to attract investment, we craft compelling personal narratives that reinforce confidence in their leadership.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Discovery Call',
    desc: 'We begin with a complimentary consultation to understand your organisation, your objectives, and the audiences you need to reach. No obligation, no generic pitch.',
  },
  {
    step: '02',
    title: 'Tailored Programme',
    desc: 'Our team designs a bespoke engagement — combining the services that best serve your goals, whether that is a single award nomination or a comprehensive communications and intelligence retainer.',
  },
  {
    step: '03',
    title: 'Delivery & Impact',
    desc: 'We execute, measure, and iterate. You receive tangible outcomes: recognition, media placements, intelligence products, and the credibility that opens doors in your target markets.',
  },
];

export default function ServicesPage() {
  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '72vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <Image src="/images/services-hero.jpg" alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', opacity: 0.45 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(4,6,18,0.95) 0%, rgba(4,6,18,0.65) 55%, rgba(4,6,18,0.3) 100%)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,6,18,0.9) 0%, transparent 50%)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '5rem 2.5rem 4rem', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: 700 }}>
            <div className="eyebrow" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: 32, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
              Our Services
            </div>
            <h1 className="display-xl" style={{ marginBottom: '1.75rem', color: '#fff' }}>
              Serving the world&apos;s financial
              institutions and <em>investment communities</em>
            </h1>
            <p className="body-lg" style={{ marginBottom: '2.5rem', color: 'rgba(240,237,230,0.85)', maxWidth: 580 }}>
              From intelligence and awards to media and executive profiling —
              Purtivon delivers credibility, visibility, and recognition for the
              institutions that move global capital.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary hero-cta-glow">Enquire Now</Link>
              <Link href="/awards" className="btn btn-outline-white">Browse Awards</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services cards ── */}
      <section className="section section--alt" aria-label="Our service offerings">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {SERVICES.map(({ num, icon, title, tagline, desc }, i) => (
              <ScrollReveal key={title} delay={i * 0.06}>
                <div
                  className="svc-card"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr',
                    gap: '2.5rem',
                    alignItems: 'start',
                    background: 'rgba(10,12,22,0.65)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderLeft: '3px solid rgba(201,168,76,0.25)',
                    padding: '2.25rem 2.5rem',
                    transition: 'border-left-color 0.3s, box-shadow 0.3s, transform 0.3s',
                    cursor: 'default',
                  }}
                >
                  {/* Left col */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 52, height: 52,
                      border: '1px solid rgba(201,168,76,0.25)',
                      background: 'rgba(201,168,76,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#C9A84C',
                      transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s',
                    }} className="svc-icon">
                      {icon}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.6rem',
                      fontWeight: 300,
                      color: 'rgba(201,168,76,0.25)',
                      lineHeight: 1,
                      transition: 'color 0.3s',
                    }} className="svc-num">
                      {num}
                    </span>
                  </div>

                  {/* Content col */}
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 300, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      {title}
                    </h2>
                    <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
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
          .svc-card:hover { border-left-color: var(--gold) !important; box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.12) !important; transform: translateY(-2px); }
          .svc-card:hover .svc-icon { border-color: rgba(201,168,76,0.5) !important; background: rgba(201,168,76,0.12) !important; box-shadow: 0 0 20px rgba(201,168,76,0.2) !important; }
          .svc-card:hover .svc-num { color: rgba(201,168,76,0.55) !important; }
          @media (max-width: 640px) { .svc-card { grid-template-columns: 1fr !important; gap: 1.25rem !important; } }
        `}</style>
      </section>

      {/* ── How It Works ── */}
      <section className="section" aria-label="How we work">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto 4rem' }}>
              <div className="eyebrow" style={{ marginBottom: '0.75rem', justifyContent: 'center', display: 'flex' }}>How We Work</div>
              <h2 className="display-md">Three steps to <em>recognised excellence</em></h2>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', position: 'relative' }} className="how-grid">
            {/* Connecting line */}
            <div aria-hidden="true" style={{
              position: 'absolute',
              top: 24, left: 'calc(33.33% / 2)',
              right: 'calc(33.33% / 2)',
              height: 1,
              background: 'linear-gradient(90deg, var(--gold-dim), var(--gold), var(--gold-dim))',
              opacity: 0.4,
            }} className="how-line" />

            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <ScrollReveal key={step} delay={i * 0.12}>
                <div style={{ padding: '0 2rem', textAlign: 'center', position: 'relative' }}>
                  {/* Step circle */}
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: '50%',
                    border: '1px solid rgba(201,168,76,0.35)',
                    background: 'rgba(201,168,76,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.75rem',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1rem',
                    color: 'var(--gold)',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 0 0 4px var(--dark)',
                  }}>
                    {step}
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    {title}
                  </h3>
                  <p className="body-sm" style={{ maxWidth: 280, margin: '0 auto' }}>{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 760px) {
            .how-grid { grid-template-columns: 1fr !important; }
            .how-line { display: none !important; }
          }
        `}</style>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', textAlign: 'center', overflow: 'hidden', minHeight: 400, display: 'flex', alignItems: 'center' }}>
        <Image src="/images/flight-routes.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover', opacity: 0.18 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(4,6,18,0.85)', zIndex: 1 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 65%)', zIndex: 1 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '4rem', paddingBottom: '4rem' }}>
          <ScrollReveal>
            <div aria-hidden="true" style={{ width: 56, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '0 auto 2rem' }} />
            <h2 className="display-lg" style={{ marginBottom: '1.25rem', color: '#fff' }}>
              Ready to get <em>started?</em>
            </h2>
            <p className="body-lg" style={{ maxWidth: 480, margin: '0 auto 2.5rem', color: 'rgba(240,237,230,0.82)' }}>
              Most engagements begin with a complimentary consultation.
              Our team will identify which services best align with your objectives.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg hero-cta-glow">Contact Us Today</Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
