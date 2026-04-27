// Migrates local article data to Neon and fixes missing columns
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const articles = [
  {
    id: "cmnpy8wmw00014whukvm1hr6x",
    title: "Markets on Edge: Oil Shock, Bank Profits Rise, and Global Finance Faces New Volatility Risks",
    slug: "markets-on-edge-oil-shock-bank-profits-rise-and-global-finance-faces-new-volatility-risks",
    excerpt: "Global financial markets are navigating a fragile moment as rising geopolitical tensions, surging oil prices, and shifting banking dynamics converge to reshape the economic outlook.",
    coverImage: "https://res.cloudinary.com/dumn64k3z/image/upload/v1775647175/purtivon/articles/mimmsetvkk6wkegdigyo.png",
    readTime: 5,
    views: 0,
    status: "PUBLISHED",
    content: {"type":"doc","content":[{"type":"paragraph"},{"type":"paragraph","content":[{"text":"Global financial markets are navigating a fragile moment as rising geopolitical tensions, surging oil prices, and shifting banking dynamics converge to reshape the economic outlook.","type":"text"}]},{"type":"paragraph","content":[{"text":"Oil prices have climbed sharply above $110 per barrel, driven by renewed tensions surrounding the Strait of Hormuz—a critical artery for global energy supply. The spike has reignited inflation concerns across major economies, complicating expectations that central banks would begin easing interest rates in the near term. For investors, the result has been heightened volatility across equities, bonds, and currency markets.","type":"text"}]},{"type":"paragraph","content":[{"text":"At the same time, major banks—particularly in the United States—are heading into earnings season with cautious optimism. Strong dealmaking activity and a rebound in investment banking revenues are expected to boost first-quarter profits. Large-scale mergers and acquisitions, especially transactions exceeding $10 billion, have provided a significant tailwind for fee-based income. However, this momentum is tempered by uncertainty, as geopolitical risks and tighter financial conditions could slow lending activity and dampen capital markets in the months ahead.","type":"text"}]},{"type":"paragraph","content":[{"text":"In the United Kingdom, the financial sector has shown notable resilience. Firms across the City are reporting their fastest improvement in business conditions in decades, supported by higher interest margins and stabilising credit demand. Yet, this recovery remains vulnerable to external shocks, particularly those stemming from energy markets and global trade disruptions.","type":"text"}]},{"type":"paragraph","content":[{"text":"A broader structural shift is also underway within the banking industry. Institutions are increasingly focusing on private capital and financial sponsors, reflecting a changing deal environment where traditional exit routes, such as IPOs, remain subdued. This pivot signals a longer-term transformation in how banks generate revenue and engage with institutional investors.","type":"text"}]},{"type":"paragraph","content":[{"text":"Meanwhile, financial stability concerns are resurfacing in emerging markets. Global institutions have warned about the growing reliance on short-term portfolio flows—often referred to as \"hot money\"—which can rapidly reverse in times of uncertainty. Such volatility poses risks to currency stability, sovereign debt markets, and overall economic resilience in developing economies.","type":"text"}]},{"type":"paragraph","content":[{"text":"Taken together, these developments highlight a financial system caught between strength and strain. While bank earnings and sectoral recoveries offer signs of resilience, external pressures—from energy shocks to geopolitical instability—continue to cast a long shadow.","type":"text"}]},{"type":"paragraph","content":[{"text":"For policymakers and investors alike, the coming weeks will be critical. The interplay between inflation, interest rates, and global risk sentiment will determine whether markets stabilise—or face a deeper period of disruption.","type":"text"}]}]},
  },
  {
    id: "cmnhx4rk7000exdsybxs5vyel",
    title: "The Rise of Sovereign Wealth Funds",
    slug: "sovereign-wealth-funds-2025",
    excerpt: "Sovereign wealth funds are increasingly deploying capital into emerging markets, reshaping the global investment hierarchy.",
    coverImage: "https://res.cloudinary.com/dumn64k3z/image/upload/v1775671424/purtivon/articles/ruidnupve9upooar2obf.png",
    readTime: 6,
    views: 0,
    status: "PUBLISHED",
    content: {"type":"doc","content":[{"type":"paragraph","content":[{"text":"Full article content coming soon about Sovereign Wealth Funds...","type":"text"}]}]},
  },
  {
    id: "cmnhx4rkh000ixdsyj31ij5fs",
    title: "2025 Financial Services Innovation Report",
    slug: "financial-services-innovation-2025",
    excerpt: "Our annual deep-dive into the technologies and strategies redefining financial services across global markets.",
    coverImage: "https://res.cloudinary.com/dumn64k3z/image/upload/v1775663788/purtivon/articles/m2jwh9mqn3aosh7rzpzo.jpg",
    readTime: 5,
    views: 0,
    status: "PUBLISHED",
    content: {"type":"doc","content":[{"type":"paragraph","content":[{"text":"Full article content coming soon about Financial Services Innovation...","type":"text"}]}]},
  },
  {
    id: "cmnhx4rjj0008xdsyl9mngo3u",
    title: "Top Industry Awards 2025",
    slug: "top-awards-2025",
    excerpt: "A roundup of the most prestigious awards shaping the global investment landscape this year.",
    coverImage: "https://res.cloudinary.com/dumn64k3z/image/upload/v1775671234/purtivon/articles/d88mo4dmmgw1zoez7jfh.jpg",
    readTime: 5,
    views: 0,
    status: "PUBLISHED",
    content: {"type":"doc","content":[{"type":"paragraph","content":[{"text":"Full article content coming soon about the Top Industry Awards 2025...","type":"text"}]}]},
  },
  {
    id: "cmnhx4rkd000gxdsyh7nar5pu",
    title: "Green Finance & the New ESG Mandate",
    slug: "green-finance-esg-mandate",
    excerpt: "How ESG requirements are transforming capital allocation strategies across institutional investors worldwide.",
    coverImage: "https://res.cloudinary.com/dumn64k3z/image/upload/v1775671352/purtivon/articles/jn0vdcjqruelzsolu6is.webp",
    readTime: 4,
    views: 0,
    status: "PUBLISHED",
    content: {"type":"doc","content":[{"type":"paragraph","content":[{"text":"Full article content coming soon about Green Finance & ESG...","type":"text"}]}]},
  },
  {
    id: "cmnhx4rk0000cxdsyrdc5lers",
    title: "FDI Flows Hit Record Highs in Southeast Asia",
    slug: "fdi-flows-southeast-asia-2025",
    excerpt: "Foreign direct investment into Southeast Asia surged to unprecedented levels, driven by manufacturing reshoring and digital infrastructure demand.",
    coverImage: "https://res.cloudinary.com/dumn64k3z/image/upload/v1775671505/purtivon/articles/nv6vyeoqcrwunicxiiqk.jpg",
    readTime: 7,
    views: 0,
    status: "PUBLISHED",
    content: {"type":"doc","content":[{"type":"paragraph","content":[{"text":"Full article content coming soon about FDI Flows in Southeast Asia...","type":"text"}]}]},
  },
  {
    id: "cmnhx4rjv000axdsyuz5b5uqi",
    title: "Welcome to Purtivon",
    slug: "welcome-to-purtivon",
    excerpt: "An introduction to Purtivon and our mission to deliver world-class FDI intelligence.",
    coverImage: "https://res.cloudinary.com/dumn64k3z/image/upload/v1775672916/purtivon/articles/qdfqdjtrlhmhuwjl1vd7.png",
    readTime: 3,
    views: 0,
    status: "PUBLISHED",
    content: {"type":"doc","content":[{"type":"paragraph","content":[{"text":"Full article content coming soon about Purtivon...","type":"text"}]}]},
  },
];

async function main() {
  console.log("Adding missing columns to award_winners...");
  await prisma.$executeRawUnsafe(`ALTER TABLE award_winners ADD COLUMN IF NOT EXISTS slug TEXT`);
  await prisma.$executeRawUnsafe(`ALTER TABLE award_winners ADD COLUMN IF NOT EXISTS logo TEXT`);
  await prisma.$executeRawUnsafe(`ALTER TABLE award_winners ADD COLUMN IF NOT EXISTS profile TEXT`);
  console.log("✅ award_winners columns ready");

  // Get the admin user id
  const admin = await prisma.user.findUnique({ where: { email: "admin@purtivon.com" }, select: { id: true } });
  if (!admin) throw new Error("Admin user not found — run seed first");

  // Get all categories
  const cats = await prisma.category.findMany({ select: { id: true, slug: true } });
  const catBySlug = Object.fromEntries(cats.map(c => [c.slug, c.id]));

  const slugToCat = {
    "markets-on-edge-oil-shock-bank-profits-rise-and-global-finance-faces-new-volatility-risks": catBySlug["fdi-intelligence"] ?? cats[0]?.id,
    "sovereign-wealth-funds-2025": catBySlug["fdi-intelligence"] ?? cats[0]?.id,
    "financial-services-innovation-2025": catBySlug["reports"] ?? cats[0]?.id,
    "top-awards-2025": catBySlug["awards"] ?? cats[0]?.id,
    "green-finance-esg-mandate": catBySlug["esg"] ?? cats[0]?.id,
    "fdi-flows-southeast-asia-2025": catBySlug["fdi-intelligence"] ?? cats[0]?.id,
    "welcome-to-purtivon": catBySlug["news"] ?? cats[0]?.id,
  };

  console.log("Upserting articles...");
  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        coverImage: article.coverImage,
        content: article.content,
        excerpt: article.excerpt,
        readTime: article.readTime,
        status: article.status,
      },
      create: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage,
        readTime: article.readTime,
        views: article.views,
        status: article.status,
        authorId: admin.id,
        categoryId: slugToCat[article.slug] ?? cats[0]?.id,
      },
    });
    console.log(`  ✅ ${article.title}`);
  }

  console.log("\n✅ All done — articles migrated to Neon with Cloudinary images.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
