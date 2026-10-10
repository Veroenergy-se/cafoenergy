import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/providers/CartProvider'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import MoarLogo from '@/components/shared/MoarLogo'

const navLinks = [
  { key: 'nav.shop', path: '/shop' },
  { key: 'nav.science', path: '/how-it-works' },
  { key: 'nav.community', path: '/community' },
  { key: 'nav.about', path: '/about' },
]

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-6 relative flex flex-col items-center justify-center">
      <motion.span
        className="absolute w-5 h-[2px] bg-current"
        animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      <motion.span
        className="absolute w-5 h-[2px] bg-current"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute w-5 h-[2px] bg-current"
        animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  )
}

// Reads the background colour of whatever is behind the bar, so the bar can switch
// between brown text (on cream/orange) and cream text (on brown) without per-page config.
function isDarkBehind(header: HTMLElement): boolean {
  const y = header.getBoundingClientRect().bottom - 8
  const stack = document.elementsFromPoint(window.innerWidth / 2, Math.max(y, 0))
  for (const el of stack) {
    if (header.contains(el)) continue
    // Prefer the section's own background so a coloured card inside it doesn't flip the bar.
    let node: Element | null = el.closest('section, footer') ?? el
    while (node) {
      const m = getComputedStyle(node).backgroundColor.match(/[\d.]+/g)
      if (m && (m.length < 4 || Number(m[3]) > 0.5)) {
        const [r, g, b] = m.map(Number)
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45
      }
      node = node.parentElement
    }
  }
  return false
}

export default function Navbar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { toggleCart, cartCount } = useCart()
  const [dark, setDark] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      if (y > 120) setHidden(y > lastY.current)
      else setHidden(false)
      lastY.current = y
      if (headerRef.current) setDark(isDarkBehind(headerRef.current))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const tone = mobileOpen ? 'text-off-white' : dark ? 'text-off-white' : 'text-brown'

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 inset-x-0 z-50 transition-[translate,color] duration-300 ${tone} ${
        hidden && !mobileOpen ? '-translate-y-full' : ''
      }`}
    >
      <nav className="relative page-container h-20 flex items-center justify-between gap-6">
        <Link to="/" aria-label="MOAR home" className="shrink-0">
          <MoarLogo className="h-7 sm:h-8" />
        </Link>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative font-accent font-medium text-sm transition-opacity after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-caforange after:transition-all after:duration-300 ${
                pathname === link.path ? 'opacity-100 after:w-full' : 'opacity-75 hover:opacity-100 after:w-0 hover:after:w-full'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />

          <button
            onClick={toggleCart}
            className="relative p-2 opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 w-5 h-5 bg-caforange text-off-white text-xs font-bold rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={cartCount}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          <a
            href="#waitlist"
            className="hidden md:inline-flex items-center px-4 py-2.5 border border-current font-accent font-semibold text-xs tracking-[0.14em] uppercase hover:bg-caforange hover:border-caforange hover:text-off-white transition-colors duration-300"
          >
            {t('nav.joinWaitlist')}
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden fixed inset-0 -z-10 bg-brown text-off-white pt-28 page-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    className={`block py-2 font-display uppercase text-5xl leading-none ${
                      pathname === link.path ? 'text-caforange' : ''
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}
              <a
                href="#waitlist"
                onClick={() => setMobileOpen(false)}
                className="mt-8 block text-center py-4 bg-caforange text-off-white font-accent font-semibold tracking-[0.14em] uppercase"
              >
                {t('nav.joinWaitlist')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
