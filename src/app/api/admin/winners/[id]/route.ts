import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
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

  const existing = await prisma.awardWinner.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { name, slug, category, year, quarter, company, region, featured, link, image, logo, profile } =
    body as Record<string, unknown>

  const updated = await prisma.awardWinner.update({
    where: { id },
    data: {
      name:
        typeof name === 'string' && name.trim() ? name.trim() : existing.name,
      slug:
        'slug' in body
          ? (typeof slug === 'string' && slug.trim() ? slug.trim() : null)
          : existing.slug,
      category:
        typeof category === 'string' && category.trim() ? category.trim() : existing.category,
      year:
        typeof year === 'number' && Number.isInteger(year) && year >= 2000 && year <= 2100
          ? year : existing.year,
      quarter:
        'quarter' in body
          ? (typeof quarter === 'number' && Number.isInteger(quarter) && quarter >= 1 && quarter <= 4
              ? quarter : null)
          : existing.quarter,
      company:
        'company'  in body ? (typeof company  === 'string' && company.trim()  ? company.trim()  : null) : existing.company,
      region:
        'region'   in body ? (typeof region   === 'string' && region.trim()   ? region.trim()   : null) : existing.region,
      featured:
        'featured' in body ? featured === true : existing.featured,
      link:
        'link'     in body ? (typeof link    === 'string' && link.trim()    ? link.trim()    : null) : existing.link,
      image:
        'image'    in body ? (typeof image   === 'string' && image.trim()   ? image.trim()   : null) : existing.image,
      logo:
        'logo'     in body ? (typeof logo    === 'string' && logo.trim()    ? logo.trim()    : null) : existing.logo,
      profile:
        'profile'  in body ? (typeof profile === 'string' && profile.trim() ? profile.trim() : null) : existing.profile,
    },
  })

  return NextResponse.json(updated)
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

  const existing = await prisma.awardWinner.findUnique({ where: { id }, select: { id: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.awardWinner.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
