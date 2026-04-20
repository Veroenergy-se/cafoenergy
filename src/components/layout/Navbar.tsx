import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/providers/CartProvider'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import CafoLogo from '@/components/shared/CafoLogo'

const navLinks = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.shop', path: '/shop' },
  { key: 'nav.community', path: '/community' },
  { key: 'nav.about', path: '/about' },
]

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-6 relative flex flex-col items-center justify-center">
      <motion.span
        className="absolute w-5 h-[2px] bg-current rounded-full"
        animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      <motion.span
        className="absolute w-5 h-[2px] bg-current rounded-full"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute w-5 h-[2px] bg-current rounded-full"
        animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  )
}

export default function Navbar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { toggleCart, cartCount } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      if (y > 80) setHidden(y > lastY.current)
      else setHidden(false)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-near-black/10 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      } ${hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <nav className="w-full px-6 lg:px-12 xl:px-16 relative flex items-center justify-between h-24">
        {/* Logo */}
        <Link to="/" className="text-near-black" aria-label="CAFO Home">
          <CafoLogo className="h-14 w-auto" />
        </Link>

        {/* Desktop Links — absolutely centred so they're unaffected by logo/right widths */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium tracking-wide uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-near-black after:transition-all after:duration-300 ${
                pathname === link.path
                  ? 'text-near-black after:w-full'
                  : 'text-near-black/60 hover:text-near-black after:w-0 hover:after:w-full'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <button
            onClick={toggleCart}
            className="relative p-2 text-near-black/60 hover:text-near-black transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 w-5 h-5 bg-near-black text-white text-xs font-bold rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={cartCount}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          <Link
            to="/shop"
            className="hidden md:inline-flex px-6 py-2.5 bg-near-black text-white font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          >
            {t('nav.getEnergized')}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-near-black/60 hover:text-near-black transition-colors"
            aria-label="Toggle menu"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 top-20 bg-black/50 md:hidden z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="md:hidden absolute top-20 left-0 right-0 bg-white border-t border-near-black/10 z-50 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="px-6 py-8 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <Link
                      to={link.path}
                      className={`block py-3 text-2xl font-heading tracking-wide ${
                        pathname === link.path ? 'text-near-black' : 'text-near-black/60'
                      }`}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                >
                  <Link
                    to="/shop"
                    className="block w-full text-center py-4 bg-near-black text-white font-semibold font-accent mt-4 text-lg"
                  >
                    {t('nav.getEnergized')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
