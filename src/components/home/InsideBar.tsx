import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

// Each layer of the bar, top to bottom: how far it drifts when the bar opens (px)
// and how it is drawn. Percentages come from the product specification.
const layers = [
  { key: 'chocolate', dy: -140, top: '30%', height: '10%', style: 'linear-gradient(180deg,#7a4a30,#4e2f1f)' },
  { key: 'caramel', dy: -55, top: '40%', height: '11%', style: 'linear-gradient(180deg,#f6c06a,#d48a2c)' },
  { key: 'core', dy: 35, top: '51%', height: '17%', style: 'radial-gradient(circle,rgba(110,70,40,.5) 0 2px,transparent 3px) 0 0/26px 20px, radial-gradient(circle,rgba(255,245,230,.7) 0 1.5px,transparent 2.5px) 10px 8px/22px 18px, linear-gradient(180deg,#f0dcbc,#dcbd92)' },
  { key: 'base', dy: 125, top: '68%', height: '8%', style: 'linear-gradient(180deg,#6a412b,#46291b)' },
] as const

const sparks = [
  { left: '16%', top: '32%' }, { left: '42%', top: '62%' }, { left: '66%', top: '28%' }, { left: '84%', top: '60%' },
]

// Same weight, side by side: MOAR (spec sheet) vs Marabou Mjölkchoklad (ICA label,
// per 100 g: 58 g sugars, 4.7 g protein, 550 kcal), both scaled to 55 g.
const compare = [
  { key: 'sugar', moar: 2, choc: 32, unit: 'g' },
  { key: 'protein', moar: 14, choc: 2.6, unit: 'g' },
  { key: 'energy', moar: 223, choc: 303, unit: 'kcal' },
] as const

function ChocolateCompare() {
  const { t, i18n } = useTranslation()
  const fmt = (v: number) => v.toLocaleString(i18n.language === 'sv' ? 'sv-SE' : 'en-GB')
  return (
    <div className="mt-16 lg:mt-24 border-t-2 border-fg pt-8 grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div>
        <h3 className="font-display uppercase text-3xl sm:text-4xl leading-[0.9]">{t('inside.compare.title')}</h3>
        <p className="mt-3 max-w-sm text-fg/75">{t('inside.compare.body')}</p>
      </div>
      <div className="grid gap-5">
        {compare.map((c, i) => {
          const max = Math.max(c.moar, c.choc)
          return (
            <div key={c.key} className="grid grid-cols-[5.5rem_minmax(0,1fr)] sm:grid-cols-[7rem_minmax(0,1fr)] gap-x-4 gap-y-1.5 items-center">
              <span className="row-span-2 font-accent text-xs uppercase tracking-[0.14em] font-semibold">{t(`inside.compare.rows.${c.key}`)}</span>
              {([['moar', c.moar, 'bg-fg'], ['choc', c.choc, 'bg-fg/25']] as const).map(([who, v, fill]) => (
                <div key={who} className="flex items-center gap-3 min-w-0">
                  <div className="h-3 flex-1 min-w-0">
                    <motion.div
                      className={`h-full rounded-full ${fill}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(3, (v / max) * 100)}%` }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                  <span className={`w-24 sm:w-48 shrink-0 text-xs sm:text-sm leading-tight tabular-nums ${who === 'moar' ? 'font-semibold' : 'text-fg/70'}`}>
                    {fmt(v)} {c.unit} · {who === 'moar' ? 'MOAR' : t('inside.compare.choc')}
                  </span>
                </div>
              ))}
            </div>
          )
        })}
        <p className="text-xs text-fg/60">{t('inside.compare.source')}</p>
      </div>
    </div>
  )
}

function Layer({ open, dy, top, height, style, children }: { open: MotionValue<number>; dy: number; top: string; height: string; style: string; children?: React.ReactNode }) {
  const y = useTransform(open, (o) => o * dy)
  return (
    <motion.div
      className="absolute left-0 right-[44%] sm:right-[34%] rounded-xl shadow-[0_18px_30px_-12px_rgba(45,30,23,0.5)]"
      style={{ y, top, height, background: style }}
    >
      {children}
    </motion.div>
  )
}

function Tag({ open, dy, top, title, body, pct }: { open: MotionValue<number>; dy: number; top: string; title: string; body: string; pct?: string }) {
  const y = useTransform(open, (o) => o * dy)
  const opacity = useTransform(open, [0.15, 0.7], [0, 1])
  return (
    <motion.div className="absolute right-0 w-[40%] sm:w-[30%]" style={{ y, opacity, top }}>
      <span className="block font-display uppercase text-xl sm:text-2xl lg:text-3xl leading-none">{title}</span>
      <span className="mt-1 block text-[13px] lg:text-sm leading-snug text-fg/75">
        {pct && <span className="text-accent font-semibold">{pct} · </span>}
        {body}
      </span>
    </motion.div>
  )
}

export default function InsideBar() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // 0 while entering, fully open when centred on screen, closing again on the way out.
  const open = useTransform(scrollYProgress, (p) => {
    if (reduce) return 1
    const o = Math.min(1, Math.max(0, 1 - Math.abs(p - 0.5) * 2.2))
    return o * o * (3 - 2 * o)
  })
  const sparkOpacity = useTransform(open, [0.3, 1], [0, 1])

  return (
    <section data-tone="orange" className="text-fg py-20 lg:py-28 overflow-hidden">
      <div className="page-container grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-center">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold">{t('inside.eyebrow')}</p>
          <h2 className="mt-4 font-display uppercase leading-[0.88] text-[clamp(3.2rem,6.5vw,6.5rem)]">
            {t('inside.titleA')}<br />{t('inside.titleB')}
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed">{t('inside.lede')}</p>
        </div>

        <div ref={ref} className="relative h-[440px] sm:h-[540px]" role="img" aria-label={t('inside.alt')}>
          {layers.map((l) => (
            <Layer key={l.key} open={open} dy={l.dy} top={l.top} height={l.height} style={l.style}>
              {l.key === 'core' &&
                sparks.map((s, i) => (
                  <motion.i
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-[#fff6ea] shadow-[0_0_14px_4px_rgba(255,246,234,0.9)]"
                    style={{ left: s.left, top: s.top, opacity: sparkOpacity }}
                  />
                ))}
            </Layer>
          ))}
          {layers.map((l) => (
            <Tag
              key={l.key}
              open={open}
              dy={l.dy}
              top={`calc(${l.top} - 4px)`}
              title={t(`inside.layers.${l.key}.title`)}
              body={t(`inside.layers.${l.key}.body`)}
              pct={t(`inside.layers.${l.key}.pct`, { defaultValue: '' }) || undefined}
            />
          ))}
        </div>
      </div>
      <div className="page-container">
        <ChocolateCompare />
      </div>
    </section>
  )
}
