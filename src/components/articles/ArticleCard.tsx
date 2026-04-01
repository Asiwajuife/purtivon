import Link from "next/link";
interface ArticleCardProps {
  slug: string;
  title: string;
  category: string;
  date: string | Date;
  excerpt?: string;
  readTime?: number;
}
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
export default function ArticleCard({
  slug,
  title,
  category,
  date,
  excerpt,
  readTime,
}: ArticleCardProps) {
  return (
    <Link
      href={`/insights/${slug}`}
      className="group flex flex-col gap-4 p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#c9a84c]/20 rounded-sm transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="inline-block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#c9a84c] bg-[#c9a84c]/10 px-2.5 py-1 rounded-sm">
          {category}
        </span>
        <div className="flex items-center gap-3 text-white/25 text-xs">
          <time dateTime={new Date(date).toISOString()}>{formatDate(date)}</time>
          {readTime !== undefined && (
            <>
              <span className="w-px h-3 bg-white/10" />
              <span>{readTime} min read</span>
            </>
          )}
        </div>
      </div>
      <h3
        className="text-white/90 group-hover:text-white font-light leading-snug tracking-wide transition-colors duration-200 text-lg"
        style={{ fontFamily: "'Cormorant Garamond', 'Didot', 'Georgia', serif" }}
      >
        {title}
      </h3>
      {excerpt && (
        <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
          {excerpt}
        </p>
      )}
      <div className="flex items-center gap-2 mt-auto pt-2">
        <span className="text-[11px] tracking-[0.18em] uppercase font-medium text-white/30 group-hover:text-[#c9a84c] transition-colors duration-200">
          Read More
        </span>
        <svg
          className="w-3.5 h-3.5 text-white/20 group-hover:text-[#c9a84c] group-hover:translate-x-1 transition-all duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </div>
    </Link>
  );
}
