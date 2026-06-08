import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

// GET /api/admin/winners
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = req.nextUrl
  const yearParam    = searchParams.get('year')
  const quarterParam = searchParams.get('quarter')

  const where: Parameters<typeof prisma.awardWinner.findMany>[0]['where'] = {}

  if (yearParam) {
    const y = parseInt(yearParam, 10)
    if (!isNaN(y)) where.year = y
  }
  if (quarterParam) {
    const q = parseInt(quarterParam, 10)
    if (!isNaN(q) && q >= 1 && q <= 4) where.quarter = q
  }

  const winners = await prisma.awardWinner.findMany({
    where,
    orderBy: [{ year: 'desc' }, { name: 'asc' }],
  })

  return NextResponse.json(winners)
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

  const winner = await prisma.awardWinner.create({
    data: {
      name:     name.trim(),
      slug:     typeof slug     === 'string' && slug.trim()     ? slug.trim()     : null,
      category: category.trim(),
      year,
      quarter:
        typeof quarter === 'number' && Number.isInteger(quarter) && quarter >= 1 && quarter <= 4
          ? quarter : null,
      company:  typeof company  === 'string' && company.trim()  ? company.trim()  : null,
      region:   typeof region   === 'string' && region.trim()   ? region.trim()   : null,
      featured: featured === true,
      link:     typeof link     === 'string' && link.trim()     ? link.trim()     : null,
      image:    typeof image    === 'string' && image.trim()    ? image.trim()    : null,
      logo:     typeof logo     === 'string' && logo.trim()     ? logo.trim()     : null,
      profile:  typeof profile  === 'string' && profile.trim() ? profile.trim()  : null,
    },
  })

  return NextResponse.json(winner, { status: 201 })
}
