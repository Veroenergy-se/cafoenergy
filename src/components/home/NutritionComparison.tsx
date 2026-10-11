import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

const rows: { key: string; moar: string; bar: string; energy: string; coffee: string }[] = [
  { key: 'caffeine', moar: '90mg', bar: '0mg',  energy: '180mg', coffee: '95mg' },
  { key: 'protein',  moar: '14g',  bar: '20g',  energy: '0g',    coffee: '0g' },
  { key: 'sugar',    moar: '2g',   bar: '1.5g', energy: '27g',   coffee: '0g' },
  { key: 'carbs',    moar: '21g',  bar: '15g',  energy: '28g',   coffee: '0g' },
  { key: 'fiber',    moar: '2.6g', bar: '3.1g', energy: '0g',    coffee: '0g' },
]

const others = ['bar', 'energy', 'coffee'] as const

// The full nutrition declaration (spec sheet, per 100 g; per bar = 55 g).
type Fact = { key: string; bar: number; per100: number; dec: number; unit: string; sub?: boolean; hero?: boolean }
const facts: Fact[] = [
  { key: 'caffeine', bar: 90, per100: 165, dec: 0, unit: 'mg', hero: true },
  { key: 'protein', bar: 14.3, per100: 26, dec: 1, unit: 'g', hero: true },
  { key: 'energy', bar: 223, per100: 406, dec: 0, unit: 'kcal', sub: true },
  { key: 'sugars', bar: 2.0, per100: 3.6, dec: 1, unit: 'g', sub: true },
  { key: 'fibre', bar: 2.6, per100: 4.8, dec: 1, unit: 'g' },
  { key: 'fat', bar: 9.9, per100: 18, dec: 1, unit: 'g', sub: true },
  { key: 'salt', bar: 0.31, per100: 0.57, dec: 2, unit: 'g' },
  { key: 'weight', bar: 55, per100: 100, dec: 0, unit: 'g', sub: true },
]

function WholeLabel() {
  const { t, i18n } = useTranslation()
  const reduce = useReducedMotion()
  const locale = i18n.language === 'sv' ? 'sv-SE' : 'en-GB'
  const [mode, setMode] = useState<'bar' | 'per100'>('bar')
  const [k, setK] = useState(1) // 0→1 count-up progress
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  // Count up the first time the grid scrolls in, and again whenever the toggle changes.
  useEffect(() => {
    if (!inView || reduce) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 900)
      setK(1 - Math.pow(1 - p, 3))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, mode, reduce])

  const fmt = (v: number, dec: number) => v.toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec })

  return (
    <div className="mt-20 lg:mt-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('label.eyebrow')}</p>
          <h3 className="mt-3 font-display uppercase text-4xl sm:text-5xl lg:text-6xl leading-[0.9]">{t('label.title')}</h3>
        </div>
        <div role="group" aria-label={t('label.toggle')} className="inline-flex rounded-full border-2 border-fg p-[3px]">
          {(['bar', 'per100'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${mode === m ? 'bg-fg text-tone' : ''}`}
            >
              {t(`label.${m}`)}
            </button>
          ))}
        </div>
      </div>

      <div ref={ref} className="mt-10 grid grid-cols-2 md:grid-cols-4 border-t-2 border-fg">
        {facts.map((f) => {
          const v = (mode === 'bar' ? f.bar : f.per100) * (reduce || !inView ? 1 : k)
          return (
            <div key={f.key} className="py-5 pr-4 border-b border-fg/15">
              <div className={`font-display leading-[0.9] text-[clamp(2.8rem,5.5vw,5.5rem)] tabular-nums ${f.hero ? 'text-accent' : ''}`}>
                {fmt(v, f.dec)}<span className="text-[0.42em] ml-0.5">{f.unit}</span>
              </div>
              <div className="mt-1.5 font-accent text-xs uppercase tracking-[0.14em] font-semibold text-fg/65">{t(`label.facts.${f.key}`)}</div>
              {f.sub && <div className="text-xs text-fg/55 mt-0.5">{t(`label.subs.${f.key}.${mode}`)}</div>}
            </div>
          )
        })}
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {(['gluten', 'gmo', 'sugar', 'allergens'] as const).map((c) => (
          <span key={c} className="rounded-full border border-fg/30 px-3.5 py-1.5 text-[13px] font-semibold">{t(`label.chips.${c}`)}</span>
        ))}
        <span className="rounded-full bg-fg/10 px-3.5 py-1.5 text-[13px] font-semibold">{t('label.chips.warning')}</span>
      </div>

      <details className="group mt-7 max-w-4xl border-t border-fg/15 pt-4">
        <summary className="cursor-pointer list-none font-semibold">
          {t('label.ingredientsTitle')} <span className="text-accent group-open:hidden">+</span><span className="text-accent hidden group-open:inline">−</span>
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-fg/75">{t('label.ingredients')}</p>
      </details>
    </div>
  )
}

// One table row whose cells fade and rise with the scroll position: row i appears
// a little after row i-1, so they come in one by one as you scroll down. Driven by
// scroll position rather than "in view" detection, so it behaves the same in every
// browser, and the cells (not the <tr>) move because Safari ignores transforms on rows.
function CompareRow({ row, index, last, progress }: { row: (typeof rows)[number]; index: number; last: boolean; progress: MotionValue<number> }) {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const start = index * 0.13
  const opacity = useTransform(progress, [start, start + 0.22], reduce ? [1, 1] : [0, 1])
  const y = useTransform(progress, [start, start + 0.22], reduce ? [0, 0] : [16, 0])
  const style = { opacity, y }
  return (
    <tr>
      <motion.th style={style} scope="row" className="py-4 sm:py-5 pr-2 border-t border-fg/15 font-accent font-semibold text-[10px] sm:text-sm uppercase tracking-[0.08em] sm:tracking-[0.12em] text-fg/70">
        {t(`nutrition.rows.${row.key}`)}
      </motion.th>
      <td className={`bg-caforange text-brown border-t border-brown/15 text-center ${last ? 'rounded-b-2xl' : ''}`}>
        <motion.div style={style} className="py-4 sm:py-5 font-display text-[1.7rem] sm:text-4xl leading-none">
          {row.moar}
        </motion.div>
      </td>
      {others.map((c) => (
        <motion.td key={c} style={style} className="py-4 sm:py-5 border-t border-fg/15 text-center font-accent font-semibold text-sm sm:text-xl text-fg/60 tabular-nums">
          {row[c]}
        </motion.td>
      ))}
    </tr>
  )
}

export default function NutritionComparison() {
  const { t } = useTranslation()
  const tableRef = useRef<HTMLTableElement>(null)
  // 0 when the table's top reaches 90% down the screen, 1 when its bottom is at 60%.
  const { scrollYProgress } = useScroll({ target: tableRef, offset: ['start 0.9', 'end 0.6'] })

  return (
    <section data-tone="brown" className="text-fg py-20 lg:py-28">
      <div className="page-container">
        <div className="max-w-5xl mx-auto">
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('nutrition.eyebrow')}</p>
          <h2 className="mt-3 font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9]">{t('nutrition.winsTitle')}</h2>

          <div className="mt-10 lg:mt-14 overflow-x-clip">
            <table ref={tableRef} className="w-full min-w-[288px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th scope="col" className="w-[22%] pb-4 align-bottom" aria-label={t('nutrition.whatsInside')} />
                  <th scope="col" className="w-[21%] bg-caforange text-brown rounded-t-2xl px-1 sm:px-3 pt-5 pb-4 text-center align-bottom">
                    <span className="block font-display uppercase text-2xl sm:text-3xl leading-none">MOAR</span>
                    <span className="mt-1 block font-accent text-[10px] sm:text-xs font-normal opacity-80">{t('nutrition.per.moar')}</span>
                  </th>
                  {others.map((c) => (
                    <th key={c} scope="col" className="w-[19%] px-1 sm:px-3 pb-4 text-center align-bottom">
                      <span className="block font-accent font-semibold text-[10px] sm:text-sm uppercase tracking-[0.06em] sm:tracking-[0.12em] leading-tight">{t(`nutrition.vs.${c}`)}</span>
                      <span className="mt-1 block font-accent text-[9px] sm:text-xs font-normal text-fg/50 leading-tight">{t(`nutrition.per.${c}`)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <CompareRow key={row.key} row={row} index={i} last={i === rows.length - 1} progress={scrollYProgress} />
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-fg/45 max-w-2xl">{t('nutrition.footnote')}</p>

          <WholeLabel />
        </div>
      </div>
    </section>
  )
}
