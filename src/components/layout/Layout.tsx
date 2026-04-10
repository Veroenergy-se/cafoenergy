import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '@/components/shared/CartDrawer'
import CookieConsent from '@/components/shared/CookieConsent'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <CookieConsent />
    </div>
  )
}
