export const dynamic = 'force-dynamic';
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PodcastsClient from './PodcastsClient'

export const metadata: Metadata = { title: 'Podcasts' }

interface PodcastRow {
  id: string; title: string; description: string | null; youtubeUrl: string
  videoId: string; thumbnail: string | null; category: string | null
  publishedAt: Date; createdAt: Date; updatedAt: Date
}

export default async function PodcastsDashboardPage() {
  const rows = await prisma.$queryRawUnsafe<PodcastRow[]>(
    `SELECT id, title, description, "youtubeUrl", "videoId", thumbnail, category, "publishedAt", "createdAt", "updatedAt"
     FROM podcasts ORDER BY "publishedAt" DESC`
  ).catch(() => [] as PodcastRow[])

  const podcasts = rows.map((p) => ({
    id:          String(p.id),
    title:       String(p.title),
    description: p.description ?? null,
    youtubeUrl:  String(p.youtubeUrl),
    videoId:     String(p.videoId),
    thumbnail:   p.thumbnail ?? null,
    category:    p.category ?? null,
    publishedAt: p.publishedAt instanceof Date ? p.publishedAt.toISOString() : String(p.publishedAt),
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 900 }}>
      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: '1rem', flexWrap: 'wrap',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.3rem' }}>
            Media
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, color: 'var(--text-hi)', letterSpacing: '0.01em', margin: 0, lineHeight: 1.1 }}>
            Podcasts
          </h1>
        </div>
        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.38)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '0.3rem 0.7rem', whiteSpace: 'nowrap' }}>
          {podcasts.length} {podcasts.length === 1 ? 'episode' : 'episodes'}
        </span>
      </div>

      <PodcastsClient initialPodcasts={podcasts} />
    </div>
  )
}
