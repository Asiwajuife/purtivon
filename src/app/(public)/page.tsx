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
    take: 80,
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
      {/*
        Full-viewport layout:
        height: calc(100vh - 36px)  → leaves room for fixed ticker
        paddingTop: 72px            → clears fixed navbar
        overflow: hidden            → page never scrolls; inner div scrolls
      */}
      <div
        style={{
          height: 'calc(100vh - 36px)',
          paddingTop: 72,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--surface-page)',
        }}
      >
        {/* ── Short hero ── */}
        <HomeHero />

        {/* ── Compact section header (44px) ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            height: 44,
            flexShrink: 0,
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

        {/* ── Scrollable categories area ── */}
        <div
          className="news-grid-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {activeSections.length > 0 ? (
            activeSections.map((name) => (
              <CategorySection
                key={name}
                category={name}
                articles={byCategory.get(name) ?? []}
              />
            ))
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
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

      <style>{`
        .news-grid-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(201,168,76,0.3) transparent;
        }
        .news-grid-scroll::-webkit-scrollbar { width: 4px; }
        .news-grid-scroll::-webkit-scrollbar-track { background: transparent; }
        .news-grid-scroll::-webkit-scrollbar-thumb {
          background: rgba(201,168,76,0.3);
          border-radius: 2px;
        }
        .news-grid-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(201,168,76,0.5);
        }
      `}</style>
    </>
  )
}
