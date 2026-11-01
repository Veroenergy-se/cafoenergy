import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CookieConsent from '@/components/shared/CookieConsent'
import WaitlistPopup from '@/components/shared/WaitlistPopup'
import Waitlist from '@/components/home/Waitlist'
import useToneMorph from '@/hooks/useToneMorph'

export default function Layout() {
  useToneMorph()

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1 pt-20 w-full">
        <Outlet />
      </main>
      <Waitlist />
      <Footer />
      <CookieConsent />
      <WaitlistPopup />
    </div>
  )
}
