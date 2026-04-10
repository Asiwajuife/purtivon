import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Unauthorized', status: 401 }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== 'ADMIN') return { error: 'Forbidden', status: 403 }
  return null
}

// PATCH /api/podcasts/[id] — admin only
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin()
  if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status })

  const { id } = await params

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { title, description, youtubeUrl, thumbnail, category, publishedAt } = body as Record<string, unknown>

  // Build SET clauses dynamically
  const sets: string[] = []
  const vals: unknown[] = []
  let idx = 1

  if (typeof title === 'string' && title.trim()) {
    sets.push(`title = $${idx++}`); vals.push(title.trim())
  }
  if ('description' in body) {
    sets.push(`description = $${idx++}`)
    vals.push(typeof description === 'string' && description.trim() ? description.trim() : null)
  }
  if (typeof youtubeUrl === 'string' && youtubeUrl.trim()) {
    const vid = extractVideoId(youtubeUrl.trim())
    if (!vid) return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    sets.push(`"youtubeUrl" = $${idx++}`); vals.push(youtubeUrl.trim())
    sets.push(`"videoId" = $${idx++}`);    vals.push(vid)
  }
  if ('thumbnail' in body) {
    sets.push(`thumbnail = $${idx++}`)
    vals.push(typeof thumbnail === 'string' && thumbnail.trim() ? thumbnail.trim() : null)
  }
  if ('category' in body) {
    sets.push(`category = $${idx++}`)
    vals.push(typeof category === 'string' && category.trim() ? category.trim() : null)
  }
  if (typeof publishedAt === 'string' && publishedAt) {
    sets.push(`"publishedAt" = $${idx++}`); vals.push(new Date(publishedAt))
  }

  if (sets.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })

  sets.push(`"updatedAt" = $${idx++}`); vals.push(new Date())
  vals.push(id)

  const rows = await prisma.$queryRawUnsafe<PodcastRow[]>(
    `UPDATE podcasts SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
    ...vals
  ).catch(() => [] as PodcastRow[])

  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(normalise(rows[0]))
}

// DELETE /api/podcasts/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin()
  if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status })

  const { id } = await params

  await prisma.$queryRawUnsafe(
    `DELETE FROM podcasts WHERE id = $1`,
    id
  ).catch(() => null)

  return NextResponse.json({ success: true })
}
