import Link from "next/link";

async function getArticles() {
  const res = await fetch("http://localhost:3000/api/articles?limit=10", {
    cache: "no-store",
  });
  const data = await res.json();
  return data.articles ?? data;
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-[#0a0a0f] overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-44 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#c9a84c]/6 blur-[140px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] font-semibold">
              Global FDI & Financial Services Media
            </p>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
          </div>
          <h1
            className="text-center text-6xl md:text-8xl font-light text-white leading-[1.05] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', 'Didot', Georgia, serif" }}
          >
            Latest{" "}
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c97a]">
              Insights
            </em>
            <br />& Awards
          </h1>
          <p className="text-center text-white/35 text-base max-w-lg mx-auto font-light leading-relaxed">
            Intelligence, analysis and recognition across global investment markets.
          </p>
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="px-6 pb-40">
        <div className="max-w-7xl mx-auto space-y-4">
          {articles.length === 0 ? (
            <div className="text-center py-32 border border-white/5">
              <p className="text-white/20 text-xs tracking-[0.3em] uppercase">No articles published yet</p>
            </div>
          ) : (
            articles.map((article: any, i: number) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
                <article className={`relative overflow-hidden border border-white/8 hover:border-[#c9a84c]/25 transition-all duration-500 bg-gradient-to-br from-[#0f0f14] to-[#0a0a0f] ${i === 0 ? "p-12 md:p-16" : "p-8 md:p-12"}`}>
                  
                  {/* glow on hover */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/4 blur-[80px] rounded-full transition-all duration-700 pointer-events-none" />
                  {/* left accent line */}
                  <div className="absolute left-0 top-0 w-px h-0 group-hover:h-full bg-gradient-to-b from-[#c9a84c]/60 via-[#c9a84c]/20 to-transparent transition-all duration-500 pointer-events-none" />

                  <div className="relative">
                    {/* tags row */}
                    <div className="flex items-center gap-3 mb-5">
                      {article.category && (
                        <span className="text-[9px] tracking-[0.35em] uppercase text-[#c9a84c] font-bold border border-[#c9a84c]/30 px-3 py-1.5">
                          {article.category}
                        </span>
                      )}
                      {i === 0 && (
                        <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-medium">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* title */}
                    <h2
                      className={`font-light text-white group-hover:text-[#e8c97a] transition-colors duration-300 leading-tight mb-4 ${i === 0 ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}
                      style={{ fontFamily: "'Cormorant Garamond', 'Didot', Georgia, serif" }}
                    >
                      {article.title}
                    </h2>

                    {/* excerpt */}
                    {article.excerpt && (
                      <p className={`text-white/35 leading-relaxed mb-8 ${i === 0 ? "text-base max-w-2xl" : "text-sm"}`}>
                        {article.excerpt}
                      </p>
                    )}

                    {/* footer row */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] flex items-center justify-center flex-shrink-0">
                          <span className="text-[7px] font-black text-[#0a0a0f]">
                            {(article.author?.name ?? "U")[0]}
                          </span>
                        </div>
                        <span className="text-xs text-white/30 tracking-wider">
                          {article.author?.name ?? "Unknown"}
                        </span>
                      </div>
                      {article.readTime && (
                        <span className="text-xs text-white/20 tracking-wider">
                          {article.readTime} min read
                        </span>
                      )}
                      <span className="ml-auto inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#c9a84c] group-hover:gap-3 transition-all duration-200">
                        Read article
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
