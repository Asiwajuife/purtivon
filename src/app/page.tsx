import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function getArticles() {
  const res = await fetch("http://localhost:3000/api/articles?limit=10", {
    cache: "no-store",
  });
  const data = await res.json();
  return data.articles ?? data; // handle pagination structure
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Latest Insights & Awards</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {articles.map((article: any) => (
          <div key={article.id} className="border p-6 rounded-xl shadow hover:shadow-lg transition duration-200">
            {article.category && (
              <span className="text-sm text-blue-600 font-semibold mb-2 block">
                {article.category}
              </span>
            )}
            <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
            {article.excerpt && <p className="text-gray-700 mb-4">{article.excerpt}</p>}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>By {article.author?.name ?? "Unknown"}</span>
              {article.readTime && <span>{article.readTime} min read</span>}
            </div>
            <a
              href={`/articles/${article.slug}`}
              className="inline-block mt-4 text-blue-600 hover:underline font-medium"
            >
              Read more →
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
