import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ARTICLES } from '@/app/api/articles/route'
import FeaturedArticles from '@/components/home/FeaturedArticles'
import type { HomepageArticle } from '@/components/home/FeaturedArticles'
import CategorySection from '@/components/home/CategorySection'
import StockTicker from '@/components/home/StockTicker'
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel'
import PodcastSection from '@/components/home/PodcastSection'

export const metadata: Metadata = {
  title: 'Purtivon — Global FDI & Financial Services Awards',
  description:
    'The leading awards and media PR consultancy for foreign direct investment and international financial services. Recognising excellence across global capital markets.',
}

// ─── Current quarter/year helpers ────────────────────────────────────────────

function getCurrentQuarterLabel() {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  return `Q${q} ${now.getFullYear()}`
}

function getNominationsCloseLabel() {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  const year = now.getFullYear()
  const closeMonth = q * 3 // March=3, June=6, Sep=9, Dec=12
  const monthName = new Date(year, closeMonth - 1, 1).toLocaleString('en-GB', { month: 'long' })
  const resultsMonth = new Date(year, closeMonth, 1).toLocaleString('en-GB', { month: 'long' })
  return `Q${q} ${year} · Nominations close 30 ${monthName} ${year} · Independent judging panel · Results announced ${resultsMonth} ${year}`
}

// ─── Ordered category sections ───────────────────────────────────────────────

// Categories shown on the home page news grid.
// 'Featured Insight' is the only editorial-only category (shown in the hero strip above, not in the grid).
const CATEGORY_ORDER = [
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

// Only 'Featured Insight' is excluded from the grid — it lives exclusively in the hero strip above.
const EDITORIAL_CATEGORIES = new Set(['Featured Insight'])

// ─── Data helpers ─────────────────────────────────────────────────────────────

async function getHomepageData(): Promise<{ articles: HomepageArticle[] }> {
  const dbArticles = await prisma.article.findMany({
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
  })

  // Normalise DB articles
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

  // Merge static articles — skip any whose slug already came from DB
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

  return { articles }
}

// ─── Static sections ──────────────────────────────────────────────────────────

const STATS = [
  { value: '48',    label: 'Countries Covered' },
  { value: '500+', label: 'Institutions Featured' },
  { value: '5',     label: 'Years of Excellence' },
] as const

// ─── Section components ───────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '7rem 2.5rem 5rem',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 80%)',
        }}
      />

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 820 }}>
        <div
          className="eyebrow animate-fade-up delay-100"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}
        >
          <span style={{ width: 40, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
          Global FDI & Financial Services Awards
          <span style={{ width: 40, height: 1, background: 'var(--gold-dim)', display: 'block' }} />
        </div>

        <h1 className="display-xl animate-fade-up delay-200" style={{ marginBottom: '1.5rem' }}>
          Recognising the World&apos;s
          <br />
          <em>Investment Leaders</em>
        </h1>

        <p className="body-lg animate-fade-up delay-300" style={{ maxWidth: 520, margin: '0 auto 3rem' }}>
          Purtivon is the global standard for FDI and financial services recognition —
          connecting excellence, capital, and ambition across 48 countries.
        </p>

        <div
          className="animate-fade-up delay-400"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}
        >
          <Link href="/awards" className="btn btn-primary btn-lg">
            Submit a Nomination
          </Link>
          <Link href="/insights" className="btn btn-outline btn-lg">
            Latest Intelligence
          </Link>
        </div>

        <div
          className="animate-fade-up delay-500"
          style={{
            display: 'flex', justifyContent: 'center', gap: '3.5rem',
            marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap',
          }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1, marginBottom: '0.4rem' }}>
                {value}
              </div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NewsGrid({ articles }: { articles: HomepageArticle[] }) {
  const byCategory = new Map<string, HomepageArticle[]>()
  for (const a of articles) {
    // Skip editorial categories — they live in FeaturedArticles / /insights, not the sector grid
    if (EDITORIAL_CATEGORIES.has(a.category)) continue
    const list = byCategory.get(a.category) ?? []
    list.push(a)
    byCategory.set(a.category, list)
  }

  // Sector categories in defined order, then any remaining unknown categories
  const activeSections = [
    ...CATEGORY_ORDER.filter((name) => (byCategory.get(name) ?? []).length > 0),
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
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>News & Analysis</div>
            <h2 className="display-md">Intelligence by <em>Sector</em></h2>
          </div>
          <Link href="/insights" className="btn btn-outline btn-sm">All Insights →</Link>
        </div>

        {activeSections.map((name) => (
          <CategorySection
            key={name}
            category={name}
            articles={byCategory.get(name) ?? []}
          />
        ))}
      </div>
    </section>
  )
}

function CTABanner() {
  return (
    <section className="section" style={{ position: 'relative', textAlign: 'center', overflow: 'hidden', borderTop: '1px solid var(--border)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="container" style={{ position: 'relative' }}>
        <div aria-hidden="true" style={{ width: 64, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '0 auto 3rem' }} />

        <h2 className="display-lg" style={{ marginBottom: '1.25rem' }}>
          Ready to be recognised
          <br />
          <em>globally?</em>
        </h2>

        <p className="body-lg" style={{ maxWidth: 460, margin: '0 auto 3rem' }}>
          Submit your nomination for the {getCurrentQuarterLabel()} Purtivon Global Awards and join
          the institutions shaping the future of international investment.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <Link href="/awards" className="btn btn-primary btn-lg">
            Submit a Nomination
          </Link>
          <Link href="/contact" className="btn btn-outline btn-lg">
            Speak to Our Team
          </Link>
        </div>

        <p className="label" style={{ marginTop: '2rem', color: 'var(--text-faint)' }}>
          {getNominationsCloseLabel()}
        </p>
      </div>
    </section>
  )
}

// ─── Page (async server component) ───────────────────────────────────────────

export default async function HomePage() {
  const { articles } = await getHomepageData()

  // Hero strip: only 'Featured Insight' category articles (editorial picks)
  const featured = articles.filter((a) => a.category === 'Featured Insight').slice(0, 3)

  return (
    <>
      <Hero />

      {/* ── Featured editorial picks ── */}
      <FeaturedArticles articles={featured} />

      {/* ── News grid by category ── */}
      <NewsGrid articles={articles} />

      {/* ── Podcast episodes ── */}
      <PodcastSection />

      {/* ── Social proof & CTA ── */}
      <TestimonialsCarousel />
      <CTABanner />

      {/* ── Fixed ticker ── */}
      <StockTicker />
    </>
  )
}
