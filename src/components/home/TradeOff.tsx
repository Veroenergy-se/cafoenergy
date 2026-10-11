import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import MoarLogo from '@/components/shared/MoarLogo'
import Highlight from '@/components/shared/Highlight'

const ease = [0.25, 0.46, 0.45, 0.94] as const

// Where each category sits on the energy (x) × nutrition (y) map, in % from bottom-left.
// Labels sit right of the dot, or left of it near the right edge.
const others: { key: string; x: number; y: number; left?: boolean }[] = [
  { key: 'proteinBars', x: 10, y: 74 },
  { key: 'candy', x: 12, y: 30 },
  { key: 'coffee', x: 64, y: 34 },
  { key: 'energyDrinks', x: 88, y: 10, left: true },
]

export default function TradeOff() {
  const { t } = useTranslation()
  const problems = ['nutrition', 'fades', 'taste'] as const

  return (
    <section data-tone="cream" className="text-fg py-20 lg:py-28 overflow-hidden">
      <div className="page-container">
        <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">
          {t('tradeoff.eyebrow')}
        </p>
        <h2 className="mt-3 max-w-4xl font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-balance">
          {t('tradeoff.title')}
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {problems.map((p, i) => (
            <motion.div
              key={p}
              className="border-t-2 border-fg pt-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              <h3 className="font-display uppercase text-3xl leading-none">
                <span className="text-accent">{t(`tradeoff.${p}.lead`)}</span> {t(`tradeoff.${p}.rest`)}
              </h3>
              <p className="mt-3 text-fg/70 leading-relaxed max-w-xs">{t(`tradeoff.${p}.body`)}</p>
            </motion.div>
          ))}
        </div>

        {/* The map */}
        <div className="mt-20 lg:mt-28 grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <h3 className="font-display uppercase text-4xl sm:text-5xl leading-[0.9] text-balance">
              <Highlight text={t('tradeoff.mapTitle')} />
            </h3>
            <p className="mt-4 text-lg text-fg/70 max-w-md leading-relaxed">{t('tradeoff.mapBody')}</p>
          </div>

          <div className="relative pl-7 pb-7">
            {/* axis labels */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center whitespace-nowrap font-accent text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-fg/60 -translate-x-[45%]">
              {t('tradeoff.axisY')} ↑
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-accent text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-fg/60">
              {t('tradeoff.axisX')} →
            </span>

            <div className="relative aspect-[5/4] w-full border-l-2 border-b-2 border-fg">
              {/* quadrant dividers */}
              <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-fg/30" />
              <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-fg/30" />

              {/* MOAR's corner */}
              <motion.div
                className="absolute right-0 top-0 w-1/2 h-1/2 bg-brown text-caforange flex flex-col items-center justify-center gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.6, ease }}
              >
                <MoarLogo className="w-[55%]" />
                <span className="font-accent text-[9px] sm:text-[11px] uppercase tracking-[0.16em] font-semibold text-off-white/80 text-center px-2">
                  {t('tradeoff.corner')}
                </span>
              </motion.div>

              {others.map((o, i) => (
                <motion.div
                  key={o.key}
                  className={`absolute flex items-center gap-2.5 translate-y-1/2 ${o.left ? 'flex-row-reverse -translate-x-[calc(100%-6px)]' : '-translate-x-[6px]'}`}
                  style={{ left: `${o.x}%`, bottom: `${o.y}%` }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.1, ease }}
                >
                  <span className="block w-3 h-3 shrink-0 rounded-full bg-fg ring-[6px] ring-fg/10" />
                  <span className="whitespace-nowrap font-display uppercase text-sm sm:text-xl leading-none text-fg/80">
                    {t(`tradeoff.items.${o.key}`)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
