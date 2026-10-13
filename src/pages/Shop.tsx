import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useCart } from '@/providers/CartProvider'
import { products, getCurrency, formatPrice, getSubscriptionPrice, BOX_PRICE } from '@/lib/products'
import { WholeLabel } from '@/components/home/NutritionComparison'

type Mode = 'subscription' | 'onetime'
type Boxes = 1 | 2 | 3

const BOX_OPTIONS: Boxes[] = [1, 2, 3]
const ONE_TIME_IDS: Record<Boxes, string> = { 1: 'starter', 2: 'duo', 3: 'family' }
// Café coffee (~38 kr) + a snack (~30 kr): the afternoon MOAR replaces. An estimate, said so on the page.
const COFFEE_SNACK_SEK = 68

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
  const launch = new Date('2026-11-15T12:00:00')
  const now = new Date()
  let d = launch > now ? launch : new Date(now.getFullYear(), now.getMonth() + (now.getDate() > 15 ? 1 : 0), 15, 12)
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
      <BoxBuilder ref={builderRef} mode={mode} setMode={setMode} boxes={boxes} setBoxes={setBoxes} currency={currency} />
      <Deliveries boxes={boxes} locale={locale} />
      <PricePerBar currency={currency} locale={locale} />
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
      <div className="page-container grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('shopPage.eyebrow')}</p>
          <h1 className="mt-4 font-display uppercase leading-[0.95] text-[clamp(1.55rem,5vw,4.4rem)] break-words">
            {t('shopPage.titleA')} <span className="text-accent">{t('shopPage.titleB')}</span>
          </h1>
          <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-fg/80">{t('shopPage.lede')}</p>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-square bg-caforange overflow-hidden grid place-items-center">
          <span className="absolute z-10 top-4 left-4 bg-brown text-off-white px-3 py-2.5 font-accent text-[11px] uppercase tracking-[0.14em] font-semibold leading-tight">
            {t('shopPage.stampTop')}
            <span className="block font-display text-2xl text-caforange tracking-normal">{t('shopPage.stampDate')}</span>
          </span>
          <img
            src="/images/moar-wrapper.png"
            alt={t('twoInOne.alt')}
            className="w-[34%] drop-shadow-[0_30px_30px_rgba(45,29,23,0.45)] motion-safe:animate-[moar-float_6s_ease-in-out_infinite] -rotate-12"
          />
        </div>
      </div>
      <div className="mt-14 border-y-2 border-fg overflow-hidden" aria-hidden="true">
        <div className="flex w-max will-change-transform motion-safe:animate-[moar-tick_30s_linear_infinite]">
          {[0, 1].map((i) => (
            <span key={i} className="whitespace-pre py-3.5 font-display uppercase text-sm sm:text-base">{line}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

interface BuilderProps {
  mode: Mode
  setMode: (m: Mode) => void
  boxes: Boxes
  setBoxes: (b: Boxes) => void
  currency: 'usd' | 'sek'
  ref: React.Ref<HTMLElement>
}

function BoxBuilder({ mode, setMode, boxes, setBoxes, currency, ref }: BuilderProps) {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const sub = mode === 'subscription'
  const q = quote(mode, boxes, currency)
  const shown = useCountUp(q.price)
  const [gift, setGift] = useState(false)
  const [giftName, setGiftName] = useState('')
  const [giftMsg, setGiftMsg] = useState('')
  const perBar = (q.price / (boxes * 12)).toLocaleString(i18n.language === 'sv' ? 'sv-SE' : 'en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const perks = t(sub ? 'shopPage.perksSub' : 'shopPage.perksOne', { returnObjects: true }) as string[]

  const buy = () => {
    if (sub) addItem('starter', true, [boxes, boxes, boxes])
    else addItem(ONE_TIME_IDS[boxes], false, undefined, gift && (giftName || giftMsg) ? { name: giftName, message: giftMsg } : undefined)
  }

  return (
    <section ref={ref} id="builder" data-tone={sub ? 'brown' : 'cream'} className="text-fg py-16 lg:py-24 scroll-mt-16">
      <div className="page-container grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* The bars stack up with the number of boxes. */}
        <div className="relative bg-caforange min-h-[300px] lg:min-h-[580px] overflow-hidden" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => {
            const on = i < boxes * 3
            const col = i % 3
            const row = Math.floor(i / 3)
            const x = (col - 1) * 120 - 50
            const y = (row - (boxes - 1) / 2) * 32 - 58
            return (
              <img
                key={i}
                src="/images/moar-wrapper.png"
                alt=""
                className="absolute left-1/2 top-1/2 w-[14%] lg:w-[15%] drop-shadow-[0_16px_16px_rgba(45,29,23,0.35)] transition-[transform,opacity] duration-500 ease-out"
                style={{
                  zIndex: 5 + row,
                  opacity: on ? 1 : 0,
                  transform: on
                    ? `translate(${x}%, ${y}%) rotate(${(col - 1) * 9 + (row - 1) * 4}deg)`
                    : 'translate(-50%, 30%) scale(0.85)',
                }}
              />
            )
          })}
          {boxes === 2 && (
            <span className="absolute top-4 right-4 bg-brown text-off-white px-3 py-2 font-accent text-[11px] uppercase tracking-[0.14em] font-semibold">
              {t('shopPage.mostPopular')}
            </span>
          )}
          <p className="absolute left-5 bottom-4 font-display text-brown leading-[0.8] text-[clamp(3rem,8vw,6.2rem)]">
            {boxes * 12}<span className="text-[0.26em]"> {t('shopPage.barsWord')}</span>
          </p>
        </div>

        <div className="border-2 border-fg/15 border-t-0 lg:border-t-2 lg:border-l-0 p-6 sm:p-10 grid gap-6 content-center">
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
            <span className="text-sm text-fg/75">{t('shopPage.perBar', { price: `${perBar} kr` })}</span>
          </div>

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
            className="bg-caforange text-white py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform"
          >
            {t(sub ? 'shopPage.ctaSub' : 'shopPage.ctaOne', { price: formatPrice(q.price, currency) })}
          </button>
        </div>
      </div>
    </section>
  )
}

function Deliveries({ boxes, locale }: { boxes: Boxes; locale: string }) {
  const { t } = useTranslation()
  const dates = deliveryDates(locale)
  // 0 = as planned, 1 = one extra box, 2 = skipped
  const [states, setStates] = useState([0, 0, 0, 0])
  const cycle = (i: number) => setStates((s) => s.map((v, j) => (j === i ? (v + 1) % 3 : v)))

  return (
    <section data-tone="orange" className="text-fg py-20 lg:py-28">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('shopPage.delivEyebrow')}</p>
            <h2 className="mt-3 font-display uppercase leading-[0.95] text-[clamp(2rem,5vw,4rem)] max-w-[14ch]">{t('shopPage.delivTitle')}</h2>
          </div>
          <p className="max-w-[36ch]">{t('shopPage.delivBody')}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {dates.map((d, i) => {
            const s = states[i]
            const first = i === 0
            const n = s === 1 ? boxes + 1 : boxes
            return (
              <button
                key={d}
                type="button"
                disabled={first}
                onClick={() => cycle(i)}
                className={`text-left min-h-[190px] p-4 sm:p-5 border-2 grid content-between gap-4 transition-[transform,opacity] duration-300 ${
                  first ? 'bg-brown text-off-white border-brown cursor-default' : 'border-fg hover:-translate-y-1'
                } ${s === 2 ? 'opacity-45' : ''}`}
              >
                <span>
                  <span className={`block font-display leading-none text-[clamp(1.4rem,2.6vw,2.2rem)] ${first ? 'text-caforange' : ''} ${s === 2 ? 'line-through' : ''}`}>{d}</span>
                  <span className="mt-1.5 block text-[13px]">
                    {first && `${t('shopPage.ships', { date: d })} · `}
                    {s === 2 ? t('shopPage.skipped') : `${t('shopPage.box', { count: n })} · ${t('shopPage.barsCount', { count: n * 12 })}`}
                  </span>
                </span>
                <span className="flex flex-wrap gap-1.5">
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
      </div>
    </section>
  )
}

function Chip({ on, children }: { on?: boolean; children: React.ReactNode }) {
  return (
    <span className={`border-[1.5px] border-current px-2 py-1.5 font-accent text-[10px] uppercase tracking-[0.1em] font-semibold leading-none ${on ? 'bg-fg text-tone' : ''}`}>
      {children}
    </span>
  )
}

function PricePerBar({ currency, locale }: { currency: 'usd' | 'sek'; locale: string }) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const fmt = (v: number, dec = 1) => `${v.toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec })} kr`
  const rows = BOX_OPTIONS.flatMap((b) => [
    { key: `o${b}`, label: `${t('shopPage.box', { count: b })} · ${t('shopPage.once')}`, v: quote('onetime', b, currency).price / (b * 12), kind: 'once' },
    { key: `s${b}`, label: `${t('shopPage.box', { count: b })} · ${t('shopPage.monthly')}`, v: quote('subscription', b, currency).price / (b * 12), kind: 'sub' },
  ])
  const max = COFFEE_SNACK_SEK

  return (
    <section data-tone="cream" className="text-fg py-20 lg:py-28">
      <div className="page-container grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-center">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-accent">{t('shopPage.ppbEyebrow')}</p>
          <h2 className="mt-3 font-display uppercase leading-[0.95] text-[clamp(2rem,4.4vw,3.6rem)]">{t('shopPage.ppbTitle')}</h2>
          <p className="mt-5 max-w-[40ch] text-fg/80">{t('shopPage.ppbBody')}</p>
        </div>
        <div ref={ref}>
          <div className="grid gap-2.5">
            {rows.map((r, i) => (
              <div key={r.key} className="grid grid-cols-[88px_minmax(0,1fr)_68px] sm:grid-cols-[150px_minmax(0,1fr)_96px] gap-3 items-center text-xs sm:text-sm">
                <span>{r.label}</span>
                <span className="relative h-7 sm:h-8 bg-fg/[0.08] overflow-hidden">
                  <motion.span
                    className={`absolute inset-y-0 left-0 ${r.kind === 'sub' ? 'bg-caforange' : 'bg-fg'}`}
                    initial={{ width: 0 }}
                    animate={{ width: inView ? `${(r.v / max) * 100}%` : 0 }}
                    transition={{ duration: 0.9, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                  />
                </span>
                <span className="font-display text-right whitespace-nowrap text-xs sm:text-base tabular-nums">{fmt(r.v)}</span>
              </div>
            ))}
            <div className="mt-3 grid grid-cols-[88px_minmax(0,1fr)_68px] sm:grid-cols-[150px_minmax(0,1fr)_96px] gap-3 items-center text-xs sm:text-sm">
              <span>{t('shopPage.coffeeSnack')}</span>
              <span className="h-7 sm:h-8 border-2 border-dashed border-fg" />
              <span className="font-display text-right whitespace-nowrap text-xs sm:text-base">{fmt(COFFEE_SNACK_SEK, 0)}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-fg/60">{t('shopPage.ppbNote')}</p>
        </div>
      </div>
    </section>
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

