export const dynamic = 'force-dynamic';
import type { Metadata } from 'next'
import type React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ARTICLES } from '@/app/api/articles/route'
import FeaturedArticles from '@/components/home/FeaturedArticles'
import type { HomepageArticle } from '@/components/home/FeaturedArticles'
import AwardWinners from '@/components/home/AwardWinners'
import type { Winner } from '@/components/home/AwardWinners'
import CategorySection from '@/components/home/CategorySection'
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel'
import PodcastSection from '@/components/home/PodcastSection'
import HomeHero from '@/components/home/HomeHero'
import HomeCTABanner from '@/components/home/HomeCTABanner'

export const metadata: Metadata = {
  title: 'Purtivon — Global FDI & Financial Services Awards',
  description:
    'The leading awards and media PR consultancy for foreign direct investment and international financial services. Recognising excellence across global capital markets.',
}

const CATEGORY_ORDER = [
  'Featured Insight',
  'Awards',
  'Report',
  'News',
  'Analysis',
  'FDI Intelligence',
  'Financial Services Intelligence',
  'Banks',
  'Economy',
  'Tech',
  'ESG',
]

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function LatestInsights({ articles }: { articles: HomepageArticle[] }) {
  if (articles.length === 0) return null

  return (
    <section
      style={{
        background: 'var(--dark-100)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '3rem 0 3.25rem',
      }}
      aria-label="Latest insights"
    >
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: 28, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
              Latest Intelligence
            </div>
            <h2 className="display-md">Recent <em>Insights</em></h2>
          </div>
          <Link href="/insights" className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>Browse All →</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', width: '100%' }} className="latest-grid">
        {articles.slice(0, 4).map((a) => (
          <Link key={a.id} href={`/insights/${a.slug}`} style={{ display: 'block' }} className="latest-card-link">
            <article
              className="latest-card"
              style={{
                background: 'var(--dark-100)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                transition: 'background 0.25s',
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56%', flexShrink: 0, overflow: 'hidden', background: 'linear-gradient(135deg, #0D1020, #111827)' }}>
                {a.coverImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={a.coverImage}
                    alt={a.title}
                    className="latest-card-img"
                    loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s var(--ease-out)' }}
                  />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.18)' }} aria-hidden="true" />
                {/* Gold bottom accent line on hover */}
                <div className="latest-card-underline" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--gold), var(--gold-light))', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.35s var(--ease-out)' }} />
              </div>

              {/* Content */}
              <div style={{ padding: '1.15rem 1.35rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{
                  fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--gold)', background: 'var(--gold-subtle)', padding: '0.18rem 0.5rem',
                  border: '1px solid var(--gold-border)', display: 'inline-block', alignSelf: 'flex-start',
                }}>
                  {a.category}
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400,
                  lineHeight: 1.38, color: 'var(--text-primary)', margin: 0,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                } as React.CSSProperties}>
                  {a.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-4)' }}>{fmtShort(a.publishedAt)}</span>
                  {a.readTime && <span style={{ fontSize: '0.6rem', color: 'var(--gold-dim)' }}>{a.readTime} min</span>}
                  <span className="latest-card-cta" style={{ marginLeft: 'auto', fontSize: '0.57rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0, transition: 'opacity 0.25s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Read
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <style>{`
        .latest-card-link:hover .latest-card { background: rgba(201,168,76,0.02) !important; }
        .latest-card-link:hover .latest-card-img { transform: scale(1.05); }
        .latest-card-link:hover .latest-card-underline { transform: scaleX(1) !important; }
        .latest-card-link:hover .latest-card-cta { opacity: 1 !important; }
        @media (max-width: 1024px) { .latest-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px)  { .latest-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

async function getHomepageData(): Promise<{ articles: HomepageArticle[]; winners: Winner[] }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dbArticles: any[] = []
  let dbWinners: Winner[] = []

  await Promise.allSettled([
    (async () => {
      try {
        dbArticles = await Promise.race([
          prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              coverImage: true,
              createdAt: true,
              readTime: true,
              category: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 80,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('DB timeout')), 5000)
          ),
        ])
      } catch {
        dbArticles = []
      }
    })(),
    (async () => {
      try {
        const raw = await Promise.race([
          prisma.awardWinner.findMany({
            orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
            take: 12,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('DB timeout')), 5000)
          ),
        ])
        dbWinners = raw.map((w: any) => ({
          id: w.id,
          name: w.name,
          slug: w.slug ?? null,
          category: w.category,
          year: w.year,
          quarter: w.quarter ?? null,
          company: w.company ?? null,
          region: w.region ?? null,
          featured: w.featured ?? false,
          link: w.link ?? null,
          image: w.image ?? null,
          logo: w.logo ?? null,
          profile: w.profile ?? null,
        }))
      } catch {
        dbWinners = []
      }
    })(),
  ])

  const fromDb: HomepageArticle[] = dbArticles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    coverImage: a.coverImage,
    category: a.category?.name ?? 'General',
    publishedAt: a.createdAt.toISOString(),
    readTime: a.readTime,
    featured: false,
  }))

  const dbSlugs = new Set(fromDb.map((a) => a.slug))
  const fromStatic: HomepageArticle[] = ARTICLES.filter((s) => !dbSlugs.has(s.slug)).map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    excerpt: s.excerpt,
    coverImage: s.coverImage,
    category: s.category,
    publishedAt: s.publishedAt,
    readTime: s.readTime,
    featured: s.featured,
  }))

  const articles = [...fromDb, ...fromStatic].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return { articles, winners: dbWinners }
}

function NewsGrid({ articles }: { articles: HomepageArticle[] }) {
  const byCategory = new Map<string, HomepageArticle[]>()
  for (const a of articles) {
    if (a.category === 'Featured Insight') continue
    const list = byCategory.get(a.category) ?? []
    list.push(a)
    byCategory.set(a.category, list)
  }

  const activeSections = [
    ...CATEGORY_ORDER.filter((name) => name !== 'Featured Insight' && (byCategory.get(name) ?? []).length > 0),
    ...[...byCategory.keys()]
      .filter((k) => !CATEGORY_ORDER.includes(k))
      .sort(),
  ]

  if (activeSections.length === 0) return null

  return (
    <section
      className="section"
      style={{ paddingTop: '3rem', paddingBottom: 'var(--space-xl)' }}
      aria-label="News by category"
    >
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>News &amp; Analysis</div>
            <h2 className="display-md">Intelligence by <em>Sector</em></h2>
          </div>
          <Link href="/insights" className="btn btn-outline btn-sm">All Insights →</Link>
        </div>
      </div>

      {activeSections.map((name) => (
        <CategorySection
          key={name}
          category={name}
          articles={byCategory.get(name) ?? []}
        />
      ))}
    </section>
  )
}

export default async function HomePage() {
  const { articles, winners } = await getHomepageData()

  const featured = articles.filter((a) => a.category === 'Featured Insight').slice(0, 3)
  const nonFeatured = articles.filter((a) => a.category !== 'Featured Insight')
  const latest = nonFeatured.slice(0, 4)

  return (
    <>
      <HomeHero articles={articles.slice(0, 3)} />
      <FeaturedArticles articles={featured} />
      <LatestInsights articles={latest} />
      <AwardWinners winners={winners} />
      <NewsGrid articles={articles} />
      <PodcastSection />
      <TestimonialsCarousel />
      <HomeCTABanner />
    </>
  )
}
