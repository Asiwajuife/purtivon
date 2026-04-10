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

  return <PodcastsClient initialPodcasts={podcasts} />
}
