import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/providers/CartProvider'
import { products, getCurrency, formatPrice, getSubscriptionPrice, getSubscriptionDiscount } from '@/lib/products'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ShoppingBag, Zap, Leaf, Shield, Minus, Plus, RefreshCw, Package, Settings } from 'lucide-react'
import CafoLogo from '@/components/shared/CafoLogo'

// Boxes of 12 — no upper limit
const BOX_BARS = (boxes: number) => boxes * 12
const BOX_PRICE_SEK = 279 // per box (starter unit price)

const perBar: Record<string, { usd: number; sek: number }> = {
  starter: { usd: 2.42, sek: 23.25 },
  duo:     { usd: 2.25, sek: 21.63 },
  family:  { usd: 2.08, sek: 19.97 },
}

const benefitsStrip = [
  { icon: Zap,    text: '90mg natural caffeine' },
  { icon: Leaf,   text: '14g plant protein' },
  { icon: Shield, text: '0g added sugar' },
]

const productCopy: Record<string, { eyebrow: string; pitch: string }> = {
  starter: { eyebrow: 'Try it',       pitch: 'First time with CAFO? This is where you start.' },
  duo:     { eyebrow: 'Most popular', pitch: 'The one most people stick with. Two weeks of clean focus.' },
  family:  { eyebrow: 'Best value',   pitch: 'A full month of bars, lowest cost per bar we offer.' },
}

const howItWorks = [
  { icon: Package,    step: '01', title: 'Pick your plan.',          desc: 'Set how many bars you want each month. Mix it up — different quantities per month.' },
  { icon: RefreshCw,  step: '02', title: 'Auto-delivered monthly.',   desc: 'We send your order on the same date every month. No thinking required.' },
  { icon: Settings,   step: '03', title: 'Full control, always.',     desc: 'Skip a month, swap quantities, or cancel before each delivery. No fees.' },
]

export default function Shop() {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const currency = getCurrency(i18n.language)
  const [plan, setPlan] = useState<number[]>([1, 1, 1]) // boxes per month (1–3)

  const discountPct = Math.round(getSubscriptionDiscount(plan[0]) * 100)

  const updatePlan = (month: number, boxes: number) => {
    const clamped = Math.max(1, boxes)
    setPlan(prev => prev.map((b, i) => (i === month ? clamped : b)))
  }

  const handleSubscribe = () => {
    addItem('starter', true, plan)
  }

  return (
    <>
      <Helmet>
        <title>Shop — CAFO Energy</title>
        <meta name="description" content="Shop CAFO caffeinated protein bars. One-time or monthly subscription. Free shipping on orders over 499 kr." />
      </Helmet>

      {/* Hero */}
      <section className="bg-near-black py-32 text-center">
        <AnimatedSection>
          <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-heading text-white">{t('products.title')}</h1>
          <p className="mt-4 text-white/40 font-accent text-lg">{t('products.subtitle')}</p>
        </AnimatedSection>
      </section>

      {/* Benefits strip */}
      <section className="bg-gold py-4">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12">
            {benefitsStrip.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-near-black/60 shrink-0" />
                <span className="text-[11px] font-accent font-bold text-near-black/70 uppercase tracking-wider">{text}</span>
              </div>
            ))}
            <div className="hidden sm:block w-px h-4 bg-near-black/15" />
            <span className="text-[11px] font-accent font-bold text-near-black/70 uppercase tracking-wider">
              Fri frakt över 499 kr
            </span>
          </div>
        </div>
      </section>

      {/* Subscription planner — primary */}
      <section className="py-20 bg-warm-white">
        <div className="page-container">
          <AnimatedSection className="mb-10">
            <p className="text-[11px] font-accent text-near-black/35 tracking-wide text-center">
              Each box contains <span className="font-semibold text-near-black/55">12 bars</span> — about one week of daily focus.
            </p>
            <div className="mt-4 text-center">
              <h2 className="text-4xl sm:text-5xl font-heading text-near-black">Build your monthly box.</h2>
              <p className="mt-2 text-near-black/45 font-accent text-base">Choose how many boxes you want delivered each month. Save 10–20%.</p>
            </div>
          </AnimatedSection>

          {/* SUBSCRIPTION: planner */}
          <AnimatedSection id="subscription" direction="scale">
              <div className="bg-white rounded-3xl border border-near-black/[0.06] overflow-hidden shadow-lg">

                {/* Top: month 1 + savings side by side */}
                <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-near-black/[0.06]">

                  {/* Month 1 — primary selector */}
                  <div className="p-8 sm:p-10">
                    <p className="text-[10px] font-accent font-bold text-near-black/30 uppercase tracking-widest mb-5">
                      Your monthly box
                    </p>
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => updatePlan(0, plan[0] - 1)}
                        disabled={plan[0] <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-near-black/15 text-near-black/40 hover:border-near-black/40 hover:text-near-black disabled:opacity-20 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="flex-1 text-center">
                        <p className="text-5xl font-heading text-near-black leading-none">{plan[0]}</p>
                        <p className="text-sm font-heading text-near-black/40 mt-0.5">{plan[0] === 1 ? 'box' : 'boxes'}</p>
                        <p className="text-[11px] font-accent text-near-black/25 mt-1">{BOX_BARS(plan[0])} bars</p>
                      </div>
                      <button
                        onClick={() => updatePlan(0, plan[0] + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-near-black/15 text-near-black/40 hover:border-near-black/40 hover:text-near-black transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Quick-pick shortcuts */}
                    <div className="flex gap-2">
                      {[1, 2, 3].map(b => (
                        <button
                          key={b}
                          onClick={() => updatePlan(0, b)}
                          className={`flex-1 py-2 rounded-xl text-xs font-accent font-semibold transition-all ${
                            plan[0] === b
                              ? 'bg-near-black text-white'
                              : 'bg-near-black/[0.05] text-near-black/40 hover:bg-near-black/10'
                          }`}
                        >
                          {b} {b === 1 ? 'box' : 'boxes'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Savings + why */}
                  <div className="p-8 sm:p-10 bg-cream">
                    <p className="text-[10px] font-accent font-bold text-near-black/30 uppercase tracking-widest mb-5">
                      What you get
                    </p>
                    {(() => {
                      const full = BOX_PRICE_SEK * plan[0]
                      const sub  = getSubscriptionPrice(full, plan[0])
                      const saving = full - sub
                      const nextTierBoxes = plan[0] < 2 ? 2 : plan[0] < 3 ? 3 : null
                      const nextDiscount = nextTierBoxes ? Math.round(getSubscriptionDiscount(nextTierBoxes) * 100) : null
                      return (
                        <>
                          <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-4xl font-heading text-near-black">{formatPrice(sub, currency)}</span>
                            <span className="text-base font-accent text-near-black/30 line-through">{formatPrice(full, currency)}</span>
                          </div>
                          <p className="text-sm font-accent text-forest font-semibold mb-1">
                            You save {formatPrice(saving, currency)} every month — {discountPct}% off
                          </p>
                          {nextTierBoxes && (
                            <p className="text-xs font-accent text-near-black/35 mb-6">
                              Add {nextTierBoxes - plan[0]} more box{nextTierBoxes - plan[0] > 1 ? 'es' : ''} to save {nextDiscount}%
                            </p>
                          )}
                          {!nextTierBoxes && <div className="mb-6" />}
                        </>
                      )
                    })()}
                    <div className="space-y-2.5">
                      {[
                        'Delivered on the same date each month',
                        'Skip, swap, or cancel before any delivery',
                        'Locked-in price — no surprise increases',
                        'Free shipping on every order',
                      ].map(b => (
                        <div key={b} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 shrink-0" />
                          <span className="text-sm font-accent text-near-black/55 leading-snug">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Plan ahead — months 2 & 3 */}
                <div className="px-8 sm:px-10 py-6 border-t border-near-black/[0.06]">
                  <p className="text-[10px] font-accent font-bold text-near-black/25 uppercase tracking-widest mb-4">
                    Plan ahead — optional
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[1, 2].map((month) => {
                      const boxes = plan[month]
                      const price = getSubscriptionPrice(BOX_PRICE_SEK * boxes, boxes)
                      return (
                        <div key={month} className="flex items-center justify-between gap-4 bg-near-black/[0.03] rounded-2xl px-5 py-4">
                          <p className="text-sm font-accent text-near-black/50 w-16 shrink-0">Month {month + 1}</p>
                          <div className="flex items-center gap-2 flex-1">
                            <button
                              onClick={() => updatePlan(month, boxes - 1)}
                              disabled={boxes <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-near-black/10 text-near-black/40 hover:text-near-black disabled:opacity-20 transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-heading text-near-black flex-1 text-center">{boxes} {boxes === 1 ? 'box' : 'boxes'}</span>
                            <button
                              onClick={() => updatePlan(month, boxes + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-near-black/10 text-near-black/40 hover:text-near-black disabled:opacity-20 transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-sm font-heading text-near-black/50 shrink-0">{formatPrice(price, currency)}</span>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-[11px] font-accent text-near-black/25 mt-3">
                    These are your preferences — you can change quantities before each delivery date.
                  </p>
                </div>

                {/* CTA footer */}
                <div className="px-8 sm:px-10 py-6 bg-near-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-accent text-white/30 uppercase tracking-widest mb-1">First payment</p>
                    <p className="text-3xl font-heading text-white leading-none">
                      {formatPrice(getSubscriptionPrice(BOX_PRICE_SEK * plan[0], plan[0]), currency)}
                    </p>
                    <p className="text-[11px] font-accent text-white/30 mt-1">
                      {plan[0]} {plan[0] === 1 ? 'box' : 'boxes'} · {BOX_BARS(plan[0])} bars · auto-renewed monthly
                    </p>
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-near-black font-semibold font-accent rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/25 transition-all duration-200"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Subscribe & save {discountPct}%
                  </button>
                </div>

              </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="text-center text-[11px] font-accent text-near-black/30 mt-8 tracking-wide">
              Ships within 2–3 business days · Fri frakt över 499 kr
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ONE-TIME: product cards */}
      <section className="py-20 bg-warm-white border-t border-near-black/[0.06]">
        <div className="page-container">
          <AnimatedSection className="mb-10 text-center">
            <p className="text-[11px] font-accent font-bold text-near-black/30 uppercase tracking-widest mb-2">Just want to try it first?</p>
            <h2 className="text-4xl sm:text-5xl font-heading text-near-black">One-time orders.</h2>
            <p className="mt-2 text-near-black/45 font-accent text-base">No commitment. Pay once, shipped right away.</p>
          </AnimatedSection>
          <div className="grid lg:grid-cols-3 gap-5 items-stretch">
            {products.map((product, i) => {
              const copy = productCopy[product.id]
              const pbar = perBar[product.id]

              return (
                <AnimatedSection key={product.id} delay={i * 0.1} direction="scale">
                  <div className="relative overflow-hidden border h-full flex flex-col transition-all duration-300 hover:-translate-y-1 bg-white border-near-black/[0.06] hover:shadow-xl">
                    <div className="px-8 pt-8">
                      <span className="inline-block text-[10px] font-accent font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5 bg-near-black/[0.05] text-near-black/40">
                        {copy.eyebrow}
                      </span>
                    </div>

                    <div className="mx-8 aspect-[4/3] flex flex-col items-center justify-center gap-3 mb-6 bg-gradient-to-br from-cream to-dark-cream">
                      <CafoLogo className="w-28 h-auto" />
                      <div className="text-center">
                        <span className="text-4xl font-heading leading-none text-near-black">
                          {product.barCount / 12}
                        </span>
                        <span className="text-xl font-heading ml-1.5 text-near-black/50">
                          {product.barCount / 12 === 1 ? 'box' : 'boxes'}
                        </span>
                        <p className="text-[11px] font-accent mt-1 text-near-black/25">
                          {product.barCount} bars total
                        </p>
                      </div>
                    </div>

                    <div className="px-8 pb-8 flex flex-col flex-1">
                      <h3 className="text-3xl font-heading mb-1 text-near-black">
                        {t(product.nameKey)}
                      </h3>
                      <p className="text-sm font-accent leading-relaxed mb-6 flex-1 text-near-black/45">
                        {copy.pitch}
                      </p>

                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-heading text-near-black">
                              {formatPrice(product.price[currency], currency)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm line-through text-near-black/25">
                                {formatPrice(product.originalPrice[currency], currency)}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-accent mt-0.5 text-near-black/30">
                            {currency === 'sek' ? `${pbar.sek.toFixed(2)} kr / bar` : `$${pbar.usd.toFixed(2)} / bar`}
                          </p>
                        </div>
                        {product.originalPrice && (
                          <span className="text-xs font-bold font-accent bg-gold text-near-black px-2.5 py-1 rounded-full">
                            Save {Math.round((1 - product.price[currency] / product.originalPrice[currency]) * 100)}%
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addItem(product.id)}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold font-accent transition-all duration-200 hover:-translate-y-0.5 bg-near-black text-white hover:shadow-lg"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {t('products.addToCart')}
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* How subscription works */}
      <section className="py-20 bg-near-black">
        <div className="page-container">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <p className="text-[10px] font-accent font-bold text-white/25 tracking-[0.18em] uppercase mb-3">
                Monthly subscription
              </p>
              <h2 className="text-4xl sm:text-5xl font-heading text-white mb-14 leading-tight">
                Never run out.<br /><span className="text-gold">Never think about it.</span>
              </h2>

              <div className="grid sm:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden mb-10">
                {howItWorks.map(({ icon: Icon, step, title, desc }) => (
                  <div key={step} className="bg-near-black px-9 py-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white/50" />
                      </div>
                      <span className="text-sm font-accent font-bold text-white/20 uppercase tracking-widest">{step}</span>
                    </div>
                    <h3 className="text-2xl font-heading text-white mb-3">{title}</h3>
                    <p className="text-base text-white/35 font-accent leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-7 py-5 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                  {[`${discountPct}% off every order`, 'Free shipping included', 'Pause or cancel anytime', 'Adjust quantities monthly'].map(f => (
                    <span key={f} className="text-[11px] font-accent text-white/40 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-gold inline-block" />
                      {f}
                    </span>
                  ))}
                </div>
                <a
                  href="#subscription"
                  className="shrink-0 px-6 py-3 bg-gold text-near-black font-semibold font-accent rounded-full text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20 transition-all duration-200"
                >
                  Start subscription
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What's inside */}
      <section className="py-24 bg-cream">
        <div className="page-container">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
                <div>
                  <p className="text-[10px] font-accent font-bold text-near-black/25 tracking-[0.18em] uppercase mb-3">Per bar</p>
                  <h2 className="text-4xl sm:text-5xl font-heading text-near-black leading-tight">{t('nutrition.title')}</h2>
                </div>
                <p className="text-sm text-near-black/40 font-accent max-w-xs leading-relaxed sm:text-right">
                  Every ingredient is there for a reason. Nothing is there for optics.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: t('nutrition.caffeineTitle'), value: '90mg', desc: t('nutrition.caffeineDesc'), accent: 'forest' },
                  { label: t('nutrition.proteinTitle'),  value: '14g',  desc: t('nutrition.proteinDesc'),  accent: 'gold' },
                  { label: t('nutrition.sugarTitle'),    value: '0g',   desc: t('nutrition.sugarDesc'),    accent: 'forest' },
                  { label: t('nutrition.ltheanineTitle'),value: '✓',    desc: t('nutrition.ltheanineDesc'),accent: 'gold' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-3xl p-7 border border-near-black/[0.06] flex gap-5 items-start hover:shadow-md transition-all duration-200">
                    <div className={`text-3xl font-heading shrink-0 leading-none mt-0.5 ${item.accent === 'forest' ? 'text-forest' : 'text-gold'}`}>
                      {item.value}
                    </div>
                    <div>
                      <h3 className="font-semibold font-accent text-near-black text-sm mb-1">{item.label}</h3>
                      <p className="text-sm text-near-black/45 font-accent leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-near-black text-center">
        <div className="page-container">
          <AnimatedSection>
            <div className="max-w-xl mx-auto">
              <h2 className="text-5xl sm:text-6xl font-heading text-white mb-4">Still deciding?</h2>
              <p className="text-white/40 font-accent mb-8 leading-relaxed">
                Start with the 12-bar pack. If it doesn't become your go-to, nothing will.
              </p>
              <button
                onClick={() => addItem('starter')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-near-black font-semibold font-accent rounded-full hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4" />
                Try the starter pack
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
