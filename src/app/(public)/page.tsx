export const dynamic = 'force-dynamic';
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ARTICLES } from '@/app/api/articles/route'
import CategorySection from '@/components/home/CategorySection'
import HomeHero from '@/components/home/HomeHero'
import StockTicker from '@/components/home/StockTicker'
import type { HomepageArticle } from '@/components/home/FeaturedArticles'

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

async function getHomepageData(): Promise<{ articles: HomepageArticle[] }> {
  const dbArticles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      coverImage: true, createdAt: true, readTime: true,
      category: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const fromDb: HomepageArticle[] = dbArticles.map((a) => ({
    id: a.id, title: a.title, slug: a.slug, excerpt: a.excerpt,
    coverImage: a.coverImage, category: a.category?.name ?? 'General',
    publishedAt: a.createdAt.toISOString(), readTime: a.readTime, featured: false,
  }))

  const dbSlugs = new Set(fromDb.map((a) => a.slug))
  const fromStatic: HomepageArticle[] = ARTICLES
    .filter((s) => !dbSlugs.has(s.slug))
    .map((s) => ({
      id: s.id, title: s.title, slug: s.slug, excerpt: s.excerpt,
      coverImage: s.coverImage, category: s.category,
      publishedAt: s.publishedAt, readTime: s.readTime, featured: s.featured,
    }))

  const articles = [...fromDb, ...fromStatic].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return { articles }
}

function AdBannerPlaceholder() {
  return (
    <div
      style={{
        width: '100%',
        height: 72,
        background: 'linear-gradient(90deg, #0c0c14 0%, #0f0f1a 50%, #0c0c14 100%)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '2.5rem 0',
      }}
    >
      <span
        style={{
          fontSize: '0.48rem',
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.18)',
        }}
      >
        Advertisement
      </span>
    </div>
  )
}

export default async function HomePage() {
  const { articles } = await getHomepageData()

  const byCategory = new Map<string, HomepageArticle[]>()
  for (const a of articles) {
    const list = byCategory.get(a.category) ?? []
    list.push(a)
    byCategory.set(a.category, list)
  }

  const activeSections = [
    ...CATEGORY_ORDER.filter((name) => (byCategory.get(name)?.length ?? 0) > 0),
    ...[...byCategory.keys()]
      .filter((k) => !CATEGORY_ORDER.includes(k))
      .sort(),
  ]

  return (
    <>
      <div
        style={{
          paddingTop: 72,
          paddingBottom: 52,
          background: 'var(--surface-page)',
        }}
      >
        {/* ── Hero ── */}
        <HomeHero />

        {/* ── Compact header bar — sticky below navbar ── */}
        <div
          style={{
            position: 'sticky',
            top: 72,
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            height: 44,
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface-page)',
          }}
        >
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.52rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--text-5)',
                marginBottom: 2,
              }}
            >
              News &amp; Analysis
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                fontWeight: 300,
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              Intelligence by <em>Sector</em>
            </h1>
          </div>
          <Link href="/insights" className="btn btn-outline btn-sm">
            All Insights →
          </Link>
        </div>

        {/* ── Category sections ── */}
        <div style={{ padding: '3rem 1.5rem 0' }}>
          {activeSections.length > 0 ? (
            activeSections.flatMap((name, idx) => {
              const section = (
                <CategorySection
                  key={name}
                  category={name}
                  articles={byCategory.get(name) ?? []}
                />
              )
              if (idx === 0) return [section]
              return [<AdBannerPlaceholder key={`ad-${idx}`} />, section]
            })
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                padding: '6rem 0',
              }}
            >
              <p
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-4)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                No insights published yet
              </p>
              <Link
                href="/insights"
                style={{ fontSize: '0.72rem', color: 'var(--gold)', textDecoration: 'none' }}
              >
                Browse all categories →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Fixed market ticker — always at bottom */}
      <StockTicker />
    </>
  )
}
