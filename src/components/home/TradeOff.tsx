import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import MoarLogo from '@/components/shared/MoarLogo'

const ease = [0.25, 0.46, 0.45, 0.94] as const

// Where each category sits on the energy (x) × nutrition (y) map, in % from bottom-left.
const others: { key: string; x: number; y: number }[] = [
  { key: 'proteinBars', x: 25, y: 76 },
  { key: 'candy', x: 26, y: 22 },
  { key: 'coffee', x: 66, y: 36 },
  { key: 'energyDrinks', x: 74, y: 14 },
]

export default function TradeOff() {
  const { t } = useTranslation()
  const problems = ['nutrition', 'fades', 'taste'] as const

  return (
    <section className="bg-off-white text-brown pb-20 lg:pb-28 overflow-hidden">
      <div className="page-container border-t border-brown/15 pt-20 lg:pt-28">
        <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-caforange">
          {t('tradeoff.eyebrow')}
        </p>
        <h2 className="mt-3 max-w-4xl font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9] text-balance">
          {t('tradeoff.title')}
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {problems.map((p, i) => (
            <motion.div
              key={p}
              className="border-t-2 border-brown pt-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              <h3 className="font-display uppercase text-3xl leading-none">
                <span className="text-caforange">{t(`tradeoff.${p}.lead`)}</span> {t(`tradeoff.${p}.rest`)}
              </h3>
              <p className="mt-3 text-brown/70 leading-relaxed max-w-xs">{t(`tradeoff.${p}.body`)}</p>
            </motion.div>
          ))}
        </div>

        {/* The map */}
        <div className="mt-20 lg:mt-28 grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <h3 className="font-display uppercase text-4xl sm:text-5xl leading-[0.9] text-balance">
              {t('tradeoff.mapTitle')}
            </h3>
            <p className="mt-4 text-lg text-brown/70 max-w-md leading-relaxed">{t('tradeoff.mapBody')}</p>
          </div>

          <div className="relative pl-7 pb-7">
            {/* axis labels */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center whitespace-nowrap font-accent text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-brown/60 -translate-x-[45%]">
              {t('tradeoff.axisY')} ↑
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-accent text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-brown/60">
              {t('tradeoff.axisX')} →
            </span>

            <div className="relative aspect-[5/4] w-full border-l-2 border-b-2 border-brown">
              {/* quadrant dividers */}
              <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-brown/30" />
              <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-brown/30" />

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
                <motion.span
                  key={o.key}
                  className="absolute -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-full border border-brown/25 bg-off-white px-3 py-1.5 font-accent text-[11px] sm:text-sm font-semibold"
                  style={{ left: `${o.x}%`, bottom: `${o.y}%` }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease }}
                >
                  {t(`tradeoff.items.${o.key}`)}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
