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
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `Q${q} ${now.getFullYear()}`;
}

export default async function AwardsPage() {
  const [rawAwards, rawWinners] = await Promise.all([
    prisma.award.findMany({
      orderBy: [{ year: "desc" }, { title: "asc" }],
      select: { id: true, title: true, category: true, year: true, description: true, createdAt: true },
    }),
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
  }));

  const dbWinnerIds = new Set(fromDbWinners.map((w) => w.id));
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
    <div style={{ paddingTop: 68 }}>

      {/* ── Dramatic hero ── */}
      <div className="awards-hero-section" style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #03050f 0%, #050810 60%, var(--dark) 100%)",
        padding: "5.5rem 0 4rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Gradient mesh */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: [
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(201,168,76,0.07) 0%, transparent 65%)",
            "radial-gradient(ellipse 40% 40% at 15% 70%, rgba(59,130,246,0.05) 0%, transparent 55%)",
            "radial-gradient(ellipse 35% 50% at 85% 80%, rgba(201,168,76,0.04) 0%, transparent 50%)",
          ].join(","),
        }} />

        {/* Globe wireframe */}
        <div aria-hidden="true" style={{
          position: "absolute",
          right: "-5%", top: "50%",
          transform: "translateY(-50%)",
          width: "min(520px, 55vw)",
          opacity: 0.07,
          pointerEvents: "none",
        }}>
          <svg viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="260" cy="260" r="240" stroke="#C9A84C" strokeWidth="0.8"/>
            <circle cx="260" cy="260" r="168" stroke="#C9A84C" strokeWidth="0.6"/>
            <circle cx="260" cy="260" r="96" stroke="#C9A84C" strokeWidth="0.5"/>
            <ellipse cx="260" cy="260" rx="240" ry="86" stroke="#C9A84C" strokeWidth="0.7"/>
            <ellipse cx="260" cy="260" rx="240" ry="160" stroke="#C9A84C" strokeWidth="0.5"/>
            <path d="M20 260 Q260 60 500 260 Q260 460 20 260Z" stroke="#C9A84C" fill="none" strokeWidth="0.5"/>
            <path d="M260 20 Q460 260 260 500 Q60 260 260 20Z" stroke="#C9A84C" fill="none" strokeWidth="0.5"/>
            <line x1="20" y1="260" x2="500" y2="260" stroke="#3B82F6" strokeWidth="0.4" opacity="0.6"/>
            <line x1="260" y1="20" x2="260" y2="500" stroke="#3B82F6" strokeWidth="0.4" opacity="0.6"/>
            <circle cx="260" cy="260" r="3" fill="#C9A84C" opacity="0.9"/>
            <circle cx="370" cy="168" r="2.5" fill="#C9A84C" opacity="0.7"/>
            <circle cx="160" cy="340" r="2" fill="#3B82F6" opacity="0.7"/>
            <circle cx="380" cy="340" r="2" fill="#3B82F6" opacity="0.6"/>
          </svg>
        </div>

        {/* Dot matrix */}
        <div aria-hidden="true" className="dot-matrix" style={{ position: "absolute", inset: 0, opacity: 0.35 }} />

        {/* Gold top line */}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6) 30%, rgba(232,201,122,0.8) 50%, rgba(201,168,76,0.6) 70%, transparent)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem", position: "relative" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ width: 28, height: 1, background: "var(--gold-dim)", display: "block" }} />
            Recognition &amp; Excellence · {getCurrentQuarterLabel()}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "flex-end", gap: "3rem", marginBottom: "3rem" }} className="awards-header-grid">
            <h1 className="display-xl" style={{ maxWidth: 560, lineHeight: 1.08 }}>
              Global <em>Awards</em>
              <br />
              <span style={{ fontSize: "0.6em", letterSpacing: "0.04em" }}>{getCurrentQuarterLabel()}</span>
            </h1>
            <p className="body-sm" style={{ maxWidth: 340, paddingBottom: "0.35rem", color: "var(--text-lo)", lineHeight: 1.8 }}>
              Media recognition across Financial Services, FDI, and Leadership —
              independently judged and distributed to a global audience of investors and decision-makers.
            </p>
          </div>

          {/* Stats row */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            flexWrap: "wrap",
          }}>
            {[
              { value: awards.length || "—", label: awards.length === 1 ? "Award Category" : "Award Categories" },
              { value: categories.length || "—", label: "Disciplines" },
              { value: winners.length || "—", label: "Past Winners" },
              { value: "48", label: "Countries Eligible" },
            ].map((stat, i) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.08)", margin: "0 2.5rem" }} />}
                <div>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", fontWeight: 300, color: "var(--gold)", lineHeight: 1, marginBottom: "0.3rem" }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-4)" }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content: awards list + nomination form ── */}
      <div className="awards-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2.5rem 3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "4rem", alignItems: "start" }} className="awards-layout">

          {/* Awards list */}
          <AwardsList awards={awards} />

          {/* Sidebar: nomination form */}
          <div style={{ position: "sticky", top: "5.5rem" }}>
            {/* Form header */}
            <div style={{
              background: "rgba(10,12,22,0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: "2px solid rgba(201,168,76,0.5)",
              padding: "1.5rem",
              marginBottom: 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.65rem" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  background: "rgba(201,168,76,0.12)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  padding: "0.2rem 0.65rem",
                  fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "var(--gold)",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
                  {getCurrentQuarterLabel()} Open
                </span>
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", fontWeight: 300, color: "var(--text-hi)", marginBottom: "0.5rem" }}>
                Submit a Nomination
              </h2>
              <p style={{ fontSize: "0.73rem", color: "var(--text-lo)", lineHeight: 1.7 }}>
                Nominate your organisation for recognition across our global award categories. All submissions are evaluated by an independent judging panel.
              </p>
            </div>

            <SubmissionForm awards={awards} />
          </div>
        </div>
      </div>

      {/* ── Past Winners section ── */}
      {winners.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border-faint)" }}>
          <AwardWinners winners={winners} />
        </div>
      )}

      {winners.length === 0 && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2.5rem 5rem" }}>
          <div style={{
            padding: "3.5rem 2rem",
            border: "1px solid var(--border-faint)",
            background: "rgba(255,255,255,0.01)",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-5)", marginBottom: "0.6rem" }}>
              Past Winners
            </p>
            <p className="body-sm" style={{ color: "var(--text-4)" }}>
              Award winners will be announced here. Check back after each quarterly cycle.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @media (max-width: 960px) {
          .awards-layout { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .awards-layout > div:last-child { position: static !important; top: auto !important; }
          .awards-header-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .awards-hero-section { padding: 3rem 0 2.5rem !important; }
          .awards-content { padding: 2.5rem 1.25rem 2rem !important; }
        }
      `}</style>
    </div>
  );
}
