// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking — disallow any iframe embedding
          { key: "X-Frame-Options",           value: "DENY" },
          // Stop browsers from MIME-sniffing the response content-type
          { key: "X-Content-Type-Options",    value: "nosniff" },
          // Only send the origin in the Referer header (no full path)
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          // Disable unused browser features
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          // Force HTTPS for 2 years, include subdomains
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Content-Security-Policy
          // unsafe-inline is required for: Next.js hydration scripts, Framer Motion inline
          // styles, and the theme-persistence inline script in layout.tsx.
          // unsafe-eval is required by some Next.js internals in production builds.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://*.purtivon.com",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
              "media-src 'self' https://res.cloudinary.com https://www.youtube.com",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Single-level wildcard — matches images.purtivon.com, cdn.purtivon.com, etc.
      // Replaced ** (any depth) with * (one level) to reduce attack surface.
      {
        protocol: "https",
        hostname: "*.purtivon.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
