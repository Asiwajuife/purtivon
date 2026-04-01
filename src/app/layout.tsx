import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "@/app/globals.css";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "Purtivon — Global FDI & Financial Services Media",
    template: "%s | Purtivon",
  },
  description:
    "Purtivon is the global media platform for FDI intelligence, financial services insights, and investment award recognition.",
  keywords: [
    "FDI",
    "foreign direct investment",
    "financial services",
    "investment media",
    "global finance",
    "Purtivon",
  ],
  authors: [{ name: "Purtivon" }],
  creator: "Purtivon",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://purtivon.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Purtivon",
    title: "Purtivon — Global FDI & Financial Services Media",
    description:
      "The global media platform for FDI intelligence, financial services insights, and investment award recognition.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Purtivon — Global FDI & Financial Services Media",
    description:
      "The global media platform for FDI intelligence, financial services insights, and investment award recognition.",
    creator: "@purtivon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} font-sans bg-[#0a0a0f] text-white antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
