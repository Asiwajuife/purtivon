import type { Metadata, Viewport } from 'next'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import ThemeProvider from '@/components/providers/ThemeProvider'
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
  themeColor: 'var(--surface-page)',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('purtivon-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){}})();` }} />
      </head>
      <body>
        <GoogleAnalytics />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
