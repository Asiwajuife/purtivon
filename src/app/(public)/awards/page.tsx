export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AwardsList from "@/components/awards/AwardsList";
import SubmissionForm from "@/components/awards/SubmissionForm";
import AwardWinners from "@/components/home/AwardWinners";
import type { Winner } from "@/components/home/AwardWinners";
import { STATIC_WINNERS } from "@/lib/staticWinners";

export const metadata: Metadata = {
  title: "Awards",
  description:
    "Media recognition across Financial Services, FDI, and Leadership — independently judged, globally distributed.",
};

function getCurrentQuarterLabel() {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  return `Q${q} ${now.getFullYear()}`
}

export default async function AwardsPage() {
  const [rawAwards, rawWinners] = await Promise.all([
    prisma.award.findMany({
      orderBy: [{ year: "desc" }, { title: "asc" }],
      select: { id: true, title: true, category: true, year: true, description: true, createdAt: true },
    }),
    // Use raw SQL to bypass stale Prisma client — works even if prisma generate hasn't been re-run
    prisma.$queryRawUnsafe<unknown[]>(
      `SELECT id, name, slug, category, year, quarter, company, region, featured, link, image, logo, profile
       FROM award_winners
       ORDER BY year DESC, name ASC`
    ).catch(() => [] as unknown[]),
  ]);

  const awards = rawAwards.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }));
  const categories = [...new Set(awards.map((a) => a.category))];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fromDbWinners: Winner[] = (rawWinners as any[]).map((w) => ({
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
  }))

  // Merge static winners — DB winners take precedence by id
  const dbWinnerIds = new Set(fromDbWinners.map((w) => w.id))
  const winners: Winner[] = [
    ...fromDbWinners,
    ...STATIC_WINNERS.filter((w) => !dbWinnerIds.has(w.id)),
  ].sort(
    (a: Winner, b: Winner) =>
      (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
      b.year - a.year ||
      a.name.localeCompare(b.name)
  );

  return (
    <div className="flex-1">
      {/* Hero header */}
      <div style={{
        borderBottom: "1px solid var(--border-faint)",
        padding: "3rem 2.5rem 2.5rem",
        maxWidth: 1160,
        margin: "0 auto",
      }}>
        <div className="eyebrow" style={{ marginBottom: "1.25rem" }}>Recognition & Excellence · {getCurrentQuarterLabel()}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "flex-end", gap: "3rem" }} className="awards-header-grid">
          <h1 className="display-lg" style={{ maxWidth: 520 }}>
            Global <em>Awards</em> {getCurrentQuarterLabel()}
          </h1>
          <p className="body-sm" style={{ maxWidth: 320, paddingBottom: "0.35rem" }}>
            Media recognition across Financial Services, FDI, and Leadership — independently judged and distributed to a global audience of investors and decision-makers.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", alignItems: "center", gap: "3rem", marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid var(--border-faint)", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 300, color: "#c9a84c", lineHeight: 1, marginBottom: "0.3rem" }}>
              {awards.length}
            </p>
            <p className="label">{awards.length === 1 ? "Award Category" : "Award Categories"}</p>
          </div>
          <div style={{ width: 1, height: 36, background: "var(--border-faint)" }} />
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 300, color: "#c9a84c", lineHeight: 1, marginBottom: "0.3rem" }}>
              {categories.length}
            </p>
            <p className="label">Disciplines</p>
          </div>
          <div style={{ width: 1, height: 36, background: "var(--border-faint)" }} />
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 300, color: "#c9a84c", lineHeight: 1, marginBottom: "0.3rem" }}>
              {winners.length}
            </p>
            <p className="label">Past Winners</p>
          </div>
          <div style={{ width: 1, height: 36, background: "var(--border-faint)" }} />
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 300, color: "#c9a84c", lineHeight: 1, marginBottom: "0.3rem" }}>
              48
            </p>
            <p className="label">Countries Eligible</p>
          </div>
        </div>
      </div>

      {/* Main content: awards list + submission form */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "3rem 2.5rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "4rem", alignItems: "start" }} className="awards-layout">

          {/* Awards list */}
          <AwardsList awards={awards} />

          {/* Sidebar: submission form */}
          <div style={{ position: "sticky", top: "5rem" }}>
            {/* Section header */}
            <div style={{
              padding: "1.25rem 1.5rem",
              border: "1px solid rgba(201,168,76,0.15)",
              background: "rgba(201,168,76,0.03)",
              marginBottom: "1px",
            }}>
              <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.4rem" }}>
                {getCurrentQuarterLabel()} Nominations Open
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 300, color: "var(--text-hi)", marginBottom: "0.5rem" }}>
                Submit an Entry
              </h2>
              <p style={{ fontSize: "0.75rem", color: "var(--text-lo)", lineHeight: 1.7 }}>
                Nominate your organisation for recognition across our global award categories. All submissions are evaluated by an independent judging panel.
              </p>
            </div>

            <SubmissionForm awards={awards} />
          </div>
        </div>
      </div>

      {/* Past Winners section */}
      {winners.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border-faint)" }}>
          <AwardWinners winners={winners} />
        </div>
      )}

      {/* Empty winners state */}
      {winners.length === 0 && (
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 2.5rem 4rem" }}>
          <div style={{
            padding: "3rem 2rem",
            border: "1px solid var(--border-faint)",
            background: "var(--surface-subtle)",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-5)", marginBottom: "0.5rem" }}>
              Past Winners
            </p>
            <p className="body-sm" style={{ color: "var(--text-4)" }}>
              Award winners will be announced here. Check back after each quarterly cycle.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .awards-layout { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .awards-layout > div:last-child { position: static !important; }
          .awards-header-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
