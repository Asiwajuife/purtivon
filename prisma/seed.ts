import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ─── Create Admin User ──────────────────────────────────────────────
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("SEED_ADMIN_PASSWORD environment variable is required. Set it in .env before running the seed.");
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@purtivon.com" },
    update: { password: hashedPassword },
    create: {
      name: "Admin User",
      email: "admin@purtivon.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // ─── Categories Map ───────────────────────────────────────────────
  const categories = [
    { name: "Awards", slug: "awards" },
    { name: "News", slug: "news" },
    { name: "FDI Intelligence", slug: "fdi-intelligence" },
    { name: "Analysis", slug: "analysis" },
    { name: "ESG", slug: "esg" },
    { name: "Reports", slug: "reports" },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug },
    });
    categoryMap[cat.name] = c.id;
  }

  // ─── Articles ─────────────────────────────────────────────────────
  const articles = [
    {
      title: "Top Industry Awards 2025",
      slug: "top-awards-2025",
      excerpt:
        "A roundup of the most prestigious awards shaping the global investment landscape this year.",
      category: "Awards",
      readTime: 5,
      content:
        "Full article content coming soon about the Top Industry Awards 2025...",
    },
    {
      title: "Welcome to Purtivon",
      slug: "welcome-to-purtivon",
      excerpt:
        "An introduction to Purtivon and our mission to deliver world-class FDI intelligence.",
      category: "News",
      readTime: 3,
      content: "Full article content coming soon about Purtivon...",
    },
    {
      title: "FDI Flows Hit Record Highs in Southeast Asia",
      slug: "fdi-flows-southeast-asia-2025",
      excerpt:
        "Foreign direct investment into Southeast Asia surged to unprecedented levels, driven by manufacturing reshoring and digital infrastructure demand.",
      category: "FDI Intelligence",
      readTime: 7,
      content:
        "Full article content coming soon about FDI Flows in Southeast Asia...",
    },
    {
      title: "The Rise of Sovereign Wealth Funds",
      slug: "sovereign-wealth-funds-2025",
      excerpt:
        "Sovereign wealth funds are increasingly deploying capital into emerging markets, reshaping the global investment hierarchy.",
      category: "Analysis",
      readTime: 6,
      content:
        "Full article content coming soon about Sovereign Wealth Funds...",
    },
    {
      title: "Green Finance & the New ESG Mandate",
      slug: "green-finance-esg-mandate",
      excerpt:
        "How ESG requirements are transforming capital allocation strategies across institutional investors worldwide.",
      category: "ESG",
      readTime: 4,
      content:
        "Full article content coming soon about Green Finance & ESG...",
    },
    {
      title: "2025 Financial Services Innovation Report",
      slug: "financial-services-innovation-2025",
      excerpt:
        "Our annual deep-dive into the technologies and strategies redefining financial services across global markets.",
      category: "Reports",
      readTime: 12,
      content:
        "Full article content coming soon about Financial Services Innovation...",
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        readTime: article.readTime,
        status: 'PUBLISHED' as const,
        authorId: admin.id,
        categoryId: article.category ? categoryMap[article.category] : undefined,
      },
    });
  }

  // ─── Awards (Q2 2026) ─────────────────────────────────────────────
  const awards = [
    {
      title: "Best FDI Destination — Q2 2026",
      category: "Foreign Direct Investment",
      description: "Recognising the country or region that has demonstrated outstanding performance in attracting foreign direct investment during Q2 2026 (April–June).",
    },
    {
      title: "Excellence in Financial Services Innovation — Q2 2026",
      category: "Financial Services",
      description: "Awarded to the institution leading transformative change in financial products, platforms, or delivery models in Q2 2026.",
    },
    {
      title: "Outstanding ESG Leadership — Q2 2026",
      category: "ESG & Sustainability",
      description: "Celebrating organisations that have embedded environmental, social, and governance principles at the core of their investment strategy in Q2 2026.",
    },
    {
      title: "Global Infrastructure Investment Award — Q2 2026",
      category: "Infrastructure",
      description: "Honouring the most impactful cross-border infrastructure investment project active during Q2 2026.",
    },
    {
      title: "Emerging Market Champion — Q2 2026",
      category: "Emerging Markets",
      description: "Recognising the fund, institution, or government body that has made the most significant contribution to emerging market development in Q2 2026.",
    },
    {
      title: "Deal of the Quarter — Q2 2026",
      category: "Transactions",
      description: "Awarded to the most strategically significant and value-creating cross-border transaction completed in Q2 2026 (April–June).",
    },
  ];

  // Update any existing awards to Q2 2026
  await prisma.award.updateMany({ data: { year: 2026, quarter: 2 } });

  // Create seed awards if none exist yet
  const existingCount = await prisma.award.count();
  if (existingCount === 0) {
    await prisma.award.createMany({
      data: awards.map((a) => ({ ...a, year: 2026, quarter: 2 })),
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });