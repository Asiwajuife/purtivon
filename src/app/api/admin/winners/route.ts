import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

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

// GET /api/admin/winners
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = req.nextUrl
  const year    = searchParams.get('year')
  const quarter = searchParams.get('quarter')

  const conditions: string[] = []
  const values: unknown[]    = []

  if (year) {
    const y = parseInt(year, 10)
    if (!isNaN(y)) { conditions.push(`year = $${values.length + 1}`); values.push(y) }
  }
  if (quarter) {
    const q = parseInt(quarter, 10)
    if (!isNaN(q) && q >= 1 && q <= 4) { conditions.push(`quarter = $${values.length + 1}`); values.push(q) }
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const sql   = `SELECT * FROM award_winners ${where} ORDER BY year DESC, name ASC`

  const raw = await prisma.$queryRawUnsafe<WinnerRow[]>(sql, ...values)
  return NextResponse.json(raw.map(normaliseRow))
}

// POST /api/admin/winners
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { name, slug, category, year, quarter, company, region, featured, link, image, logo, profile } =
    body as Record<string, unknown>

  if (typeof name !== 'string' || !name.trim())
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  if (typeof category !== 'string' || !category.trim())
    return NextResponse.json({ error: 'category is required' }, { status: 400 })
  if (typeof year !== 'number' || !Number.isInteger(year) || year < 2000 || year > 2100)
    return NextResponse.json({ error: 'year must be a valid integer' }, { status: 400 })

  const quarterVal =
    typeof quarter === 'number' && Number.isInteger(quarter) && quarter >= 1 && quarter <= 4
      ? quarter
      : null

  const slugVal = typeof slug === 'string' && slug.trim() ? slug.trim() : null

  const id  = randomUUID()
  const now = new Date()

  const rows = await prisma.$queryRawUnsafe<WinnerRow[]>(
    `INSERT INTO award_winners
       (id, name, slug, category, year, quarter, company, region, featured, link, image, logo, profile, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING *`,
    id,
    name.trim(),
    slugVal,
    category.trim(),
    year,
    quarterVal,
    typeof company === 'string' && company.trim() ? company.trim() : null,
    typeof region  === 'string' && region.trim()  ? region.trim()  : null,
    featured === true,
    typeof link    === 'string' && link.trim()    ? link.trim()    : null,
    typeof image   === 'string' && image.trim()   ? image.trim()   : null,
    typeof logo    === 'string' && logo.trim()    ? logo.trim()    : null,
    typeof profile === 'string' && profile.trim() ? profile.trim() : null,
    now,
    now,
  )

  return NextResponse.json(normaliseRow(rows[0]), { status: 201 })
}
