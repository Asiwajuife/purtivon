import { NextResponse } from 'next/server'
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

function normalise(w: WinnerRow) {
  return {
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
  }
}

// GET /api/winners — public list, merges DB + static
export async function GET() {
  const dbRows = await prisma.$queryRawUnsafe<WinnerRow[]>(
    `SELECT id, name, slug, category, year, quarter, company, region, featured, link, image, logo, profile
     FROM award_winners
     ORDER BY year DESC, name ASC`
  ).catch(() => [] as WinnerRow[])

  const dbWinners = dbRows.map(normalise)
  const dbIds = new Set(dbWinners.map((w) => w.id))

  const merged = [
    ...dbWinners,
    ...STATIC_WINNERS.filter((w) => !dbIds.has(w.id)),
  ].sort(
    (a, b) =>
      (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
      b.year - a.year ||
      a.name.localeCompare(b.name)
  )

  return NextResponse.json(merged)
}
