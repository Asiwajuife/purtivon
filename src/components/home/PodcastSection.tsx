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

function PodcastCard({ podcast }: { podcast: Podcast }) {
  const thumb = podcast.thumbnail ?? `https://img.youtube.com/vi/${podcast.videoId}/hqdefault.jpg`;

  return (
    <a
      href={podcast.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: "block", textDecoration: "none", color: "inherit", border: "1px solid var(--border)", background: "var(--dark-200)", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", paddingBottom: "56.25%", overflow: "hidden", background: "var(--surface-page)" }}>
        <img
          src={thumb}
          alt={podcast.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Play overlay */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.35)",
          transition: "background 0.2s",
        }}>
          <div style={{
            width: 44, height: 44,
            border: "1.5px solid rgba(201,168,76,0.7)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(10,10,15,0.65)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c" style={{ marginLeft: 2 }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1rem 1.15rem 1.25rem" }}>
        {podcast.category && (
          <span style={{
            display: "inline-block",
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "0.5rem",
          }}>
            {podcast.category}
          </span>
        )}
        <p style={{
          fontFamily: "var(--font-serif)",
          fontSize: "0.95rem",
          fontWeight: 400,
          color: "var(--text-primary)",
          lineHeight: 1.45,
          marginBottom: "0.5rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {podcast.title}
        </p>
        {podcast.description && (
          <p style={{
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {podcast.description}
          </p>
        )}
        <p style={{ fontSize: "0.65rem", color: "var(--text-faint)", marginTop: "0.65rem", letterSpacing: "0.05em" }}>
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
      .then((r) => r.json())
      .then((data: Podcast[]) => {
        if (Array.isArray(data)) setPodcasts(data.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && podcasts.length === 0) return null;

  return (
    <section className="section section--alt" aria-label="Podcast episodes">
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: "0.5rem" }}>Purtivon Podcast</div>
            <h2 className="display-md">Intelligence in <em>Conversation</em></h2>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "var(--border)" }} className="podcast-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "var(--dark-200)", paddingBottom: "56.25%", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, var(--surface-subtle) 25%, var(--border-faint) 50%, var(--surface-subtle) 75%)" }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="podcast-grid">
            {podcasts.map((p) => (
              <PodcastCard key={p.id} podcast={p} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1100px) { .podcast-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 760px)  { .podcast-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px)  { .podcast-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
