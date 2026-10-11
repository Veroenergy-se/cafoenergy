import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const ticks = Array.from({ length: 12 }, (_, i) => i)

export default function TwoInOne() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  // The clock runs from 12:00 to 3:00 as the section scrolls into the middle of the screen.
  const hour = useTransform(scrollYProgress, [0, 1], reduce ? [90, 90] : [0, 90])
  const minute = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 1080])
  const wrapRotate = useTransform(scrollYProgress, [0, 1], reduce ? [-14, -14] : [-34, -14])
  const wrapY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, 0])

  return (
    <section ref={ref} data-tone="orange" className="text-fg py-20 lg:py-28 overflow-hidden">
      <div className="page-container grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-center">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold">{t('twoInOne.eyebrow')}</p>
          <h2 className="mt-4 font-display uppercase leading-[0.82] text-[clamp(4.5rem,13vw,11rem)]">
            {t('twoInOne.titleA')} <span className="text-accent">{t('twoInOne.titleB')}</span>
            {t('twoInOne.titleC') && (
              <>
                <br />
                {t('twoInOne.titleC')}
              </>
            )}
          </h2>

          <p className="mt-8 font-display uppercase text-3xl sm:text-4xl leading-none">
            {t('twoInOne.a')}{' '}
            <span className="text-transparent [-webkit-text-stroke:1.5px_var(--fg)]">+ {t('twoInOne.b')}</span>{' '}
            <span className="text-accent">= MOAR</span>
          </p>
          <p className="mt-6 max-w-md text-lg leading-relaxed">{t('twoInOne.body')}</p>
        </div>

        <div className="relative mx-auto w-full max-w-[460px] aspect-square">
          {/* Clock face */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" aria-hidden="true">
            <circle cx="100" cy="100" r="96" fill="none" stroke="var(--fg)" strokeWidth="4" />
            {ticks.map((i) => (
              <line
                key={i}
                x1="100" y1={i % 3 === 0 ? 12 : 14} x2="100" y2={i % 3 === 0 ? 30 : 22}
                stroke="var(--fg)" strokeWidth={i % 3 === 0 ? 5 : 2.5}
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}
            <text x="158" y="108" textAnchor="middle" className="font-display" fontSize="22" fill="var(--accent)">3</text>
            <motion.line x1="100" y1="100" x2="100" y2="34" stroke="var(--fg)" strokeWidth="4" strokeLinecap="round" style={{ rotate: minute, originX: 0.5, originY: 1 }} />
            <motion.line x1="100" y1="100" x2="100" y2="54" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" style={{ rotate: hour, originX: 0.5, originY: 1 }} />
            <circle cx="100" cy="100" r="6" fill="var(--fg)" />
          </svg>

          {/* The bar, leaning on the clock */}
          <motion.img
            src="/images/moar-wrapper.png"
            alt={t('twoInOne.alt')}
            style={{ rotate: wrapRotate, y: wrapY }}
            className="absolute -bottom-6 -left-4 sm:-left-10 w-[34%] drop-shadow-[0_30px_30px_rgba(45,29,23,0.45)]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
