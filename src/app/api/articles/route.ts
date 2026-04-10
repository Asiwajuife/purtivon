import { NextRequest, NextResponse } from 'next/server'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Article {
  id:          string
  title:       string
  slug:        string
  excerpt:     string
  category:    string
  author:      string
  publishedAt: string
  readTime:    number
  featured:    boolean
  coverImage:  string
}

// ─── Static articles ──────────────────────────────────────────────────────────

export const ARTICLES: Article[] = [

  // ── Awards ────────────────────────────────────────────────────────────────────

  {
    id: 'aw1',
    title: 'Purtivon Q1 2026 Global Awards: Honouring Excellence in Investment and Finance',
    slug: 'purtivon-q1-2026-global-awards-ceremony',
    excerpt: 'The Purtivon Q1 2026 Global Awards recognise the institutions, funds, and agencies that have demonstrated outstanding performance across FDI promotion, financial innovation, and cross-border capital deployment.',
    category: 'Awards',
    author: 'Purtivon Editorial',
    publishedAt: '2026-04-05T09:00:00Z',
    readTime: 5,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'aw2',
    title: 'Inside the Judging Process: How Purtivon Selects Award Recipients',
    slug: 'purtivon-awards-judging-process',
    excerpt: 'An independent panel of senior investment professionals evaluates nominations across 12 award categories. We outline the criteria, the methodology, and the standards that define a Purtivon-recognised institution.',
    category: 'Awards',
    author: 'Purtivon Editorial',
    publishedAt: '2026-03-28T10:00:00Z',
    readTime: 6,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'aw3',
    title: 'The Business Case for Award Recognition in International Finance',
    slug: 'award-recognition-international-finance-value',
    excerpt: 'Third-party recognition from an established global awards body remains one of the most cost-effective mechanisms for building institutional credibility and attracting cross-border capital flows.',
    category: 'Awards',
    author: 'Purtivon Research',
    publishedAt: '2026-03-18T08:00:00Z',
    readTime: 7,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'aw4',
    title: '2025 Annual Awards Review: A Record Year for Global Investment Excellence',
    slug: 'purtivon-2025-annual-awards-review',
    excerpt: 'Looking back at twelve months of recognition across FDI, banking, ESG, and technology — the 2025 Purtivon awards cycle saw record nominations, first-time category winners, and expanded geographic coverage.',
    category: 'Awards',
    author: 'Purtivon Editorial',
    publishedAt: '2026-02-10T09:00:00Z',
    readTime: 8,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=85&auto=format&fit=crop',
  },

  // ── Featured Insight ─────────────────────────────────────────────────────────

  {
    id: 'fi1',
    title: 'The Global FDI Outlook 2026: Where Capital Is Moving and Why',
    slug: 'global-fdi-outlook-2026',
    excerpt: 'A comprehensive analysis of cross-border investment flows in 2026 — identifying the sectors, corridors, and policy environments attracting the world\'s most consequential capital.',
    category: 'Featured Insight',
    author: 'Purtivon Research',
    publishedAt: '2026-04-01T08:00:00Z',
    readTime: 12,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'fi2',
    title: 'Gulf Vision Economies: How Saudi Arabia and UAE Are Redrawing the Global Investment Map',
    slug: 'gulf-vision-economies-investment-2026',
    excerpt: 'With Vision 2030 entering its decisive phase and UAE\'s D33 agenda accelerating, the GCC is no longer just a source of capital — it is the world\'s most ambitious investment destination.',
    category: 'Featured Insight',
    author: 'Purtivon Research',
    publishedAt: '2026-03-28T09:00:00Z',
    readTime: 10,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'fi3',
    title: 'The Rise of the Global South: Emerging Economies Take Centre Stage',
    slug: 'global-south-emerging-economies-2026',
    excerpt: 'India, Brazil, Indonesia, and Nigeria are reshaping the architecture of global investment. We examine the structural forces behind their ascent and what it means for capital allocation.',
    category: 'Featured Insight',
    author: 'Purtivon Research',
    publishedAt: '2026-03-15T10:00:00Z',
    readTime: 11,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'fi4',
    title: 'Sovereign Wealth in the Age of Geopolitical Fragmentation',
    slug: 'sovereign-wealth-geopolitical-fragmentation',
    excerpt: 'As great-power competition intensifies, sovereign wealth funds are diversifying away from traditional Western markets. Purtivon maps the new geography of state-directed capital.',
    category: 'Featured Insight',
    author: 'Purtivon Research',
    publishedAt: '2026-03-01T08:30:00Z',
    readTime: 9,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=85&auto=format&fit=crop',
  },

  // ── Report ────────────────────────────────────────────────────────────────────

  {
    id: 'r1',
    title: 'Purtivon Annual FDI Intelligence Report 2025',
    slug: 'purtivon-annual-fdi-report-2025',
    excerpt: 'Our flagship annual review of global foreign direct investment — covering flows by sector, region, and asset class, with exclusive data on deal activity, IPA performance, and investor sentiment.',
    category: 'Report',
    author: 'Purtivon Research',
    publishedAt: '2026-04-02T07:00:00Z',
    readTime: 20,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'r2',
    title: 'Q1 2026 Global Financial Services Intelligence Report',
    slug: 'q1-2026-financial-services-report',
    excerpt: 'A quarterly deep-dive into institutional capital movements, cross-border M&A, regulatory developments, and market-moving themes across banking, asset management, and insurance.',
    category: 'Report',
    author: 'Purtivon Research',
    publishedAt: '2026-03-31T09:00:00Z',
    readTime: 18,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'r3',
    title: 'State of Global Capital Markets: Mid-Year Assessment 2025',
    slug: 'global-capital-markets-midyear-2025',
    excerpt: 'A comprehensive assessment of equity, fixed income, and alternative asset markets at the halfway point of 2025 — benchmarking performance against consensus and identifying the divergences that matter.',
    category: 'Report',
    author: 'Purtivon Research',
    publishedAt: '2026-03-20T10:00:00Z',
    readTime: 15,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'r4',
    title: 'Investment Promotion Agency Performance Benchmarking Report',
    slug: 'ipa-performance-benchmarking-report-2025',
    excerpt: 'Purtivon benchmarks 48 investment promotion agencies across deal conversion rates, investor satisfaction, sectoral targeting, and digital outreach effectiveness.',
    category: 'Report',
    author: 'Purtivon Research',
    publishedAt: '2026-03-08T08:00:00Z',
    readTime: 16,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format&fit=crop',
  },

  // ── Analysis ──────────────────────────────────────────────────────────────────

  {
    id: 'an1',
    title: 'Dollar Dominance in a Fragmenting Global Economy: A Cross-Asset Analysis',
    slug: 'dollar-dominance-cross-asset-analysis-2026',
    excerpt: 'Despite decades of predictions about dollar decline, the greenback remains unchallenged as the world\'s reserve currency. We examine whether de-dollarisation is a structural trend or a geopolitical narrative.',
    category: 'Analysis',
    author: 'Purtivon Research',
    publishedAt: '2026-04-04T09:00:00Z',
    readTime: 11,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'an2',
    title: 'Political Risk Framework for FDI Decision-Making in Emerging Markets',
    slug: 'political-risk-fdi-emerging-markets-framework',
    excerpt: 'From electoral uncertainty to regulatory reversals, political risk remains the most underpriced variable in emerging market investment. We present a practitioner\'s framework for assessment and mitigation.',
    category: 'Analysis',
    author: 'Purtivon Research',
    publishedAt: '2026-03-26T10:30:00Z',
    readTime: 10,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'an3',
    title: 'Interest Rate Sensitivity: Cross-Asset Positioning for Q2 2026',
    slug: 'interest-rate-sensitivity-cross-asset-q2-2026',
    excerpt: 'With central banks signalling divergent paths, we model the interest rate sensitivity of major asset classes and identify where institutional portfolios are most exposed to repricing risk.',
    category: 'Analysis',
    author: 'Purtivon Research',
    publishedAt: '2026-03-17T09:00:00Z',
    readTime: 9,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'an4',
    title: 'Private Markets Liquidity: The Coming Reckoning for Illiquid Portfolios',
    slug: 'private-markets-liquidity-reckoning-2026',
    excerpt: 'Pension funds and endowments face an overallocation to private assets accumulated during the zero-rate era. We analyse redemption pressure, secondary market dynamics, and the path to rebalancing.',
    category: 'Analysis',
    author: 'Purtivon Research',
    publishedAt: '2026-03-04T08:00:00Z',
    readTime: 10,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85&auto=format&fit=crop',
  },

  // ── News ──────────────────────────────────────────────────────────────────────

  {
    id: 'nw1',
    title: 'ADIA Commits $5bn to Southeast Asian Infrastructure Fund',
    slug: 'adia-5bn-southeast-asia-infrastructure-fund',
    excerpt: 'The Abu Dhabi Investment Authority has anchored a $5 billion infrastructure fund targeting logistics, digital infrastructure, and clean energy projects across Vietnam, Indonesia, and the Philippines.',
    category: 'News',
    author: 'Purtivon Research',
    publishedAt: '2026-04-05T07:00:00Z',
    readTime: 4,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'nw2',
    title: 'IMF Revises 2026 Global Growth Forecast to 3.4%, Citing EM Resilience',
    slug: 'imf-global-growth-forecast-2026-revision',
    excerpt: 'The International Monetary Fund has upgraded its 2026 world growth projection, driven by stronger-than-expected performance in South Asia and Sub-Saharan Africa, partially offset by weakness in Europe.',
    category: 'News',
    author: 'Purtivon Research',
    publishedAt: '2026-04-03T10:00:00Z',
    readTime: 3,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'nw3',
    title: 'UK-Gulf Investment Partnership Unlocks £10bn in New Capital Commitments',
    slug: 'uk-gulf-investment-partnership-10bn-2026',
    excerpt: 'A landmark framework agreement between the United Kingdom and the Gulf Cooperation Council has generated £10 billion in confirmed investment pledges across clean energy, fintech, and life sciences.',
    category: 'News',
    author: 'Purtivon Research',
    publishedAt: '2026-04-01T09:00:00Z',
    readTime: 5,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'nw4',
    title: 'G20 Nations Endorse Framework for Cross-Border Digital Investment Rules',
    slug: 'g20-cross-border-digital-investment-framework',
    excerpt: 'G20 finance ministers have reached consensus on a baseline framework for regulating cross-border digital investment, covering data localisation, cybersecurity standards, and investment screening.',
    category: 'News',
    author: 'Purtivon Research',
    publishedAt: '2026-03-29T08:30:00Z',
    readTime: 4,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'nw5',
    title: 'Singapore MAS Launches $2bn Green Finance Accelerator Programme',
    slug: 'singapore-mas-green-finance-accelerator-2026',
    excerpt: 'The Monetary Authority of Singapore has unveiled a $2 billion initiative to catalyse sustainable finance flows into ASEAN, with co-investment mechanisms for institutional and development finance partners.',
    category: 'News',
    author: 'Purtivon Research',
    publishedAt: '2026-03-24T09:00:00Z',
    readTime: 4,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=85&auto=format&fit=crop',
  },

  // ── FDI Intelligence ──────────────────────────────────────────────────────────

  {
    id: '1',
    title: 'Southeast Asia Emerges as the World\'s Premier FDI Destination in 2025',
    slug: 'southeast-asia-fdi-destination-2025',
    excerpt: 'Manufacturing reshoring, digital infrastructure investment, and a young consumer class are driving unprecedented capital inflows into Vietnam, Indonesia, and the Philippines.',
    category: 'FDI Intelligence',
    author: 'Purtivon Research',
    publishedAt: '2026-03-20T09:00:00Z',
    readTime: 7,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Africa\'s FDI Renaissance: Five Markets Redefining the Continent\'s Investment Story',
    slug: 'africa-fdi-renaissance-2025',
    excerpt: 'From Morocco\'s green hydrogen ambitions to Kenya\'s fintech ecosystem, a new generation of investment destinations is challenging long-held perceptions of African risk.',
    category: 'FDI Intelligence',
    author: 'Purtivon Research',
    publishedAt: '2026-02-28T11:00:00Z',
    readTime: 9,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'How Investment Promotion Agencies Are Adapting to a Multipolar World',
    slug: 'investment-promotion-agencies-multipolar-world',
    excerpt: 'The fragmentation of global supply chains is forcing IPAs to sharpen their value propositions, compete on specificity, and demonstrate measurable economic impact.',
    category: 'FDI Intelligence',
    author: 'Purtivon Research',
    publishedAt: '2026-02-13T08:00:00Z',
    readTime: 6,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1488646953991-e54db8e60c04?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: '9',
    title: 'Digital Infrastructure: The New Frontier of Foreign Direct Investment',
    slug: 'digital-infrastructure-fdi-frontier',
    excerpt: 'Data centres, subsea cables, and cloud computing facilities have become strategic assets in the FDI landscape, attracting investment from sovereign funds, pension capital, and hyperscalers.',
    category: 'FDI Intelligence',
    author: 'Purtivon Research',
    publishedAt: '2026-01-22T11:00:00Z',
    readTime: 7,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=85&auto=format&fit=crop',
  },

  // ── Financial Services Intelligence ───────────────────────────────────────────

  {
    id: '2',
    title: 'GCC Sovereign Wealth Funds Redraw the Global Investment Map',
    slug: 'gcc-sovereign-wealth-funds-2025',
    excerpt: 'Abu Dhabi Investment Authority and the Public Investment Fund of Saudi Arabia are deploying capital at record pace, reshaping deal-making across Europe, Africa, and South Asia.',
    category: 'Financial Services Intelligence',
    author: 'Purtivon Research',
    publishedAt: '2026-03-14T10:30:00Z',
    readTime: 8,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Private Credit\'s Expanding Role in Emerging Market Infrastructure',
    slug: 'private-credit-emerging-markets-infrastructure',
    excerpt: 'As development finance institutions face bandwidth constraints, private credit funds are stepping in to bridge the infrastructure financing gap across Asia, Africa, and Latin America.',
    category: 'Financial Services Intelligence',
    author: 'Purtivon Research',
    publishedAt: '2026-02-20T09:30:00Z',
    readTime: 10,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: '8',
    title: 'Cross-Border M&A in Financial Services: 2026 Outlook',
    slug: 'cross-border-ma-financial-services-2025',
    excerpt: 'Rising interest rates have cooled deal volumes, but strategic acquirers are active in fintech, digital payments, and asset management. We identify the key themes driving consolidation.',
    category: 'Financial Services Intelligence',
    author: 'Purtivon Research',
    publishedAt: '2026-01-30T09:00:00Z',
    readTime: 7,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: '10',
    title: 'Navigating Currency Risk in an Era of Dollar Dominance',
    slug: 'currency-risk-dollar-dominance-2025',
    excerpt: 'For cross-border investors, managing currency exposure has never been more complex. We review hedging frameworks, natural hedges, and the emerging role of local-currency financing.',
    category: 'Financial Services Intelligence',
    author: 'Purtivon Research',
    publishedAt: '2026-01-15T10:30:00Z',
    readTime: 8,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=85&auto=format&fit=crop',
  },

  // ── Banks ─────────────────────────────────────────────────────────────────────

  {
    id: 'b1',
    title: 'Global Banks Accelerate Digital Transformation Amid Margin Pressure',
    slug: 'global-banks-digital-transformation-2026',
    excerpt: 'With net interest margins compressing across developed markets, the world\'s largest financial institutions are doubling down on AI-driven cost reduction and digital channel investment.',
    category: 'Banks',
    author: 'Purtivon Research',
    publishedAt: '2026-03-18T08:30:00Z',
    readTime: 6,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'b2',
    title: 'Basel IV: What the New Capital Rules Mean for International Lending',
    slug: 'basel-iv-capital-rules-international-lending',
    excerpt: 'The final phase of Basel IV reforms is reshaping how global banks calculate risk-weighted assets, with significant implications for trade finance, infrastructure lending, and SME credit.',
    category: 'Banks',
    author: 'Purtivon Research',
    publishedAt: '2026-03-05T10:00:00Z',
    readTime: 9,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'b3',
    title: 'Central Bank Digital Currencies and the Future of Correspondent Banking',
    slug: 'cbdc-correspondent-banking-future',
    excerpt: 'As more than 100 central banks pilot digital currencies, the traditional correspondent banking model faces its most significant disruption in decades. We map the transformation ahead.',
    category: 'Banks',
    author: 'Purtivon Research',
    publishedAt: '2026-02-22T09:00:00Z',
    readTime: 8,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'b4',
    title: 'Africa\'s Banking Revolution: Mobile-First Finance and Financial Inclusion',
    slug: 'africa-banking-mobile-finance-inclusion',
    excerpt: 'Sub-Saharan Africa\'s banking sector is leapfrogging traditional infrastructure, with mobile money platforms reaching 600 million users and challenging established commercial banks.',
    category: 'Banks',
    author: 'Purtivon Research',
    publishedAt: '2026-02-10T11:00:00Z',
    readTime: 7,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=1200&q=85&auto=format&fit=crop',
  },

  // ── Economy ───────────────────────────────────────────────────────────────────

  {
    id: 'e1',
    title: 'The Great Rate Reversal: Central Banks Navigate the Post-Inflation Landscape',
    slug: 'central-banks-post-inflation-rate-reversal',
    excerpt: 'With inflation retreating toward target in most advanced economies, the Federal Reserve, ECB, and Bank of England face a delicate pivot — one with profound consequences for global growth.',
    category: 'Economy',
    author: 'Purtivon Research',
    publishedAt: '2026-03-22T09:00:00Z',
    readTime: 8,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1462206092226-f46025ffe607?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'e2',
    title: 'Supply Chain Realignment Is Reshaping Global Trade Flows',
    slug: 'supply-chain-realignment-global-trade-2026',
    excerpt: 'Nearshoring, friend-shoring, and industrial policy are redirecting trillions of dollars of trade. We analyse the winners and losers in the new geography of global commerce.',
    category: 'Economy',
    author: 'Purtivon Research',
    publishedAt: '2026-03-10T10:30:00Z',
    readTime: 7,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'e3',
    title: 'Emerging Market Debt: Opportunity or Danger in a High-Rate World?',
    slug: 'emerging-market-debt-high-rate-world',
    excerpt: 'Record levels of sovereign debt in developing economies are testing the limits of multilateral support. Our analysis identifies the markets most exposed — and those best placed to adapt.',
    category: 'Economy',
    author: 'Purtivon Research',
    publishedAt: '2026-02-26T08:00:00Z',
    readTime: 9,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'e4',
    title: 'Demographics and Destiny: How Ageing Populations Will Reshape Investment',
    slug: 'demographics-ageing-populations-investment',
    excerpt: 'Demographic trends in Japan, Europe, and China are creating structural shifts in savings rates, labour supply, and pension fund asset allocation that will define the next decade.',
    category: 'Economy',
    author: 'Purtivon Research',
    publishedAt: '2026-02-12T11:00:00Z',
    readTime: 8,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=85&auto=format&fit=crop',
  },

  // ── Tech ──────────────────────────────────────────────────────────────────────

  {
    id: 't1',
    title: 'AI in Asset Management: From Portfolio Optimisation to Regulatory Risk',
    slug: 'ai-asset-management-portfolio-optimisation',
    excerpt: 'Generative AI is moving from proof-of-concept into live portfolio management, risk modelling, and client reporting — but regulatory scrutiny is intensifying at the same pace.',
    category: 'Tech',
    author: 'Purtivon Research',
    publishedAt: '2026-03-25T09:00:00Z',
    readTime: 8,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 't2',
    title: 'Fintech 2026: The Consolidation Wave Arrives',
    slug: 'fintech-2026-consolidation-wave',
    excerpt: 'After years of cheap capital fuelling fintech proliferation, a reckoning has arrived. We examine which models have proven durable, where M&A is accelerating, and what comes next.',
    category: 'Tech',
    author: 'Purtivon Research',
    publishedAt: '2026-03-12T10:00:00Z',
    readTime: 7,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 't3',
    title: 'Quantum Computing and the Coming Cryptography Crisis',
    slug: 'quantum-computing-cryptography-financial-risk',
    excerpt: 'Financial institutions are quietly preparing for a world where current encryption standards become obsolete. The quantum threat to banking infrastructure is closer than most realise.',
    category: 'Tech',
    author: 'Purtivon Research',
    publishedAt: '2026-02-24T09:30:00Z',
    readTime: 9,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 't4',
    title: 'Blockchain Beyond Crypto: Real-World Asset Tokenisation Takes Hold',
    slug: 'blockchain-real-world-asset-tokenisation',
    excerpt: 'The tokenisation of real estate, private equity, and infrastructure is moving from concept to reality. BlackRock, JPMorgan, and sovereign funds are leading the charge.',
    category: 'Tech',
    author: 'Purtivon Research',
    publishedAt: '2026-02-08T08:00:00Z',
    readTime: 7,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=85&auto=format&fit=crop',
  },

  // ── ESG ───────────────────────────────────────────────────────────────────────

  {
    id: '3',
    title: 'ESG Mandates Are Transforming Cross-Border Capital Allocation',
    slug: 'esg-mandates-cross-border-capital-2025',
    excerpt: 'Institutional investors are embedding environmental, social, and governance criteria into FDI screening processes, with profound implications for host country selection.',
    category: 'ESG',
    author: 'Purtivon Research',
    publishedAt: '2026-03-07T08:00:00Z',
    readTime: 6,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: '7',
    title: 'Green Bonds and the Architecture of Sustainable Finance',
    slug: 'green-bonds-sustainable-finance-architecture',
    excerpt: 'The green bond market surpassed $1 trillion in issuance for the second consecutive year. We examine which structures are delivering genuine environmental impact versus greenwashing.',
    category: 'ESG',
    author: 'Purtivon Research',
    publishedAt: '2026-02-06T10:00:00Z',
    readTime: 8,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'esg3',
    title: 'Net Zero Commitments Under Scrutiny: What Corporate Climate Pledges Really Mean',
    slug: 'net-zero-commitments-corporate-climate-scrutiny',
    excerpt: 'As regulators demand granular transition plans, corporate net-zero pledges face unprecedented scrutiny. We separate genuine decarbonisation strategies from reputational positioning.',
    category: 'ESG',
    author: 'Purtivon Research',
    publishedAt: '2026-03-19T09:00:00Z',
    readTime: 8,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'esg4',
    title: 'Social Impact Investing: Beyond the ESG Checkbox',
    slug: 'social-impact-investing-beyond-esg-checkbox',
    excerpt: 'A new generation of impact-first investors is demanding measurable social outcomes — not just ESG ratings. We examine the frameworks, instruments, and frontrunners shaping impact capital.',
    category: 'ESG',
    author: 'Purtivon Research',
    publishedAt: '2026-03-02T10:00:00Z',
    readTime: 7,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=85&auto=format&fit=crop',
  },
  {
    id: 'esg5',
    title: 'Board Diversity and the Governance Premium: Evidence from Global Markets',
    slug: 'board-diversity-governance-premium-global-markets',
    excerpt: 'Empirical evidence increasingly links board diversity to superior risk management and long-term value creation. Institutional investors are hardening governance standards across their portfolios.',
    category: 'ESG',
    author: 'Purtivon Research',
    publishedAt: '2026-02-18T09:00:00Z',
    readTime: 6,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=85&auto=format&fit=crop',
  },
]

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const rawLimit     = searchParams.get('limit')
    const rawOffset    = searchParams.get('offset')
    const category     = searchParams.get('category')
    const featuredOnly = searchParams.get('featured') === 'true'

    const limit  = Math.min(Math.max(parseInt(rawLimit  ?? '10', 10) || 10, 1), 100)
    const offset = Math.max(parseInt(rawOffset ?? '0',  10) || 0, 0)

    let results = [...ARTICLES]

    if (category) {
      results = results.filter((a) => a.category.toLowerCase() === category.toLowerCase())
    }
    if (featuredOnly) {
      results = results.filter((a) => a.featured)
    }

    results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    const total   = results.length
    const paged   = results.slice(offset, offset + limit)
    const hasMore = offset + limit < total

    return NextResponse.json(
      { data: paged, meta: { total, limit, offset, hasMore } },
      {
        status: 200,
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
      }
    )
  } catch (error) {
    console.error('[GET /api/articles]', error)
    return NextResponse.json(
      { error: 'Internal server error', data: [], meta: { total: 0, limit: 10, offset: 0, hasMore: false } },
      { status: 500 }
    )
  }
}
