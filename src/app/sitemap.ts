import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { STATIC_WINNERS } from '@/lib/staticWinners'

const STATIC_SLUGS = [
  // Awards
  'purtivon-q1-2026-global-awards-ceremony',
  'purtivon-awards-judging-process',
  'award-recognition-international-finance-value',
  'purtivon-2025-annual-awards-review',
  // Featured Insight
  'global-fdi-outlook-2026',
  'gulf-vision-economies-investment-2026',
  'global-south-emerging-economies-2026',
  'sovereign-wealth-geopolitical-fragmentation',
  // Report
  'purtivon-annual-fdi-report-2025',
  'q1-2026-financial-services-report',
  'global-capital-markets-midyear-2025',
  'ipa-performance-benchmarking-report-2025',
  // Analysis
  'dollar-dominance-cross-asset-analysis-2026',
  'political-risk-fdi-emerging-markets-framework',
  'interest-rate-sensitivity-cross-asset-q2-2026',
  'private-markets-liquidity-reckoning-2026',
  // News
  'adia-5bn-southeast-asia-infrastructure-fund',
  'imf-global-growth-forecast-2026-revision',
  'uk-gulf-investment-partnership-10bn-2026',
  'g20-cross-border-digital-investment-framework',
  'singapore-mas-green-finance-accelerator-2026',
  // FDI Intelligence
  'southeast-asia-fdi-destination-2025',
  'africa-fdi-renaissance-2025',
  'investment-promotion-agencies-multipolar-world',
  'digital-infrastructure-fdi-frontier',
  // Financial Services
  'gcc-sovereign-wealth-funds-2025',
  'private-credit-emerging-markets-infrastructure',
  'cross-border-ma-financial-services-2025',
  'currency-risk-dollar-dominance-2025',
  // Banks
  'global-banks-digital-transformation-2026',
  'basel-iv-capital-rules-international-lending',
  'cbdc-correspondent-banking-future',
  'africa-banking-mobile-finance-inclusion',
  // Economy
  'central-banks-post-inflation-rate-reversal',
  'supply-chain-realignment-global-trade-2026',
  'emerging-market-debt-high-rate-world',
  'demographics-ageing-populations-investment',
  // Tech
  'ai-asset-management-portfolio-optimisation',
  'fintech-2026-consolidation-wave',
  'quantum-computing-cryptography-financial-risk',
  'blockchain-real-world-asset-tokenisation',
  // ESG
  'esg-mandates-cross-border-capital-2025',
  'green-bonds-sustainable-finance-architecture',
  'net-zero-commitments-corporate-climate-scrutiny',
  'social-impact-investing-beyond-esg-checkbox',
  'board-diversity-governance-premium-global-markets',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.purtivon.com'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`,         lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/awards`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/winners`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/insights`, lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/contact`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${baseUrl}/terms`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/privacy`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // Static seed article slugs
  const staticArticleRoutes: MetadataRoute.Sitemap = STATIC_SLUGS.map((slug) => ({
    url: `${baseUrl}/insights/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // DB articles
  const dbArticles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  }).catch(() => [])

  const dbSlugs = new Set(STATIC_SLUGS)
  const dbArticleRoutes: MetadataRoute.Sitemap = dbArticles
    .filter((a) => !dbSlugs.has(a.slug))
    .map((a) => ({
      url: `${baseUrl}/insights/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  // Static winner profile routes
  const staticWinnerRoutes: MetadataRoute.Sitemap = STATIC_WINNERS
    .filter((w) => w.slug)
    .map((w) => ({
      url: `${baseUrl}/winners/${w.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [...staticRoutes, ...staticArticleRoutes, ...dbArticleRoutes, ...staticWinnerRoutes]
}
