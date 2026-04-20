import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/providers/CartProvider'
import { products, getCurrency, formatPrice, getSubscriptionPrice, getSubscriptionDiscount } from '@/lib/products'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ShoppingBag, Zap, Leaf, Shield, RefreshCw, Package, Settings } from 'lucide-react'
import CafoLogo from '@/components/shared/CafoLogo'

type PurchaseMode = 'onetime' | 'subscription'

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
  const [mode, setMode] = useState<PurchaseMode>('subscription')
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


      {/* Products / Subscription planner */}
      <section className="py-20 bg-warm-white">
        <div className="page-container">

          {/* Purchase mode toggle */}
          <AnimatedSection>
            <div className="flex flex-col items-center mb-12 gap-4">
              <p className="text-[11px] font-accent text-near-black/35 tracking-wide">
                Each box contains <span className="font-semibold text-near-black/55">12 bars</span> — about one week of daily focus.
              </p>
              <div className="flex bg-near-black/[0.06] rounded-full p-1.5 gap-1.5">
                <button
                  onClick={() => setMode('subscription')}
                  className={`flex items-center gap-2 px-8 py-4 rounded-full text-base font-accent font-semibold transition-all duration-200 ${
                    mode === 'subscription'
                      ? 'bg-near-black shadow-sm text-white'
                      : 'text-near-black/40 hover:text-near-black/60'
                  }`}
                >
                  Monthly subscription
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                    mode === 'subscription' ? 'bg-gold text-near-black' : 'bg-near-black/10 text-near-black/50'
                  }`}>
                    Save 10–20%
                  </span>
                </button>
                <button
                  onClick={() => setMode('onetime')}
                  className={`px-8 py-4 rounded-full text-base font-accent font-semibold transition-all duration-200 ${
                    mode === 'onetime'
                      ? 'bg-white shadow-sm text-near-black'
                      : 'text-near-black/40 hover:text-near-black/60'
                  }`}
                >
                  One-time
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* ONE-TIME: product cards */}
          {mode === 'onetime' && (
            <div className="grid lg:grid-cols-3 gap-5 items-stretch">
              {products.map((product, i) => {
                const copy = productCopy[product.id]
                const pbar = perBar[product.id]
                const isFeatured = product.badge === 'products.bestseller'

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
          )}

          {/* SUBSCRIPTION: simple planner */}
          {mode === 'subscription' && (
            <AnimatedSection direction="scale">
              <div className="max-w-4xl mx-auto">

                {/* Option cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { boxes: 1, label: '1 box',  bars: 12, discount: 10, tag: null },
                    { boxes: 2, label: '2 boxes', bars: 24, discount: 15, tag: 'Most popular' },
                    { boxes: 3, label: '3 boxes', bars: 36, discount: 20, tag: 'Best value' },
                  ].map(({ boxes, label, bars, discount, tag }) => {
                    const price = getSubscriptionPrice(BOX_PRICE_SEK * boxes, boxes)
                    const selected = plan[0] === boxes
                    return (
                      <button
                        key={boxes}
                        onClick={() => updatePlan(0, boxes)}
                        className={`relative flex flex-col items-center text-center p-6 border-2 transition-all duration-200 ${
                          selected
                            ? 'border-near-black bg-near-black text-white'
                            : 'border-near-black/10 bg-white text-near-black hover:border-near-black/30'
                        }`}
                      >
                        {tag && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-accent font-bold uppercase tracking-wider px-3 py-1 bg-gold text-near-black whitespace-nowrap">
                            {tag}
                          </span>
                        )}
                        <span className="text-3xl font-heading leading-none mb-1">{label}</span>
                        <span className={`text-xs font-accent mb-3 ${selected ? 'text-white/50' : 'text-near-black/40'}`}>{bars} bars / month</span>
                        <span className="text-2xl font-heading">{formatPrice(price, currency)}</span>
                        <span className={`text-xs font-accent font-bold mt-1 ${selected ? 'text-gold' : 'text-forest'}`}>Save {discount}%</span>
                      </button>
                    )
                  })}

                  {/* Custom option */}
                  {(() => {
                    const isCustom = plan[0] > 3
                    const customPrice = getSubscriptionPrice(BOX_PRICE_SEK * plan[0], plan[0])
                    return (
                      <button
                        onClick={() => { if (!isCustom) updatePlan(0, 4) }}
                        className={`relative flex flex-col items-center text-center p-6 border-2 transition-all duration-200 ${
                          isCustom
                            ? 'border-near-black bg-near-black text-white'
                            : 'border-near-black/10 bg-white text-near-black hover:border-near-black/30'
                        }`}
                      >
                        <span className="text-3xl font-heading leading-none mb-1">Custom</span>
                        {isCustom ? (
                          <>
                            <div className="flex items-center gap-2 my-2" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => updatePlan(0, Math.max(4, plan[0] - 1))}
                                className="w-6 h-6 flex items-center justify-center border border-white/30 text-white/70 hover:text-white transition-colors text-lg leading-none"
                              >−</button>
                              <span className="text-2xl font-heading w-8 text-center">{plan[0]}</span>
                              <button
                                onClick={() => updatePlan(0, plan[0] + 1)}
                                className="w-6 h-6 flex items-center justify-center border border-white/30 text-white/70 hover:text-white transition-colors text-lg leading-none"
                              >+</button>
                            </div>
                            <span className="text-xs font-accent text-white/50 mb-1">{BOX_BARS(plan[0])} bars / month</span>
                            <span className="text-2xl font-heading">{formatPrice(customPrice, currency)}</span>
                            <span className="text-xs font-accent font-bold mt-1 text-gold">Save 20%</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-accent mb-3 text-near-black/40">4+ boxes</span>
                            <span className="text-sm font-accent text-near-black/40">Pick amount</span>
                            <span className="text-xs font-accent font-bold mt-1 text-forest">Save 20%</span>
                          </>
                        )}
                      </button>
                    )
                  })()}
                </div>

                {/* What's included */}
                <div className="bg-cream p-6 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Delivered monthly, same date',
                      'Change your quantity before any delivery',
                      'Cancel anytime — no fees',
                      'Free shipping on every order',
                    ].map(b => (
                      <div key={b} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                        <span className="text-sm font-accent text-near-black/60">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleSubscribe}
                  className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-near-black text-white font-heading text-2xl tracking-wide hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Subscribe & save {discountPct}% — {formatPrice(getSubscriptionPrice(BOX_PRICE_SEK * plan[0], plan[0]), currency)}/month
                </button>
                <p className="text-center text-[11px] font-accent text-near-black/30 mt-3">
                  {plan[0]} {plan[0] === 1 ? 'box' : 'boxes'} · {BOX_BARS(plan[0])} bars · cancel anytime
                </p>

              </div>
            </AnimatedSection>
          )}

          {/* Trust line */}
          <AnimatedSection delay={0.3}>
            <p className="text-center text-[11px] font-accent text-near-black/30 mt-8 tracking-wide">
              Ships within 2–3 business days · Fri frakt över 499 kr
            </p>
          </AnimatedSection>
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
                <button
                  onClick={() => {
                    setMode('subscription')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="shrink-0 px-6 py-3 bg-gold text-near-black font-semibold font-accent rounded-full text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20 transition-all duration-200"
                >
                  Start subscription
                </button>
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
