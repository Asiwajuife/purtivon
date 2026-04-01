import type { Metadata } from "next";
import ArticleCard from "@/components/articles/ArticleCard";
export const metadata: Metadata = {
  title: "Insights",
  description:
    "In-depth analysis, intelligence, and perspectives on FDI trends and global financial services.",
};
interface Author {
  id: string;
  name: string;
}
interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  readTime: number | null;
  createdAt: string;
  author: Author;
}
interface ArticlesResponse {
  articles: Article[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
async function getArticles(): Promise<ArticlesResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/articles?limit=24`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch articles.");
  return res.json();
}
export default async function InsightsPage() {
  const { articles, pagination } = await getArticles();
  return (
    <section className="flex-1 max-w-7xl mx-auto w-full px-6 py-20 md:py-28">
      <div className="mb-14 max-w-2xl">
        <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#c9a84c] mb-4">
          Intelligence & Analysis
        </span>
        <h1
          className="text-4xl md:text-5xl font-light text-white leading-tight tracking-wide mb-5"
          style={{
            fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
          }}
        >
          Global Insights
        </h1>
        <p className="text-white/40 text-sm leading-relaxed max-w-lg">
          In-depth analysis and perspectives on foreign direct investment,
          financial services, and the forces shaping global capital markets.
        </p>
      </div>
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-white/20 text-xs tracking-widest uppercase">
          {pagination.total}{" "}
          {pagination.total === 1 ? "Article" : "Articles"}
        </span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              slug={article.slug}
              title={article.title}
              category={article.category}
              date={article.createdAt}
              excerpt={article.excerpt ?? undefined}
              readTime={article.readTime ?? undefined}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-5">
            <svg
              className="w-5 h-5 text-white/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
              />
            </svg>
          </div>
          <p
            className="text-white/30 text-xl font-light mb-2"
            style={{
              fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif",
            }}
          >
            No insights published yet
          </p>
          <p className="text-white/20 text-xs tracking-wide">
            Check back soon for the latest intelligence and analysis.
          </p>
        </div>
      )}
    </section>
  );
}
