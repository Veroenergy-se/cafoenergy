import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

// The science page: a short scroll story. Each section answers one question a
// curious buyer has, with numbers, and the page colours fade between sections.

const ease = [0.2, 0.8, 0.2, 1] as const

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{children}</p>
}

function Title({ a, b, className = '' }: { a: string; b: string; className?: string }) {
  return (
    <h2 className={`mt-4 font-display uppercase leading-[0.95] text-[clamp(2rem,5.2vw,4.6rem)] max-w-[18ch] text-balance ${className}`}>
      {a} <span className="text-accent">{b}</span>
    </h2>
  )
}

// Bars that grow to their width the first time their row scrolls into view.
// Plain CSS transitions: reliable with percentage widths inside flex rows.
function useSeen<T extends Element>() {
  const ref = useRef<T>(null)
  const seen = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  return [ref, seen || !!reduce] as const
}
const grow = (on: boolean, pct: number, delay: number, vertical = false): React.CSSProperties => ({
  [vertical ? 'height' : 'width']: on ? `${pct}%` : '0%',
  transition: `${vertical ? 'height' : 'width'} 1.2s cubic-bezier(.2,.8,.2,1) ${delay}s`,
})

function Grow({ pct, className, delay = 0 }: { pct: number; className: string; delay?: number }) {
  const [ref, on] = useSeen<HTMLElement>()
  return <i ref={ref} className={className} style={grow(on, pct, delay)} />
}

// ---------- 1 · Opening: the guarana fruit opens like an eye as you scroll ----------
function Opening() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const open = useTransform(scrollYProgress, [0, 0.8], reduce ? [1, 1] : [0.12, 1], { clamp: true })
  const leftRef = useRef<SVGPathElement>(null)
  const rightRef = useRef<SVGPathElement>(null)
  const shineRef = useRef<SVGPathElement>(null)
  const innerRef = useRef<SVGGElement>(null)
  // The two red halves rotate apart around the bottom of the fruit and the eye grows.
  const draw = (e: number) => {
    const l = `translate(${-e * 34} ${e * 6}) rotate(${-e * 22} 0 108)`
    leftRef.current?.setAttribute('transform', l)
    shineRef.current?.setAttribute('transform', l)
    rightRef.current?.setAttribute('transform', `translate(${e * 34} ${e * 6}) rotate(${e * 22} 0 108)`)
    innerRef.current?.setAttribute('transform', `scale(${0.82 + e * 0.18})`)
  }
  useMotionValueEvent(open, 'change', draw)

  return (
    <section ref={ref} data-tone="cream" className="text-fg relative h-[190vh]">
      <div className="sticky top-0 min-h-[100svh] flex items-center overflow-hidden pt-24 pb-10">
        <div className="page-container w-full grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center">
          <div>
            <Eyebrow>{t('science.open.eyebrow')}</Eyebrow>
            <h1 className="mt-4 font-display uppercase leading-[0.92] text-[clamp(2.4rem,7vw,6.4rem)]">
              {t('science.open.titleA')} <span className="text-accent">{t('science.open.titleB')}</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-fg/85">{t('science.open.body')}</p>
            <p className="mt-8 font-accent text-[11px] uppercase tracking-[0.2em] font-semibold text-fg/55">{t('science.open.scroll')} ↓</p>
          </div>
          <svg viewBox="0 0 400 400" role="img" aria-label={t('science.open.berryAlt')} className="w-full max-w-[340px] lg:max-w-[520px] justify-self-center">
            <path d="M200 40 C 205 80, 198 105, 200 128" stroke="#5a3a1e" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M204 70 C 250 40, 300 55, 318 80 C 280 95, 240 92, 204 70 Z" fill="#3f6b2a" />
            <g transform="translate(200 230)">
              <g ref={innerRef} transform={`scale(${0.82 + open.get() * 0.18})`}>
                <ellipse cx="0" cy="0" rx="72" ry="84" fill="#f4efe6" />
                <circle cx="0" cy="6" r="44" fill="#16100d" />
                <circle cx="-14" cy="-10" r="10" fill="#ffffff" opacity=".85" />
              </g>
              <path ref={leftRef} transform={`translate(${-open.get() * 34} ${open.get() * 6}) rotate(${-open.get() * 22} 0 108)`} d="M0 -100 C -70 -100, -105 -45, -105 10 C -105 70, -60 108, 0 108 Z" fill="#c8231c" />
              <path ref={rightRef} transform={`translate(${open.get() * 34} ${open.get() * 6}) rotate(${open.get() * 22} 0 108)`} d="M0 -100 C 70 -100, 105 -45, 105 10 C 105 70, 60 108, 0 108 Z" fill="#d9302a" />
              <path ref={shineRef} transform={`translate(${-open.get() * 34} ${open.get() * 6}) rotate(${-open.get() * 22} 0 108)`} d="M-40 -70 C -60 -50, -70 -20, -66 10" stroke="#ffffff" strokeOpacity=".25" strokeWidth="10" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}

// ---------- 2 · Why guarana ----------
function WhyGuarana() {
  const { t } = useTranslation()
  const items = t('science.guarana.items', { returnObjects: true }) as { stat: string; unit: string; title: string; body: string }[]
  return (
    <section data-tone="brown" className="text-fg py-24 lg:py-32">
      <div className="page-container">
        <Eyebrow>{t('science.guarana.eyebrow')}</Eyebrow>
        <Title a={t('science.guarana.titleA')} b={t('science.guarana.titleB')} />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              className="border-t-[3px] border-fg pt-5 grid gap-3 content-start"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease }}
            >
              <strong className="font-display leading-[0.85] text-[clamp(2.6rem,5vw,4.4rem)] text-accent">
                {it.stat}<small className="text-[0.32em]">{it.unit}</small>
              </strong>
              <b className="font-display uppercase text-base leading-tight">{it.title}</b>
              <p className="max-w-[36ch] text-fg/85">{it.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- 3 · Caffeine + protein: a coffee and a snack become one bar ----------
function Combo() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const mergeRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: mergeRef, offset: ['start end', 'start 0.3'] })
  const e = useTransform(scrollYProgress, (k) => (reduce ? 1 : k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2))
  const apart = useTransform(e, (v) => 1 - Math.min(1, v / 0.55)) // 1 = far apart, 0 = together
  const meet = useTransform(e, (v) => Math.max(0, (v - 0.55) / 0.45))
  const cupX = useTransform(apart, (a) => `calc(-50% - ${a * 34}vw)`)
  const snackX = useTransform(apart, (a) => `calc(-50% + ${a * 34}vw)`)
  const cupXlg = useTransform(apart, (a) => `calc(-50% - ${a * 380}px)`)
  const snackXlg = useTransform(apart, (a) => `calc(-50% + ${a * 380}px)`)
  const itemOpacity = useTransform([apart, meet] as MotionValue<number>[], ([a, m]: number[]) => Math.min(1, a / 0.45) * (1 - m))
  const labelOpacity = useTransform(apart, (a) => Math.min(1, a / 0.7))
  const itemScale = useTransform(meet, (m) => 1 - m * 0.4)
  const plusOpacity = useTransform(e, (v) => Math.max(0, 1 - v * 2.2))
  const moarOpacity = useTransform(meet, (m) => Math.min(1, m * 1.4))
  const moarScale = useTransform(meet, (m) => 0.6 + m * 0.4)
  const wide = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  const cols = t('science.combo.cols', { returnObjects: true }) as string[]
  const rows: [string, string, string, string][] = [
    [t('science.combo.rows.caffeine'), '~90 mg', '0 mg', '90 mg'],
    [t('science.combo.rows.protein'), '0 g', '~20 g', '14 g'],
    [t('science.combo.rows.sugar'), '0 g', '~2 g', '2 g'],
    [t('science.combo.rows.snack'), t('science.combo.no'), t('science.combo.yes'), t('science.combo.yes')],
  ]
  const val = (v: string) => {
    const m = v.match(/^(~?[\d.,]+)\s(\w+)$/)
    return m ? <>{m[1]}<small className="text-[0.45em] ml-0.5">{m[2]}</small></> : v
  }

  return (
    <section data-tone="orange" className="text-fg py-24 lg:py-32 overflow-hidden">
      <div className="page-container">
        <Eyebrow>{t('science.combo.eyebrow')}</Eyebrow>
        <h2 className="mt-4 font-display uppercase leading-[0.95] text-[clamp(2rem,5.2vw,4.6rem)] max-w-[18ch] text-balance">
          {t('science.combo.titleA')} <span className="text-off-white">{t('science.combo.titleB')}</span>
        </h2>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed">{t('science.combo.body')}</p>

        <div ref={mergeRef} className="relative h-[300px] lg:h-[340px] mt-12" aria-hidden="true">
          <motion.div className="absolute left-1/2 top-1/2 w-[34%] max-w-[260px] grid justify-items-center gap-3 text-center"
            style={{ x: wide ? cupXlg : cupX, y: '-50%', opacity: itemOpacity, scale: itemScale }}>
            <svg viewBox="0 0 200 200" className="w-full max-h-[200px]">
              <path d="M40 60 h110 l-12 110 a12 12 0 0 1 -12 10 h-62 a12 12 0 0 1 -12 -10 z" fill="#2d1d17" />
              <path d="M150 85 h14 a22 22 0 0 1 0 44 h-18" fill="none" stroke="#2d1d17" strokeWidth="12" />
              <rect x="34" y="50" width="122" height="16" rx="6" fill="#ede6dc" />
              <path d="M78 40 c-8 -14 8 -20 0 -34 M102 40 c-8 -14 8 -20 0 -34" stroke="#2d1d17" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".5" />
            </svg>
            <motion.b style={{ opacity: labelOpacity }} className="font-display uppercase text-[clamp(.9rem,1.8vw,1.3rem)] leading-tight">{t('science.combo.coffee')}</motion.b>
            <motion.span style={{ opacity: labelOpacity }} className="text-sm">{t('science.combo.coffeeSub')}</motion.span>
          </motion.div>
          <motion.span style={{ opacity: plusOpacity }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(3rem,7vw,6rem)] leading-none">+</motion.span>
          <motion.div className="absolute left-1/2 top-1/2 w-[34%] max-w-[260px] grid justify-items-center gap-3 text-center"
            style={{ x: wide ? snackXlg : snackX, y: '-50%', opacity: itemOpacity, scale: itemScale }}>
            <svg viewBox="0 0 200 200" className="w-full max-h-[200px]">
              <rect x="20" y="70" width="160" height="60" rx="10" fill="#ede6dc" />
              <rect x="20" y="70" width="160" height="60" rx="10" fill="none" stroke="#2d1d17" strokeWidth="6" />
              <path d="M20 82 l-12 -6 v48 l12 -6 M180 82 l12 -6 v48 l-12 -6" fill="#2d1d17" />
            </svg>
            <motion.b style={{ opacity: labelOpacity }} className="font-display uppercase text-[clamp(.9rem,1.8vw,1.3rem)] leading-tight">{t('science.combo.snack')}</motion.b>
            <motion.span style={{ opacity: labelOpacity }} className="text-sm">{t('science.combo.snackSub')}</motion.span>
          </motion.div>
          <motion.div className="absolute left-1/2 top-1/2 grid justify-items-center gap-3"
            style={{ x: '-50%', y: '-50%', opacity: moarOpacity, scale: moarScale }}>
            <img src="/images/moar-wrapper.png" alt="" className="h-[220px] lg:h-[260px] w-auto -rotate-12 drop-shadow-[0_26px_26px_rgba(45,29,23,0.35)]" />
            <b className="font-display uppercase text-off-white text-[clamp(.9rem,1.8vw,1.3rem)]">{t('science.combo.moar')}</b>
          </motion.div>
        </div>

        <div className="mt-16 lg:mt-20">
          <h3 className="font-display uppercase leading-none text-[clamp(1.4rem,3vw,2.4rem)] max-w-[22ch]">{t('science.combo.tableTitle')}</h3>
          <div role="table" className="mt-8 grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,1fr))] border-t-[3px] border-fg">
            <div role="row" className="contents">
              <span role="columnheader" className="py-4" />
              {cols.map((c, i) => (
                <span key={c} role="columnheader" className={`py-4 pr-1.5 font-display uppercase text-[clamp(.6rem,1.6vw,1.15rem)] leading-tight ${i === 2 ? 'text-off-white' : ''}`}>{c}</span>
              ))}
            </div>
            {rows.map(([k, ...vals]) => (
              <div role="row" key={k} className="contents">
                <span role="rowheader" className="py-4 pr-2 border-t border-fg/25 font-accent text-xs uppercase tracking-[0.12em] font-semibold">{k}</span>
                {vals.map((v, i) => (
                  <span key={i} role="cell" className={`py-4 pr-2 border-t border-fg/25 font-display tabular-nums whitespace-nowrap text-[clamp(1.05rem,2.8vw,2.4rem)] leading-none ${i === 2 ? 'text-off-white' : ''}`}>{val(v)}</span>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-[70ch] text-[13px] text-fg/75">{t('science.combo.note')}</p>
        </div>
      </div>
    </section>
  )
}

// ---------- 4 · Why 3 PM ----------
function WhyThreePM() {
  const { t } = useTranslation()
  const times = t('science.fit.times', { returnObjects: true }) as string[]
  const steps = [
    { time: times[0], mg: '90 mg', pct: 100 },
    { time: times[1], mg: '~52 mg', pct: 57 },
    { time: times[2], mg: '~30 mg', pct: 33 },
  ]
  return (
    <section data-tone="cream" className="text-fg py-24 lg:py-32">
      <div className="page-container">
        <Eyebrow>{t('science.fit.eyebrow')}</Eyebrow>
        <Title a={t('science.fit.titleA')} b={t('science.fit.titleB')} />
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-fg/85">{t('science.fit.body')}</p>
        <div className="mt-12 grid gap-4 max-w-[900px]">
          {steps.map((s, i) => (
            <div key={s.time} className="grid grid-cols-[62px_minmax(0,1fr)_72px] sm:grid-cols-[90px_minmax(0,1fr)_90px] gap-3 sm:gap-4 items-center">
              <b className="font-display text-[clamp(1.05rem,2.2vw,1.8rem)] leading-none">{s.time}</b>
              <span className="relative h-8 border-[3px] border-fg">
                <Grow pct={s.pct} delay={0.3 + i * 0.5} className="absolute inset-y-0 left-0 bg-accent" />
              </span>
              <em className="not-italic text-right font-display text-[clamp(.95rem,1.8vw,1.4rem)] leading-none">{s.mg}</em>
            </div>
          ))}
        </div>
        <p className="mt-9 max-w-[22ch] font-display uppercase leading-[1.05] text-[clamp(1.4rem,3vw,2.4rem)]">
          {t('science.fit.bigA')} <span className="text-accent">{t('science.fit.bigB')}</span>
        </p>
        <p className="mt-5 max-w-[70ch] text-[13px] text-fg/65">{t('science.fit.note')}</p>
      </div>
    </section>
  )
}

// ---------- 5 · The numbers behind our choices ----------
function Choices() {
  const { t } = useTranslation()
  const p = (k: string) => t(`science.choices.parts.${k}`)
  const stack = [
    { key: 'protein', g: '14.3 g', w: 26, cls: 'bg-accent text-brown' },
    { key: 'carbs', g: '19.5 g', w: 35.5, cls: 'bg-off-white text-brown' },
    { key: 'sugar', g: '2 g', w: 3.6, cls: 'bg-[#ff9a5c] text-brown' },
    { key: 'fat', g: '9.9 g', w: 18, cls: 'bg-[#8a5a3c] text-off-white' },
    { key: 'fibre', g: '', w: 4.7, cls: 'bg-[#c9b9a6] text-brown' },
    { key: 'other', g: '', w: 12.2, cls: 'text-fg' },
  ]
  const thresholds = t('science.choices.thresholds', { returnObjects: true }) as { badge: string; stat: string; unit: string; body: string }[]
  const fills = [65, 36, 80] // where MOAR sits on each rule; the EU line is drawn at 50%
  const picks = t('science.choices.picks', { returnObjects: true }) as { a: string; b: string; body: string }[]
  const [stackRef, stackOn] = useSeen<HTMLDivElement>()
  return (
    <section data-tone="brown" className="text-fg py-24 lg:py-32">
      <div className="page-container">
        <Eyebrow>{t('science.choices.eyebrow')}</Eyebrow>
        <Title a={t('science.choices.titleA')} b={t('science.choices.titleB')} />

        <div ref={stackRef} className="mt-14 flex h-[110px] sm:h-[92px] border-[3px] border-fg" role="img" aria-label={t('science.choices.stackLabel')}>
          {stack.map((s, i) => (
            <i
              key={s.key}
              className={`shrink-0 grid place-items-center overflow-hidden not-italic text-center font-accent text-[9px] sm:text-[11px] uppercase tracking-[0.04em] font-semibold leading-tight px-0.5 border-r-2 border-tone last:border-r-0 ${s.cls}`}
              style={grow(stackOn, s.w, i * 0.12)}
            >
              <span>{p(s.key)}{s.g && <><br />{s.g}</>}</span>
            </i>
          ))}
        </div>
        <div className="mt-2.5 flex justify-between font-accent text-xs uppercase tracking-[0.12em] font-semibold text-fg/75">
          <span>0 g</span><span>{t('science.choices.scaleEnd')}</span>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {thresholds.map((th, i) => (
            <div key={th.badge} className="border-[3px] border-fg p-5 sm:p-6 grid gap-3.5 content-start">
              <span className="justify-self-start bg-accent text-brown font-display uppercase text-[13px] px-2.5 py-2 leading-none">{th.badge}</span>
              <strong className="font-display leading-[0.85] text-[clamp(2.2rem,4vw,3.4rem)]">{th.stat}<small className="text-[0.32em] ml-1">{th.unit}</small></strong>
              <span className="relative h-3 bg-fg/15">
                <Grow pct={fills[i]} delay={i * 0.2} className="absolute inset-y-0 left-0 bg-accent" />
                <span className="absolute -top-1.5 -bottom-1.5 left-1/2 w-[3px] bg-fg" />
              </span>
              <p className="text-sm text-fg/85">{th.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-x-10 border-t-[3px] border-fg">
          {picks.map((pk) => (
            <div key={pk.a} className="py-5 border-b border-fg/25 grid gap-2">
              <b className="font-display uppercase leading-tight text-[clamp(1.1rem,2vw,1.5rem)]">{pk.a} <span className="text-accent">{pk.b}</span></b>
              <p className="max-w-[44ch] text-fg/85">{pk.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- 6 · How much is too much ----------
function HowMuch() {
  const { t } = useTranslation()
  const parts = [
    { cls: 'bg-fg', delay: 0 },
    { cls: 'bg-fg', delay: 0.35 },
    { cls: 'bg-off-white', delay: 0.7 },
  ]
  const [scaleRef, scaleOn] = useSeen<HTMLDivElement>()
  return (
    <section data-tone="orange" className="text-fg py-24 lg:py-32">
      <div className="page-container grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
        <div>
          <Eyebrow>{t('science.much.eyebrow')}</Eyebrow>
          <h2 className="mt-4 font-display uppercase leading-[0.95] text-[clamp(2rem,5.2vw,4.6rem)]">
            {t('science.much.titleA')} <span className="text-off-white">{t('science.much.titleB')}</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed">{t('science.much.body')}</p>
        </div>
        <div>
          <div className="flex items-center gap-5">
            <div><strong className="block font-display leading-[0.9] text-[clamp(2.4rem,5vw,4.4rem)]">1</strong><span className="font-accent text-xs uppercase tracking-[0.14em] font-semibold">{t('science.much.bar')}</span></div>
            <span className="font-display text-off-white text-[clamp(2rem,4vw,3.4rem)] leading-none">≈</span>
            <div><strong className="block font-display leading-[0.9] text-[clamp(2.4rem,5vw,4.4rem)]">1</strong><span className="font-accent text-xs uppercase tracking-[0.14em] font-semibold">{t('science.much.cup')}</span></div>
          </div>
          <div className="mt-10">
            <div ref={scaleRef} className="relative h-[54px] border-[3px] border-fg flex" role="img" aria-label={t('science.much.scaleLabel')}>
              {parts.map((pt, i) => (
                <i key={i} className={`block shrink-0 h-full border-r-[3px] border-tone ${pt.cls}`} style={grow(scaleOn, 22.5, pt.delay)} />
              ))}
            </div>
            <div className="mt-2.5 flex justify-between font-accent text-xs uppercase tracking-[0.1em] font-semibold">
              <span>0</span><span>{t('science.much.scaleEnd')}</span>
            </div>
            <p className="mt-4 max-w-[52ch] text-[15px]">{t('science.much.caption')}</p>
            <p className="mt-2 text-[13px] text-fg/70">{t('science.much.fine')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- 7 · Questions ----------
function Asked() {
  const { t } = useTranslation()
  const items = t('science.asked.items', { returnObjects: true }) as { q: string; a: string }[]
  return (
    <section data-tone="brown" className="text-fg py-24 lg:py-32">
      <div className="page-container">
        <Eyebrow>{t('science.asked.eyebrow')}</Eyebrow>
        <h2 className="mt-4 font-display uppercase leading-[0.95] text-[clamp(2rem,5.2vw,4.6rem)]">{t('science.asked.title')}</h2>
        <div className="mt-12 border-t-[3px] border-fg">
          {items.map((it, i) => (
            <details key={it.q} open={i === 0} className="group border-b border-fg/25">
              <summary className="cursor-pointer list-none flex justify-between gap-4 py-5 font-display uppercase leading-tight text-[clamp(1rem,2.1vw,1.6rem)] [&::-webkit-details-marker]:hidden">
                {it.q}
                <span className="text-accent group-open:hidden">+</span>
                <span className="text-accent hidden group-open:inline">−</span>
              </summary>
              <p className="pb-6 max-w-[62ch] text-[17px] leading-relaxed text-fg/90">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- 8 · End ----------
function End() {
  const { t } = useTranslation()
  return (
    <section data-tone="cream" className="text-fg py-24 lg:py-32 text-center">
      <div className="page-container">
        <h2 className="font-display uppercase leading-[0.92] text-[clamp(2.4rem,7vw,6.4rem)]">
          {t('science.end.titleA')} <span className="text-accent">{t('science.end.titleB')}</span>
        </h2>
        <Link to="/shop" className="mt-9 inline-block bg-brown text-off-white px-7 py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform">
          {t('science.end.cta')} →
        </Link>
      </div>
    </section>
  )
}

export default function HowItWorks() {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t('science.metaTitle')}</title>
        <meta name="description" content={t('science.metaDescription')} />
      </Helmet>
      <Opening />
      <WhyGuarana />
      <Combo />
      <WhyThreePM />
      <Choices />
      <HowMuch />
      <Asked />
      <End />
    </>
  )
}
