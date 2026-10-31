import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { SITE } from '@/lib/constants'

const ease = [0.25, 0.46, 0.45, 0.94] as const
const PHONE = '(max-width: 767px)'

// Full-screen brand film behind the headline. Phones get an upright cut. A brown
// fade sits between the film and the text so the copy reads over any scene.
export default function Hero() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(PHONE).matches)

  useEffect(() => {
    const mq = window.matchMedia(PHONE)
    const onChange = () => setPhone(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Only play while the hero is on screen, so it doesn't use the CPU further down the page.
  useEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
    return () => io.disconnect()
  }, [reduce, phone])

  const longest = Math.max(...`${t('hero.titleLine1')} ${t('hero.titleLine2')}`.split(/\s+/).map((w) => w.length))
  const src = phone ? SITE.heroVideoMobile : SITE.heroVideo
  const poster = phone ? SITE.heroPosterMobile : SITE.heroPoster

  return (
    <section data-tone="brown" className="relative -mt-20 min-h-[100svh] text-fg overflow-hidden bg-brown">
      {src && (
        <video
          key={src}
          ref={ref}
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          poster={poster || undefined}
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="auto"
          aria-label={t('hero.videoAlt')}
        />
      )}
      {/* Readability: dark on the left (desktop) or the bottom (phones), clear elsewhere */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(45,29,23,0.95)_0%,rgba(45,29,23,0.75)_38%,rgba(45,29,23,0.15)_70%,rgba(45,29,23,0.35)_100%)] md:bg-[linear-gradient(90deg,rgba(45,29,23,0.9)_0%,rgba(45,29,23,0.72)_32%,rgba(45,29,23,0.2)_62%,rgba(45,29,23,0)_80%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brown/60 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brown to-transparent" />

      <div className="relative page-container min-h-[100svh] flex items-end md:items-center pt-28 pb-14 md:pb-20">
        <motion.div
          className="w-full min-w-0 max-w-[780px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
        >
          {/* Sized from the longest word so every language fits without breaking a word */}
          <h1
            className="font-display uppercase leading-[0.92] text-[min(4.6rem,calc((100vw-48px)/(var(--n)*1.02)))] md:text-[min(4.8rem,4.6vw,calc(780px/(var(--n)*1.02)))] drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
            style={{ '--n': longest } as React.CSSProperties}
          >
            <span className="block">{t('hero.titleLine1')}</span>
            <span className="block text-accent">{t('hero.titleLine2')}</span>
          </h1>

          <div className="mt-8 flex gap-8 sm:gap-12">
            <div>
              <span className="block font-display text-4xl sm:text-5xl leading-none">90<span className="text-[0.5em]">mg</span></span>
              <span className="mt-1 block font-accent text-xs uppercase tracking-[0.16em] font-semibold text-fg/70">{t('hero.caffeine')}</span>
            </div>
            <div className="w-px bg-fg/25" />
            <div>
              <span className="block font-display text-4xl sm:text-5xl leading-none">14<span className="text-[0.5em]">g</span></span>
              <span className="mt-1 block font-accent text-xs uppercase tracking-[0.16em] font-semibold text-fg/70">{t('hero.protein')}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center px-9 py-4 bg-caforange text-brown font-accent font-semibold text-sm uppercase tracking-[0.14em] hover:bg-off-white transition-colors duration-300"
            >
              {t('hero.joinWaitlist')}
            </a>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center px-9 py-4 border-2 border-fg font-accent font-semibold text-sm uppercase tracking-[0.14em] hover:bg-fg hover:text-brown transition-colors duration-300"
            >
              {t('hero.learnMore')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
