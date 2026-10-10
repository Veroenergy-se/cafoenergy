import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type Moment = { key: string; time: string; img?: string; tone?: 'orange' | 'cream' }

const moments: Moment[] = [
  { key: 'study', time: '07:45', tone: 'orange' },
  { key: 'mountain', time: '10:00', img: '/images/community-triple360.jpg' },
  { key: 'slump', time: '15:00', img: '/images/about-nyc.jpg' },
  { key: 'pregame', time: '18:00', img: '/images/community-padel.jpg' },
  { key: 'going', time: '20:30', img: '/images/community-frontflip.jpg' },
  { key: 'late', time: '02:00', tone: 'cream' },
]

const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function DayTimeline() {
  const { t } = useTranslation()
  const track = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number } | null>(null)

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('article')
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 20), behavior: 'smooth' })
  }

  // Mouse drag-to-scroll; touch devices already swipe natively.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !track.current) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft }
    track.current.style.scrollSnapType = 'none'
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !track.current) return
    track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x)
  }
  const endDrag = () => {
    if (!drag.current || !track.current) return
    drag.current = null
    track.current.style.scrollSnapType = ''
  }

  return (
    <section className="bg-brown text-off-white py-20 lg:py-28">
      <div className="page-container flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-caforange">{t('day.eyebrow')}</p>
          <h2 className="mt-3 font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9]">{t('day.title')}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scrollBy(-1)} aria-label={t('day.prev')} className="w-12 h-12 grid place-items-center border border-off-white/30 hover:bg-caforange hover:border-caforange transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scrollBy(1)} aria-label={t('day.next')} className="w-12 h-12 grid place-items-center border border-off-white/30 hover:bg-caforange hover:border-caforange transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="page-container mt-10 flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
      >
        {moments.map((m, i) => {
          const photo = Boolean(m.img)
          const bg = m.tone === 'orange' ? 'bg-caforange text-brown' : m.tone === 'cream' ? 'bg-off-white text-brown' : 'text-off-white'
          return (
            <motion.article
              key={m.key}
              className={`relative shrink-0 snap-start w-[78vw] max-w-[360px] aspect-[3/4] overflow-hidden flex flex-col justify-end p-6 ${bg}`}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.08, ease }}
            >
              {photo && (
                <>
                  <img src={m.img} alt="" draggable={false} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brown/90" />
                </>
              )}
              <div className="relative">
                <span className={`block font-display leading-none ${photo ? 'text-6xl' : 'text-8xl'}`}>{m.time}</span>
                <h3 className="mt-2 font-display uppercase text-2xl leading-none">{t(`day.moments.${m.key}.title`)}</h3>
                <p className={`mt-3 text-[15px] leading-relaxed ${photo ? 'text-off-white/85' : 'opacity-80'}`}>{t(`day.moments.${m.key}.body`)}</p>
              </div>
            </motion.article>
          )
        })}
        <div className="shrink-0 w-px" aria-hidden="true" />
      </div>
    </section>
  )
}
