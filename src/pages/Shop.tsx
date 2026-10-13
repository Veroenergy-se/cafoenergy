import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from 'framer-motion'
import { useCart } from '@/providers/CartProvider'
import { products, getCurrency, formatPrice, getSubscriptionPrice, BOX_PRICE } from '@/lib/products'
import { SITE } from '@/lib/constants'
import { WholeLabel } from '@/components/home/NutritionComparison'

type Mode = 'subscription' | 'onetime'
type Boxes = 1 | 2 | 3

const BOX_OPTIONS: Boxes[] = [1, 2, 3]
const ONE_TIME_IDS: Record<Boxes, string> = { 1: 'starter', 2: 'duo', 3: 'family' }
const LAUNCH = new Date('2026-11-15T00:00:00+01:00')

// What a choice costs, and what it would cost without the discount.
function quote(mode: Mode, boxes: Boxes, currency: 'usd' | 'sek') {
  if (mode === 'subscription') {
    const full = BOX_PRICE[currency] * boxes
    const price = getSubscriptionPrice(full, boxes)
    return { price, full, saved: full - price }
  }
  const product = products.find((p) => p.id === ONE_TIME_IDS[boxes])!
  const price = product.price[currency]
  const full = product.originalPrice?.[currency] ?? price
  return { price, full, saved: full - price }
}

// Counts a number to its new value instead of jumping.
function useCountUp(target: number) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (reduce) { setShown(target); return }
    const start = from.current
    const t0 = performance.now()
    let raf = 0
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 500)
      const v = Math.round(start + (target - start) * (1 - Math.pow(1 - k, 3)))
      from.current = v
      setShown(v)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, reduce])
  return shown
}

// The next four delivery days: the 15th of each month, starting at launch.
function deliveryDates(locale: string) {
  const now = new Date()
  let d = LAUNCH > now ? new Date(2026, 10, 15, 12) : new Date(now.getFullYear(), now.getMonth() + (now.getDate() > 15 ? 1 : 0), 15, 12)
  const out: string[] = []
  for (let i = 0; i < 4; i++) {
    out.push(d.toLocaleDateString(locale, { day: 'numeric', month: 'short' }).replace('.', ''))
    d = new Date(d.getFullYear(), d.getMonth() + 1, 15, 12)
  }
  return out
}

export default function Shop() {
  const { t, i18n } = useTranslation()
  const currency = getCurrency(i18n.language)
  const locale = i18n.language === 'sv' ? 'sv-SE' : 'en-GB'
  const [mode, setMode] = useState<Mode>('subscription')
  const [boxes, setBoxes] = useState<Boxes>(2)
  const builderRef = useRef<HTMLElement>(null)

  // The builder's colour follows the mode; nudge the page colour to update without a scroll.
  useEffect(() => { window.dispatchEvent(new Event('scroll')) }, [mode])

  return (
    <>
      <Helmet>
        <title>{t('shop.metaTitle')}</title>
        <meta name="description" content={t('shop.metaDescription')} />
      </Helmet>

      <ShopHero />
      <BoxBuilder ref={builderRef} mode={mode} setMode={setMode} boxes={boxes} setBoxes={setBoxes} currency={currency} locale={locale} />
      <section data-tone="brown" className="text-fg py-20 lg:py-28">
        <div className="page-container">
          <WholeLabel className="" />
        </div>
      </section>
      <BuyingQuestions />
      <BuyBar builderRef={builderRef} mode={mode} boxes={boxes} currency={currency} />
    </>
  )
}

function ShopHero() {
  const { t } = useTranslation()
  const ticker = t('shopPage.ticker', { returnObjects: true }) as string[]
  const line = ticker.map((x) => `${x}  ■  `).join('')
  return (
    <section data-tone="cream" className="text-fg pt-28 sm:pt-32 overflow-hidden">
      <div className="page-container">
        <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('shopPage.eyebrow')}</p>
        <h1 className="mt-4 font-display uppercase leading-[0.95] text-[clamp(1.55rem,5vw,4.4rem)] break-words max-w-[18ch]">
          {t('shopPage.titleA')} <span className="text-accent">{t('shopPage.titleB')}</span>
        </h1>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-fg/80">{t('shopPage.lede')}</p>
      </div>
      <div className="mt-10 border-y-2 border-fg overflow-hidden" aria-hidden="true">
        <div className="flex w-max will-change-transform motion-safe:animate-[moar-tick_30s_linear_infinite]">
          {[0, 1].map((i) => (
            <span key={i} className="whitespace-pre py-3.5 font-display uppercase text-sm sm:text-base">{line}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---- The bar pile: one bar stuck in the top of a heap that grows 12 → 24 → 36 ----

// Each bar keeps a fixed random spot and tilt (seeded, so it's the same on every visit).
const PILE = (() => {
  let seed = 7
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  return Array.from({ length: 36 }, () => ({
    u: rnd() * 2 - 1,
    v: rnd(),
    rot: (rnd() < 0.5 ? 90 : -90) + (rnd() * 80 - 40),
    depth: rnd(),
  }))
})()

function BarPile({ boxes }: { boxes: Boxes }) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  const n = boxes * 12
  const len = Math.min(112, width / 5.2)
  const thick = len * 0.36
  const R = Math.min(width * 0.42, len * Math.sqrt(n * 0.12)) // half-width of the mound
  const H = R * 0.8 // its height
  // Spread the visible bars evenly left to right (in their random order) so the heap is balanced.
  const rank: number[] = []
  PILE.slice(0, n).map((b, i) => [b.u, i] as const).sort((a, b) => a[0] - b[0]).forEach(([, i], r) => { rank[i] = r })
  const summitW = Math.min(84, width / 6)

  return (
    <div ref={ref} className="absolute inset-x-0 top-0 bottom-6">
      {width > 0 && PILE.map((bar, i) => {
        const on = i < n
        const tt = on ? ((rank[i] + 0.5) / n) * 2 - 1 + (bar.depth - 0.5) * (2 / n) : 0
        const x = on ? Math.sign(tt) * Math.pow(Math.abs(tt), 1.15) * R : bar.u * R
        const y = on ? Math.pow(bar.v, 0.55) * H * (1 - Math.pow(x / R, 2)) - len * 0.12 : -width
        return (
          <img
            key={i}
            src="/images/moar-wrapper.png"
            alt=""
            className="absolute left-1/2 bottom-0 drop-shadow-[0_6px_6px_rgba(45,29,23,0.35)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(.3,1.25,.5,1)]"
            style={{
              width: thick,
              zIndex: 10 + Math.round(bar.depth * 20),
              opacity: on ? 1 : 0,
              transitionDelay: on ? `${(i % 12) * 35}ms` : '0ms',
              transform: `translate(calc(-50% + ${x}px), ${on ? -y : y}px) rotate(${on ? bar.rot : bar.rot * 2}deg)`,
            }}
          />
        )
      })}
      {width > 0 && (
        <img
          src="/images/moar-wrapper.png"
          alt=""
          className="absolute left-1/2 bottom-0 z-40 drop-shadow-[0_18px_18px_rgba(45,29,23,0.45)] transition-transform duration-700 ease-[cubic-bezier(.3,1.25,.5,1)]"
          style={{ width: summitW, transform: `translate(-50%, ${-H * 0.62}px) rotate(-10deg)` }}
        />
      )}
    </div>
  )
}

interface BuilderProps {
  mode: Mode
  setMode: (m: Mode) => void
  boxes: Boxes
  setBoxes: (b: Boxes) => void
  currency: 'usd' | 'sek'
  locale: string
  ref: React.Ref<HTMLElement>
}

function BoxBuilder({ mode, setMode, boxes, setBoxes, currency, locale, ref }: BuilderProps) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const sub = mode === 'subscription'
  const q = quote(mode, boxes, currency)
  const shown = useCountUp(q.price)
  const [gift, setGift] = useState(false)
  const [giftName, setGiftName] = useState('')
  const [giftMsg, setGiftMsg] = useState('')
  const [planOpen, setPlanOpen] = useState(false)
  const preorder = Date.now() < LAUNCH.getTime()
  const fmtPer = (v: number) => `${v.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kr`
  const perks = t(sub ? 'shopPage.perksSub' : 'shopPage.perksOne', { returnObjects: true }) as string[]
  const paceOpts = t('shopPage.paceOpts', { returnObjects: true }) as string[]
  const threshold = SITE.freeShippingThreshold[currency]

  // Nudge to the next size: what it costs extra and what each bar drops to.
  const next = boxes < 3 ? ((boxes + 1) as Boxes) : null
  const nextQ = next ? quote(mode, next, currency) : null

  const buy = () => {
    if (sub) { setPlanOpen(true); return }
    addItem(ONE_TIME_IDS[boxes], false, undefined, gift && (giftName || giftMsg) ? { name: giftName, message: giftMsg } : undefined)
  }

  const cta = preorder
    ? t(sub ? 'shopPage.preCtaSub' : 'shopPage.preCtaOne', { price: formatPrice(q.price, currency) })
    : t(sub ? 'shopPage.ctaSub' : 'shopPage.ctaOne', { price: formatPrice(q.price, currency) })

  return (
    <section ref={ref} id="builder" data-tone={sub ? 'brown' : 'cream'} className="text-fg py-12 lg:py-20 scroll-mt-16">
      <div className="page-container grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* The pile grows with the number of boxes. */}
        <div className="relative bg-caforange overflow-hidden h-[340px] sm:h-[420px] lg:sticky lg:top-20 lg:self-start lg:h-[min(620px,calc(100vh-110px))]" aria-hidden="true">
          <BarPile boxes={boxes} />
          <p className="absolute z-50 left-5 top-4 font-display text-brown leading-[0.8] text-[clamp(3rem,7vw,6rem)]">
            {boxes * 12}<span className="text-[0.26em]"> {t('shopPage.barsWord')}</span>
          </p>
          {boxes === 2 && (
            <span className="absolute z-50 top-4 right-4 bg-brown text-off-white px-3 py-2 font-accent text-[11px] uppercase tracking-[0.14em] font-semibold">
              {t('shopPage.mostPopular')}
            </span>
          )}
        </div>

        <div className="border-2 border-fg/15 border-t-0 lg:border-t-2 lg:border-l-0 p-5 sm:p-10 grid gap-5 content-start">
          {/* Subscribe / one-time switch */}
          <div role="group" aria-label={t('shop.monthlySubscription')} className="relative grid grid-cols-2 border-2 border-fg">
            <span
              className={`absolute inset-y-0 left-0 w-1/2 bg-caforange transition-transform duration-500 ease-out ${sub ? '' : 'translate-x-full'}`}
              aria-hidden="true"
            />
            {(['subscription', 'onetime'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`relative z-10 py-3.5 px-2 grid gap-1 justify-items-center font-accent text-xs uppercase tracking-[0.12em] font-semibold transition-colors ${mode === m ? 'text-white' : ''}`}
              >
                {t(m === 'subscription' ? 'shopPage.modeSub' : 'shopPage.modeOne')}
                <span className="text-[10px] tracking-[0.06em] opacity-80 font-medium">
                  {t(m === 'subscription' ? 'shopPage.modeSubNote' : 'shopPage.modeOneNote')}
                </span>
              </button>
            ))}
          </div>

          {/* Pace picker: answers "how many do I need?" */}
          <div className="grid gap-2">
            <p className="font-accent text-[11px] uppercase tracking-[0.14em] font-semibold text-fg/75">{t('shopPage.paceQ')}</p>
            <div className="flex flex-wrap gap-1.5">
              {BOX_OPTIONS.map((b, i) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={boxes === b}
                  onClick={() => setBoxes(b)}
                  className={`rounded-full border-[1.5px] px-3.5 py-2 text-sm font-semibold transition-colors ${boxes === b ? 'bg-caforange border-caforange text-white' : 'border-fg/35 hover:border-fg'}`}
                >
                  {paceOpts[i]}
                </button>
              ))}
            </div>
          </div>

          <h2 className="font-display uppercase leading-[0.95] text-2xl sm:text-3xl">{t(sub ? 'shopPage.qSub' : 'shopPage.qOne')}</h2>

          <div className="grid grid-cols-3 gap-2">
            {BOX_OPTIONS.map((b) => {
              const qb = quote(mode, b, currency)
              return (
                <button
                  key={b}
                  type="button"
                  aria-pressed={boxes === b}
                  onClick={() => setBoxes(b)}
                  className={`relative text-left grid gap-1.5 px-2.5 sm:px-3 pt-4 pb-3 border-2 transition-colors ${boxes === b ? 'border-caforange bg-caforange/15' : 'border-fg/20 hover:border-fg/50'}`}
                >
                  {b === 2 && (
                    <span className="absolute -top-2.5 left-2 bg-caforange text-white px-1.5 py-1 font-accent text-[9px] uppercase tracking-[0.12em] font-semibold leading-none">
                      {t('shopPage.mostPopular')}
                    </span>
                  )}
                  <span className="font-display text-sm sm:text-lg leading-none">{t('shopPage.box', { count: b })}</span>
                  <span className="text-xs text-fg/70">{t(sub ? 'shopPage.barsMonth' : 'shopPage.barsCount', { count: b * 12 })}</span>
                  <span className="min-h-[10px] font-accent text-[10px] uppercase tracking-[0.1em] font-semibold text-caforange">
                    {qb.saved > 0 ? t('shopPage.saveKr', { amount: formatPrice(qb.saved, currency) }) : ''}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="grid gap-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-display leading-[0.9] text-[clamp(2.5rem,5vw,3.8rem)] tabular-nums">{formatPrice(shown, currency)}</span>
              {q.saved > 0 && <s className="text-fg/45">{formatPrice(q.full, currency)}</s>}
            </div>
            {q.saved > 0 && (
              <span className="justify-self-start bg-caforange text-white px-2.5 py-2 font-accent text-xs uppercase tracking-[0.1em] font-semibold">
                {t(sub ? 'shopPage.youSaveMonth' : 'shopPage.youSave', { amount: formatPrice(q.saved, currency) })}
              </span>
            )}
            <span className="text-sm text-fg/75">{t('shopPage.perBar', { price: fmtPer(q.price / (boxes * 12)) })}</span>
          </div>

          {next && nextQ && (
            <div className="border-[1.5px] border-dashed border-caforange px-3 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-sm">
              <span>
                <b>{t('shopPage.upsellExtra', { extra: formatPrice(nextQ.price - q.price, currency) })}</b>{' '}
                {t('shopPage.upsellText', { per: fmtPer(nextQ.price / (next * 12)) })}
              </span>
              <button
                type="button"
                onClick={() => setBoxes(next)}
                className="bg-caforange text-white px-2.5 py-2 font-accent text-[11px] uppercase tracking-[0.1em] font-semibold"
              >
                {t('shopPage.upsellBtn')}
              </button>
            </div>
          )}

          {!sub && (
            <div className="grid gap-1.5 text-sm">
              <span>{q.price >= threshold ? t('shopPage.shipFree') : t('shopPage.shipLeft', { threshold: formatPrice(threshold, currency) })}</span>
              <span className="relative h-2 bg-fg/15 overflow-hidden">
                <span className="absolute inset-y-0 left-0 bg-caforange transition-[width] duration-500" style={{ width: `${Math.min(100, (q.price / threshold) * 100)}%` }} />
              </span>
            </div>
          )}

          {!sub && (
            <div className="border-t-2 border-fg/15 pt-4 grid gap-2">
              <label className="flex items-center gap-2.5 font-accent text-xs uppercase tracking-[0.12em] font-semibold cursor-pointer">
                <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="w-4.5 h-4.5 accent-caforange" />
                {t('shopPage.giftToggle')}
              </label>
              {gift && (
                <div className="grid gap-2">
                  <input
                    id="gift-name"
                    value={giftName}
                    onChange={(e) => setGiftName(e.target.value)}
                    placeholder={t('shopPage.giftName')}
                    className="bg-transparent border-b-2 border-fg/40 py-2 focus:outline-none focus:border-caforange placeholder-fg/45"
                  />
                  <textarea
                    id="gift-message"
                    rows={2}
                    value={giftMsg}
                    onChange={(e) => setGiftMsg(e.target.value)}
                    placeholder={t('shopPage.giftMessage')}
                    className="bg-transparent border-b-2 border-fg/40 py-2 resize-none focus:outline-none focus:border-caforange placeholder-fg/45"
                  />
                </div>
              )}
            </div>
          )}

          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-caforange shrink-0" />{p}</li>
            ))}
          </ul>

          <button
            type="button"
            onClick={buy}
            className="bg-caforange text-white py-5 px-3 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform"
          >
            {cta}
          </button>
          {preorder && (
            <p className="-mt-2 text-center font-accent text-[11px] uppercase tracking-[0.14em] font-semibold text-caforange">
              {t('shopPage.preLine', { date: t('shopPage.launchDate') })}
            </p>
          )}
        </div>
      </div>

      <PlanSheet open={planOpen} onClose={() => setPlanOpen(false)} boxes={boxes} currency={currency} locale={locale} />
    </section>
  )
}

// Opens from the subscribe button: the next four deliveries, each one adjustable.
function PlanSheet({ open, onClose, boxes, currency, locale }: { open: boolean; onClose: () => void; boxes: Boxes; currency: 'usd' | 'sek'; locale: string }) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const dates = deliveryDates(locale)
  // 0 = as planned, 1 = one extra box, 2 = skipped
  const [states, setStates] = useState([0, 0, 0, 0])
  const closeRef = useRef<HTMLButtonElement>(null)
  const price = quote('subscription', boxes, currency).price

  useEffect(() => {
    if (!open) return
    setStates([0, 0, 0, 0])
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  const cycle = (i: number) => setStates((s) => s.map((v, j) => (j === i ? (v + 1) % 3 : v)))
  const plan = states.map((s) => (s === 2 ? 0 : boxes + (s === 1 ? 1 : 0)))

  const confirm = () => {
    addItem('starter', true, plan)
    onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-[rgba(20,12,9,0.55)] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-title"
        aria-hidden={!open}
        className={`fixed z-[61] left-1/2 bottom-0 w-full max-w-[760px] max-h-[92vh] overflow-auto bg-brown text-off-white px-5 sm:px-8 pt-6 pb-[calc(24px+env(safe-area-inset-bottom,0px))] grid gap-4 transition-transform duration-500 ease-out ${open ? '-translate-x-1/2 translate-y-0' : '-translate-x-1/2 translate-y-[105%]'}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-accent text-[11px] uppercase tracking-[0.2em] font-semibold text-caforange">{t('shopPage.sheetEyebrow')}</p>
            <h3 id="plan-title" className="mt-2 font-display uppercase leading-none text-[clamp(1.3rem,3vw,2rem)]">{t('shopPage.delivTitle')}</h3>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={t('shopPage.close')} className="w-9 h-9 shrink-0 border-[1.5px] border-current text-lg leading-none">×</button>
        </div>
        <p className="text-sm text-off-white/80">{t('shopPage.sheetBody')}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {dates.map((d, i) => {
            const s = states[i]
            const first = i === 0
            const n = plan[i]
            return (
              <button
                key={d}
                type="button"
                disabled={first}
                onClick={() => cycle(i)}
                className={`text-left min-h-[140px] p-3.5 border-2 grid content-between gap-3 transition-opacity ${first ? 'border-caforange cursor-default' : 'border-off-white/30 hover:border-off-white/60'} ${s === 2 ? 'opacity-45' : ''}`}
              >
                <span>
                  <span className={`block font-display leading-none text-[clamp(1.1rem,2vw,1.5rem)] ${first ? 'text-caforange' : ''} ${s === 2 ? 'line-through' : ''}`}>{d}</span>
                  <span className="mt-1.5 block text-xs text-off-white/80">
                    {first && `${t('shopPage.firstBox')} · `}
                    {s === 2 ? t('shopPage.skipped') : `${t('shopPage.box', { count: n })} · ${t('shopPage.barsCount', { count: n * 12 })}`}
                  </span>
                </span>
                <span className="flex flex-wrap gap-1">
                  {first ? (
                    <Chip on>{t('shopPage.firstBox')}</Chip>
                  ) : (
                    <>
                      <Chip on={s === 0}>{t('shopPage.asPlanned')}</Chip>
                      <Chip on={s === 1}>{t('shopPage.plusOne')}</Chip>
                      <Chip on={s === 2}>{t('shopPage.skip')}</Chip>
                    </>
                  )}
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-off-white/20 pt-3.5 text-sm">
          <span>{t('shopPage.sheetSum', { boxes: t('shopPage.box', { count: boxes }), price: formatPrice(price, currency) })}</span>
          <span className="font-display text-2xl text-caforange">{formatPrice(price, currency)}</span>
        </div>
        <button
          type="button"
          onClick={confirm}
          className="bg-caforange text-white py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold"
        >
          {t('shopPage.sheetCta')}
        </button>
      </div>
    </>
  )
}

function Chip({ on, children }: { on?: boolean; children: React.ReactNode }) {
  return (
    <span className={`border-[1.5px] border-current px-1.5 py-1.5 font-accent text-[9px] uppercase tracking-[0.08em] font-semibold leading-none ${on ? 'bg-off-white text-brown' : ''}`}>
      {children}
    </span>
  )
}

function BuyingQuestions() {
  const { t } = useTranslation()
  const faq = t('shopPage.faq', { returnObjects: true }) as { q: string; a: string }[]
  return (
    <section data-tone="cream" className="text-fg py-20 lg:py-28">
      <div className="page-container grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('shopPage.faqEyebrow')}</p>
          <h2 className="mt-3 font-display uppercase leading-[0.95] text-[clamp(2rem,4.4vw,3.6rem)]">{t('shopPage.faqTitle')}</h2>
          <Link to="/faq" className="mt-5 inline-block border-b-2 border-caforange pb-1 font-accent text-xs uppercase tracking-[0.14em] font-semibold">
            {t('shopPage.faqLink')} →
          </Link>
        </div>
        <div className="border-t-2 border-fg">
          {faq.map((f, i) => (
            <details key={f.q} open={i === 0} className="group border-b border-fg/25">
              <summary className="cursor-pointer list-none flex justify-between gap-4 py-5 font-display uppercase text-sm sm:text-lg leading-tight [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-caforange group-open:hidden">+</span>
                <span className="text-caforange hidden group-open:inline">−</span>
              </summary>
              <p className="pb-5 max-w-[60ch] text-fg/80">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// Slim bar with the current choice once the builder has scrolled away; tapping it goes back.
function BuyBar({ builderRef, mode, boxes, currency }: { builderRef: React.RefObject<HTMLElement | null>; mode: Mode; boxes: Boxes; currency: 'usd' | 'sek' }) {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const q = quote(mode, boxes, currency)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = builderRef.current
      if (!el) return
      const nearEnd = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 900
      setShow(el.getBoundingClientRect().bottom < 0 && !nearEnd)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [builderRef])

  return (
    <button
      type="button"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      onClick={() => builderRef.current?.scrollIntoView({ behavior: 'smooth' })}
      className={`fixed z-40 left-1/2 -translate-x-1/2 bottom-[calc(78px+env(safe-area-inset-bottom,0px))] sm:bottom-[calc(14px+env(safe-area-inset-bottom,0px))] w-[min(560px,calc(100%-24px))] bg-brown text-off-white flex items-center justify-between gap-3 pl-4 pr-2.5 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.3)] text-left transition-transform duration-500 ease-out ${show ? 'translate-y-0' : 'translate-y-[160%]'}`}
    >
      <span className="text-xs leading-snug">
        <span className="block font-display uppercase text-sm sm:text-base">{t('shopPage.box', { count: boxes })} · {formatPrice(q.price, currency)}</span>
        {t(mode === 'subscription' ? 'shopPage.buybarSub' : 'shopPage.buybarOne')}
        {q.saved > 0 && ` · ${t(mode === 'subscription' ? 'shopPage.youSaveMonth' : 'shopPage.youSave', { amount: formatPrice(q.saved, currency) }).toLowerCase()}`}
      </span>
      <span className="shrink-0 bg-caforange text-white px-3.5 py-3 font-accent text-[11px] uppercase tracking-[0.12em] font-semibold">{t('shopPage.review')}</span>
    </button>
  )
}
