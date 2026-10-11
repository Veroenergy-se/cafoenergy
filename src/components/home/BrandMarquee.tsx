import { useTranslation } from 'react-i18next'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

// Wraps v into [min, max) so the duplicated row loops seamlessly.
const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

interface RowProps {
  words: string[]
  direction: 1 | -1
  outline?: boolean
}

// One line of giant type that drifts on its own and speeds up with scroll velocity.
function Row({ words, direction, outline }: RowProps) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [0, 1000], [0, 5], { clamp: false })
  // The row holds two identical halves, so wrapping across -50%..0 loops seamlessly.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const speed = 1.6 * (1 + Math.abs(boost.get()))
    baseX.set(baseX.get() + direction * -speed * (delta / 1000))
  })

  const half = words.map((w) => `${w} · `).join('')

  return (
    <div className="overflow-hidden" aria-hidden="true">
      <motion.div
        style={{ x }}
        className={`flex w-max whitespace-nowrap font-display uppercase leading-[0.95] text-[clamp(2.6rem,7.5vw,7.5rem)] ${
          outline ? 'text-transparent [-webkit-text-stroke:2px_var(--fg)]' : 'text-fg'
        }`}
      >
        <span className="pr-[0.3em]">{half}</span>
        <span className="pr-[0.3em]">{half}</span>
      </motion.div>
    </div>
  )
}

export default function BrandMarquee() {
  const { t } = useTranslation()
  const top = t('marquee.top', { returnObjects: true }) as string[]
  const bottom = t('marquee.bottom', { returnObjects: true }) as string[]

  return (
    <section data-tone="orange" className="text-fg py-16 sm:py-24 overflow-hidden">
      <h2 className="sr-only">{top.join('. ')}</h2>
      <Row words={top} direction={1} />
      <Row words={bottom} direction={-1} outline />
      <div className="page-container mt-10 sm:mt-14 flex flex-wrap justify-between gap-6">
        <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold">{t('marquee.eyebrow')}</p>
        <p className="max-w-md text-lg leading-relaxed">{t('marquee.body')}</p>
      </div>
    </section>
  )
}
