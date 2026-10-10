import { useRef } from 'react'
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

type Moment = { key: string; time: string; img?: string; tone?: 'orange' | 'cream' }

const moments: Moment[] = [
  { key: 'study', time: '07:45', tone: 'orange' },
  { key: 'mountain', time: '10:00', img: '/images/community-triple360.jpg' },
  { key: 'slump', time: '15:00', img: '/images/about-nyc.jpg' },
  { key: 'pregame', time: '18:00', img: '/images/community-padel.jpg' },
  { key: 'going', time: '20:30', img: '/images/community-frontflip.jpg' },
  { key: 'late', time: '02:00', tone: 'cream' },
]

// Wraps v into [min, max) so the duplicated track loops seamlessly.
const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

export default function DayTimeline() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const drag = useRef<number | null>(null)

  // Same feel as the brand marquee: a slow drift that speeds up with scroll velocity.
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce || drag.current !== null) return
    const scrollBoost = Math.abs(boost.get())
    // Hovering pauses the idle drift so a card can be read, but scrolling still moves it.
    const speed = paused.current ? 0.6 * scrollBoost : 0.6 * (1 + scrollBoost)
    baseX.set(baseX.get() - speed * (delta / 1000))
  })

  // Drag to move, converting pixels to % of the (doubled) track width.
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = e.clientX
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (drag.current === null || !trackRef.current) return
    const dx = e.clientX - drag.current
    drag.current = e.clientX
    baseX.set(baseX.get() + (dx / trackRef.current.scrollWidth) * 100)
  }
  const endDrag = () => { drag.current = null }

  return (
    <section className="bg-brown text-off-white py-20 lg:py-28 overflow-hidden">
      <div className="page-container">
        <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-caforange">{t('day.eyebrow')}</p>
        <h2 className="mt-3 font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9]">{t('day.title')}</h2>
      </div>

      <div
        className="mt-10 cursor-grab active:cursor-grabbing select-none touch-pan-y"
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') paused.current = true }}
        onPointerLeave={() => { paused.current = false; endDrag() }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <motion.div ref={trackRef} style={{ x }} className="flex w-max">
          {[0, 1].map((copy) =>
            moments.map((m) => {
              const photo = Boolean(m.img)
              const bg = m.tone === 'orange' ? 'bg-caforange text-brown' : m.tone === 'cream' ? 'bg-off-white text-brown' : 'text-off-white'
              return (
                <article
                  key={`${copy}-${m.key}`}
                  aria-hidden={copy === 1 || undefined}
                  className={`relative shrink-0 mr-5 w-[72vw] max-w-[340px] aspect-[3/4] overflow-hidden flex flex-col justify-end p-6 ${bg}`}
                >
                  {photo && (
                    <>
                      <img src={m.img} alt="" draggable={false} loading="lazy" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brown/90" />
                    </>
                  )}
                  <div className="relative">
                    <span className={`block font-display leading-none ${photo ? 'text-6xl' : 'text-8xl'}`}>{m.time}</span>
                    <h3 className="mt-2 font-display uppercase text-2xl leading-none">{t(`day.moments.${m.key}.title`)}</h3>
                    <p className={`mt-3 text-[15px] leading-relaxed ${photo ? 'text-off-white/85' : 'opacity-80'}`}>{t(`day.moments.${m.key}.body`)}</p>
                  </div>
                </article>
              )
            }),
          )}
        </motion.div>
      </div>
    </section>
  )
}
