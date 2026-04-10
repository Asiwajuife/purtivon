import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { STATIC_WINNERS } from '@/lib/staticWinners'

interface WinnerRow {
  id: string
  name: string
  slug: string | null
  category: string
  year: number
  quarter: number | null
  company: string | null
  region: string | null
  featured: boolean
  link: string | null
  image: string | null
  logo: string | null
  profile: string | null
}

// GET /api/winners/[slug] — public single winner by slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Try DB first
  const rows = await prisma.$queryRawUnsafe<WinnerRow[]>(
    `SELECT id, name, slug, category, year, quarter, company, region, featured, link, image, logo, profile
     FROM award_winners
     WHERE slug = $1
     LIMIT 1`,
    slug
  ).catch(() => [] as WinnerRow[])

  if (rows.length > 0) {
    const w = rows[0]
    return NextResponse.json({
      id:       String(w.id),
      name:     String(w.name),
      slug:     w.slug     != null ? String(w.slug)     : null,
      category: String(w.category),
      year:     Number(w.year),
      quarter:  w.quarter  != null ? Number(w.quarter)  : null,
      company:  w.company  != null ? String(w.company)  : null,
      region:   w.region   != null ? String(w.region)   : null,
      featured: Boolean(w.featured),
      link:     w.link     != null ? String(w.link)     : null,
      image:    w.image    != null ? String(w.image)    : null,
      logo:     w.logo     != null ? String(w.logo)     : null,
      profile:  w.profile  != null ? String(w.profile)  : null,
    })
  }

  // Fallback to static winners
  const staticWinner = STATIC_WINNERS.find((w) => w.slug === slug)
  if (staticWinner) {
    return NextResponse.json(staticWinner)
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
