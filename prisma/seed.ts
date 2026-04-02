import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@purtivon.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@purtivon.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const articles = [
    { title: "Top Industry Awards 2025", slug: "top-awards-2025", excerpt: "A roundup of the most prestigious awards shaping the global investment landscape this year.", category: "Awards", readTime: 5 },
    { title: "Welcome to Purtivon", slug: "welcome-to-purtivon", excerpt: "An introduction to Purtivon and our mission to deliver world-class FDI intelligence.", category: "News", readTime: 3 },
    { title: "FDI Flows Hit Record Highs in Southeast Asia", slug: "fdi-flows-southeast-asia-2025", excerpt: "Foreign direct investment into Southeast Asia surged to unprecedented levels, driven by manufacturing reshoring and digital infrastructure demand.", category: "FDI Intelligence", readTime: 7 },
    { title: "The Rise of Sovereign Wealth Funds", slug: "sovereign-wealth-funds-2025", excerpt: "Sovereign wealth funds are increasingly deploying capital into emerging markets, reshaping the global investment hierarchy.", category: "Analysis", readTime: 6 },
    { title: "Green Finance & the New ESG Mandate", slug: "green-finance-esg-mandate", excerpt: "How ESG requirements are transforming capital allocation strategies across institutional investors worldwide.", category: "ESG", readTime: 4 },
    { title: "2025 Financial Services Innovation Report", slug: "financial-services-innovation-2025", excerpt: "Our annual deep-dive into the technologies and strategies redefining financial services across global markets.", category: "Reports", readTime: 12 },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        title: article.title,
        slug: article.slug,
        content: "Full article content coming soon.",
        excerpt: article.excerpt,
        category: article.category,
        readTime: article.readTime,
        published: true,
        authorId: admin.id,
      },
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
