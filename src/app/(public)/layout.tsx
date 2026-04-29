import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/PageTransition'
import SessionProvider from '@/components/providers/SessionProvider'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider session={null}>
      <Navbar />
      {/* pb-9 = 36px to clear the fixed stock ticker at the bottom */}
      <main id="main-content" style={{ paddingBottom: 36 }}>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </SessionProvider>
  )
}
