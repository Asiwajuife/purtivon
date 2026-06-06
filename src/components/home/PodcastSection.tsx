"use client";
import { useEffect, useState } from "react";

interface Podcast {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  videoId: string;
  thumbnail: string | null;
  category: string | null;
  publishedAt: string;
}

function PodcastCard({ podcast, index }: { podcast: Podcast; index: number }) {
  const thumb = podcast.thumbnail ?? `https://img.youtube.com/vi/${podcast.videoId}/hqdefault.jpg`;
  const isFeatured = index === 0;

  return (
    <a
      href={podcast.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch: ${podcast.title}`}
      className={`podcast-card${isFeatured ? " podcast-featured" : ""}`}
      style={{
        display: "flex",
        flexDirection: isFeatured ? "column" : "row",
        textDecoration: "none",
        color: "inherit",
        background: "rgba(10,12,22,0.80)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderTop: isFeatured ? "2px solid rgba(201,168,76,0.5)" : "1px solid rgba(255,255,255,0.07)",
        transition: "border-color 0.28s, transform 0.28s, box-shadow 0.28s",
        overflow: "hidden",
        gridColumn: isFeatured ? "span 2" : "span 1",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        position: "relative",
        flexShrink: 0,
        width: isFeatured ? "100%" : 120,
        paddingBottom: isFeatured ? "45%" : undefined,
        height: isFeatured ? undefined : 88,
        overflow: "hidden",
        background: "#0A0C16",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={podcast.title}
          style={{
            position: isFeatured ? "absolute" : "relative",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.45s var(--ease-out)",
          }}
          className="podcast-thumb"
          loading={index === 0 ? "eager" : "lazy"}
        />

        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} aria-hidden="true" />

        {/* Play button */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }} aria-hidden="true">
          <div className="podcast-play-ring" style={{
            width: isFeatured ? 56 : 38,
            height: isFeatured ? 56 : 38,
            borderRadius: "50%",
            border: "1.5px solid rgba(201,168,76,0.7)",
            background: "rgba(10,10,15,0.72)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.25s, box-shadow 0.25s",
          }}>
            <svg
              width={isFeatured ? 18 : 12}
              height={isFeatured ? 18 : 12}
              viewBox="0 0 24 24"
              fill="#C9A84C"
              style={{ marginLeft: "2px" }}
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        {isFeatured && (
          <div style={{
            position: "absolute", bottom: "0.75rem", right: "0.75rem",
            background: "rgba(0,0,0,0.75)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "0.2rem 0.55rem",
            fontSize: "0.58rem",
            fontFamily: "var(--font-mono)",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.06em",
          }}>
            WATCH NOW
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{
        padding: isFeatured ? "1.25rem 1.5rem 1.5rem" : "0.75rem 1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
        minWidth: 0,
      }}>
        {podcast.category && (
          <span style={{
            display: "inline-block",
            fontSize: "0.58rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "0.45rem",
          }}>
            {podcast.category}
          </span>
        )}

        <p style={{
          fontFamily: "var(--font-serif)",
          fontSize: isFeatured ? "1.1rem" : "0.88rem",
          fontWeight: isFeatured ? 300 : 400,
          color: "var(--text-primary)",
          lineHeight: 1.4,
          marginBottom: "0.45rem",
          display: "-webkit-box",
          WebkitLineClamp: isFeatured ? 2 : 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {podcast.title}
        </p>

        {isFeatured && podcast.description && (
          <p style={{
            fontSize: "0.78rem",
            color: "var(--text-lo)",
            lineHeight: 1.65,
            marginBottom: "0.75rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {podcast.description}
          </p>
        )}

        <p style={{
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
          color: "var(--text-faint)",
          textTransform: "uppercase",
          marginTop: "auto",
        }}>
          {new Date(podcast.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
    </a>
  );
}

export default function PodcastSection() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/podcasts")
      .then(r => r.json())
      .then((data: Podcast[]) => {
        if (Array.isArray(data)) setPodcasts(data.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && podcasts.length === 0) return null;

  return (
    <section className="section" style={{ background: "var(--dark-100)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} aria-label="Podcast episodes">
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ width: 28, height: 1, background: "var(--gold-dim)", display: "block" }} />
              Purtivon Podcast
            </div>
            <h2 className="display-md">
              Intelligence in <em>Conversation</em>
            </h2>
          </div>
          <a
            href="https://www.youtube.com/@purtivon"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            Watch More →
          </a>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="podcast-grid">
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: "var(--dark-200)", height: 200, position: "relative", overflow: "hidden" }}>
                <div className="skeleton-shimmer" style={{ position: "absolute", inset: 0 }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="podcast-grid">
            {podcasts.map((p, i) => (
              <PodcastCard key={p.id} podcast={p} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .podcast-card:hover { border-color: rgba(201,168,76,0.3) !important; transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15) !important; }
        .podcast-card:hover .podcast-thumb { transform: scale(1.04); }
        .podcast-card:hover .podcast-play-ring { transform: scale(1.1); box-shadow: 0 0 20px rgba(201,168,76,0.5); }
        .skeleton-shimmer { background: linear-gradient(90deg, var(--dark-200) 25%, rgba(255,255,255,0.04) 50%, var(--dark-200) 75%); background-size: 200% 100%; animation: shimmer-slide 1.5s infinite; }
        @keyframes shimmer-slide { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @media (max-width: 900px)  { .podcast-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px)  { .podcast-grid { grid-template-columns: 1fr !important; } .podcast-featured { grid-column: span 1 !important; } }
      `}</style>
    </section>
  );
}
