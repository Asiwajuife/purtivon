import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {/* pb-9 = 36px to clear the fixed stock ticker at the bottom */}
      <main id="main-content" style={{ paddingBottom: 36 }}>{children}</main>
      <Footer />
    </>
  )
}
