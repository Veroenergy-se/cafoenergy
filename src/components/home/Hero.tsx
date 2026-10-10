import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { SITE } from '@/lib/constants'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function Hero() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const video = SITE.heroVideo

  return (
    <section className="relative -mt-20 bg-off-white text-brown overflow-hidden">
      <div className="page-container pt-28 sm:pt-32 pb-16 lg:pb-24 grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center lg:min-h-[min(100svh,960px)]">
        {/* Text */}
        <motion.div
          className="order-2 lg:order-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <h1 className="font-display uppercase leading-[0.86] text-[clamp(2.75rem,11vw,8.5rem)] lg:text-[clamp(4rem,7.4vw,8.5rem)]">
            <span className="block">{t('hero.titleLine1')}</span>
            <span className="block text-caforange">{t('hero.titleLine2')}</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-brown/75">{t('hero.lede')}</p>

          <div className="mt-8 flex gap-8 sm:gap-12">
            <div>
              <span className="block font-display text-5xl sm:text-6xl leading-none">90<span className="text-[0.5em]">mg</span></span>
              <span className="mt-1 block font-accent text-xs uppercase tracking-[0.16em] font-semibold text-brown/60">{t('hero.caffeine')}</span>
            </div>
            <div className="w-px bg-brown/15" />
            <div>
              <span className="block font-display text-5xl sm:text-6xl leading-none">14<span className="text-[0.5em]">g</span></span>
              <span className="mt-1 block font-accent text-xs uppercase tracking-[0.16em] font-semibold text-brown/60">{t('hero.protein')}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center px-9 py-4 bg-caforange text-brown font-accent font-semibold text-sm uppercase tracking-[0.14em] hover:bg-brown hover:text-off-white transition-colors duration-300"
            >
              {t('hero.joinWaitlist')}
            </a>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center px-9 py-4 border-2 border-brown font-accent font-semibold text-sm uppercase tracking-[0.14em] hover:bg-brown hover:text-off-white transition-colors duration-300"
            >
              {t('hero.learnMore')}
            </Link>
          </div>
        </motion.div>

        {/* Media: the brand video once it exists, the bar until then */}
        <motion.div
          className="order-1 lg:order-2 relative w-full aspect-[4/3] lg:aspect-[4/5] overflow-hidden bg-caforange"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          {video ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={video}
              poster={SITE.heroPoster || undefined}
              autoPlay
              muted
              loop
              playsInline
              aria-label={t('hero.videoAlt')}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-[70%] aspect-square rounded-full bg-[radial-gradient(circle,rgba(237,230,220,0.35),transparent_65%)]" />
              <motion.img
                src="/images/moar-wrapper.png"
                alt={t('twoInOne.alt')}
                className="relative h-[82%] w-auto max-w-none drop-shadow-[0_40px_40px_rgba(45,30,23,0.45)]"
                initial={{ rotate: -18 }}
                animate={reduce ? { rotate: -14 } : { rotate: [-14, -10, -14], y: [0, -12, 0] }}
                transition={reduce ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
