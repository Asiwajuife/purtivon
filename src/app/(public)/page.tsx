export const dynamic = 'force-dynamic';
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
import HomeHero from '@/components/home/HomeHero'
import HomeCTABanner from '@/components/home/HomeCTABanner'

export const metadata: Metadata = {
  title: 'Purtivon — Global FDI & Financial Services Awards',
  description:
    'The leading awards and media PR consultancy for foreign direct investment and international financial services. Recognising excellence across global capital markets.',
}

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

const EDITORIAL_CATEGORIES = new Set(['Featured Insight'])

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

  return { articles }
}

function NewsGrid({ articles }: { articles: HomepageArticle[] }) {
  const byCategory = new Map<string, HomepageArticle[]>()
  for (const a of articles) {
    if (EDITORIAL_CATEGORIES.has(a.category)) continue
    const list = byCategory.get(a.category) ?? []
    list.push(a)
    byCategory.set(a.category, list)
  }

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
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', padding: '0 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>News &amp; Analysis</div>
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
    </section>
  )
}

export default async function HomePage() {
  const { articles } = await getHomepageData()

  const featured = articles.filter((a) => a.category === 'Featured Insight').slice(0, 3)

  return (
    <>
      <HomeHero />
      <FeaturedArticles articles={featured} />
      <NewsGrid articles={articles} />
      <PodcastSection />
      <TestimonialsCarousel />
      <HomeCTABanner />
      <StockTicker />
    </>
  )
}
