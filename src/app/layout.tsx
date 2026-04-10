import type { Metadata, Viewport } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from '@/components/providers/SessionProvider'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Purtivon — Global FDI & Financial Services Awards',
    template: '%s | Purtivon',
  },
  description:
    'Purtivon is the leading awards and media PR consultancy for foreign direct investment and international financial services. Recognising excellence across global capital markets.',
  keywords: [
    'FDI awards', 'foreign direct investment', 'financial services awards',
    'investment PR', 'media PR financial', 'ESG awards', 'capital markets',
    'investment promotion', 'global awards', 'financial PR consultancy',
  ],
  authors: [{ name: 'Purtivon' }],
  creator: 'Purtivon',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    title: 'Purtivon — Global FDI & Financial Services Awards',
    description:
      'The leading awards and media PR consultancy for foreign direct investment and international financial services.',
    siteName: 'Purtivon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Purtivon — Global FDI & Financial Services Awards',
    description:
      'The leading awards and media PR consultancy for foreign direct investment and international financial services.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GoogleAnalytics />
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
