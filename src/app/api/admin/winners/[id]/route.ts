import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

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
  createdAt: Date
  updatedAt: Date
}

function normaliseRow(w: WinnerRow) {
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
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  }
}

// PATCH /api/admin/winners/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const existing = await prisma.$queryRawUnsafe<WinnerRow[]>(
    `SELECT * FROM award_winners WHERE id = $1 LIMIT 1`,
    id
  )
  if (existing.length === 0)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const cur = existing[0]

  const { name, slug, category, year, quarter, company, region, featured, link, image, logo, profile } =
    body as Record<string, unknown>

  const newName     = typeof name     === 'string' && name.trim()     ? name.trim()     : cur.name
  const newCategory = typeof category === 'string' && category.trim() ? category.trim() : cur.category
  const newYear     =
    typeof year === 'number' && Number.isInteger(year) && year >= 2000 && year <= 2100
      ? year
      : cur.year

  const newSlug =
    'slug' in body
      ? (typeof slug === 'string' && slug.trim() ? slug.trim() : null)
      : cur.slug

  const newQuarter =
    'quarter' in body
      ? typeof quarter === 'number' && Number.isInteger(quarter) && quarter >= 1 && quarter <= 4
        ? quarter
        : null
      : cur.quarter

  const newCompany  = 'company'  in body ? (typeof company  === 'string' && company.trim()  ? company.trim()  : null) : cur.company
  const newRegion   = 'region'   in body ? (typeof region   === 'string' && region.trim()   ? region.trim()   : null) : cur.region
  const newFeatured = 'featured' in body ? featured === true                                                           : cur.featured
  const newLink     = 'link'     in body ? (typeof link    === 'string' && link.trim()    ? link.trim()    : null)    : cur.link
  const newImage    = 'image'    in body ? (typeof image   === 'string' && image.trim()   ? image.trim()   : null)    : cur.image
  const newLogo     = 'logo'     in body ? (typeof logo    === 'string' && logo.trim()    ? logo.trim()    : null)    : cur.logo
  const newProfile  = 'profile'  in body ? (typeof profile === 'string' && profile.trim() ? profile.trim() : null)   : cur.profile

  const rows = await prisma.$queryRawUnsafe<WinnerRow[]>(
    `UPDATE award_winners
     SET name = $1, slug = $2, category = $3, year = $4, quarter = $5,
         company = $6, region = $7, featured = $8, link = $9, image = $10,
         logo = $11, profile = $12, "updatedAt" = $13
     WHERE id = $14
     RETURNING *`,
    newName,
    newSlug,
    newCategory,
    newYear,
    newQuarter,
    newCompany,
    newRegion,
    newFeatured,
    newLink,
    newImage,
    newLogo,
    newProfile,
    new Date(),
    id,
  )

  return NextResponse.json(normaliseRow(rows[0]))
}

// DELETE /api/admin/winners/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params

  const existing = await prisma.$queryRawUnsafe<WinnerRow[]>(
    `SELECT id FROM award_winners WHERE id = $1 LIMIT 1`,
    id
  )
  if (existing.length === 0)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.$executeRawUnsafe(`DELETE FROM award_winners WHERE id = $1`, id)
  return NextResponse.json({ success: true })
}
