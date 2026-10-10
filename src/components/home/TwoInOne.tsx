import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export default function TwoInOne() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // The wrapper swings upright and rises as the section passes through the viewport.
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [-8, -8, -8] : [-28, -8, 6])
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60])

  return (
    <section ref={ref} className="bg-caforange text-brown py-20 lg:py-28 overflow-hidden">
      <div className="page-container grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] items-center">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold">{t('twoInOne.eyebrow')}</p>
          <h2 className="mt-4 font-display uppercase leading-[0.85] text-[clamp(3.5rem,10vw,9rem)]">
            <span className="block">{t('twoInOne.a')}</span>
            <span className="block text-transparent [-webkit-text-stroke:2px_var(--color-brown)]">+ {t('twoInOne.b')}</span>
            <span className="block text-off-white">= MOAR</span>
          </h2>
          <p className="mt-8 max-w-md text-lg leading-relaxed">{t('twoInOne.body')}</p>
        </div>

        <div className="relative flex justify-center">
          <motion.img
            src="/images/moar-wrapper.png"
            alt={t('twoInOne.alt')}
            style={{ rotate, y }}
            className="w-[42%] max-w-[220px] lg:w-[58%] lg:max-w-[260px] drop-shadow-[0_40px_40px_rgba(45,30,23,0.45)]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
