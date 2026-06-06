import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/PageTransition'
import SessionProvider from '@/components/providers/SessionProvider'
import ScrollToTop from '@/components/ui/ScrollToTop'
import StockTicker from '@/components/home/StockTicker'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider session={null}>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <Navbar />
      {/* pb accounts for the fixed stock ticker at the bottom (34px height) */}
      <main id="main-content" style={{ paddingBottom: 34 }}>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <StockTicker />
      <ScrollToTop />
    </SessionProvider>
  )
}
