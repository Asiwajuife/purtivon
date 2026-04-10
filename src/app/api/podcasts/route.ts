import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

interface PodcastRow {
  id: string; title: string; description: string | null; youtubeUrl: string
  videoId: string; thumbnail: string | null; category: string | null
  publishedAt: Date; createdAt: Date; updatedAt: Date
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function normalise(p: PodcastRow) {
  return {
    id:          String(p.id),
    title:       String(p.title),
    description: p.description ?? null,
    youtubeUrl:  String(p.youtubeUrl),
    videoId:     String(p.videoId),
    thumbnail:   p.thumbnail ?? `https://img.youtube.com/vi/${p.videoId}/hqdefault.jpg`,
    category:    p.category ?? null,
    publishedAt: p.publishedAt instanceof Date ? p.publishedAt.toISOString() : String(p.publishedAt),
  }
}

// GET /api/podcasts — public
export async function GET() {
  const rows = await prisma.$queryRawUnsafe<PodcastRow[]>(
    `SELECT id, title, description, "youtubeUrl", "videoId", thumbnail, category, "publishedAt", "createdAt", "updatedAt"
     FROM podcasts ORDER BY "publishedAt" DESC`
  ).catch(() => [] as PodcastRow[])

  return NextResponse.json(rows.map(normalise))
}

// POST /api/podcasts — admin only
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { title, description, youtubeUrl, thumbnail, category, publishedAt } = body as Record<string, unknown>

  if (typeof title !== 'string' || !title.trim())
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  if (typeof youtubeUrl !== 'string' || !youtubeUrl.trim())
    return NextResponse.json({ error: 'youtubeUrl is required' }, { status: 400 })

  const videoId = extractVideoId(youtubeUrl.trim())
  if (!videoId)
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })

  const id  = randomUUID()
  const now = new Date()
  const pubDate = typeof publishedAt === 'string' && publishedAt ? new Date(publishedAt) : now

  const rows = await prisma.$queryRawUnsafe<PodcastRow[]>(
    `INSERT INTO podcasts (id, title, description, "youtubeUrl", "videoId", thumbnail, category, "publishedAt", "createdAt", "updatedAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    id,
    title.trim(),
    typeof description === 'string' && description.trim() ? description.trim() : null,
    youtubeUrl.trim(),
    videoId,
    typeof thumbnail === 'string' && thumbnail.trim() ? thumbnail.trim() : null,
    typeof category  === 'string' && category.trim()  ? category.trim()  : null,
    pubDate,
    now,
    now,
  )

  return NextResponse.json(normalise(rows[0]), { status: 201 })
}
