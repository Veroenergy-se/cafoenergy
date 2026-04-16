import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/providers/CartProvider'
import { products, getCurrency, formatPrice } from '@/lib/products'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ShoppingBag, Zap, Leaf, Shield } from 'lucide-react'

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
  starter: {
    eyebrow: 'Try it',
    pitch: 'First time with CAFO? This is where you start.',
  },
  duo: {
    eyebrow: 'Most popular',
    pitch: 'The one most people stick with. Two weeks of clean focus.',
  },
  family: {
    eyebrow: 'Best value',
    pitch: 'A month of bars, priced at the lowest cost per bar we offer.',
  },
}

export default function Shop() {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const currency = getCurrency(i18n.language)

  return (
    <>
      <Helmet>
        <title>Shop — CAFO Energy</title>
        <meta name="description" content="Shop CAFO caffeinated protein bars. One flavour, perfected. Free shipping on orders over $50." />
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
              {t('nav.freeShipping', { amount: currency === 'sek' ? '499 kr' : '$50' })}
            </span>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-warm-white">
        <div className="page-container">
          <div className="grid lg:grid-cols-3 gap-5 items-stretch">
            {products.map((product, i) => {
              const copy = productCopy[product.id]
              const pbar = perBar[product.id]
              const isFeatured = product.badge === 'products.bestseller'

              return (
                <AnimatedSection key={product.id} delay={i * 0.1} direction="scale">
                  <div className={`relative rounded-3xl overflow-hidden border h-full flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                    isFeatured
                      ? 'bg-near-black border-near-black shadow-2xl shadow-near-black/20'
                      : 'bg-white border-near-black/[0.06] hover:shadow-xl hover:shadow-near-black/8'
                  }`}>
                    {/* Eyebrow badge */}
                    <div className={`px-8 pt-8 pb-0`}>
                      <span className={`inline-block text-[10px] font-accent font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5 ${
                        isFeatured
                          ? 'bg-gold/20 text-gold'
                          : 'bg-near-black/[0.05] text-near-black/40'
                      }`}>
                        {copy.eyebrow}
                      </span>
                    </div>

                    {/* Product visual */}
                    <div className={`mx-8 rounded-2xl aspect-[4/3] flex items-center justify-center mb-6 ${
                      isFeatured
                        ? 'bg-white/[0.06]'
                        : 'bg-gradient-to-br from-cream to-dark-cream'
                    }`}>
                      <div className="text-center">
                        <span className={`text-4xl font-heading ${isFeatured ? 'text-white' : 'text-forest'}`}>
                          CAFO
                        </span>
                        <p className={`text-xs font-accent mt-1 ${isFeatured ? 'text-white/30' : 'text-forest/40'}`}>
                          {t(product.descriptionKey)}
                        </p>
                      </div>
                    </div>

                    <div className="px-8 pb-8 flex flex-col flex-1">
                      <h3 className={`text-xl font-heading mb-1 ${isFeatured ? 'text-white' : 'text-near-black'}`}>
                        {t(product.nameKey)}
                      </h3>
                      <p className={`text-sm font-accent leading-relaxed mb-6 flex-1 ${isFeatured ? 'text-white/45' : 'text-near-black/45'}`}>
                        {copy.pitch}
                      </p>

                      {/* Price row */}
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-heading ${isFeatured ? 'text-white' : 'text-near-black'}`}>
                              {formatPrice(product.price[currency], currency)}
                            </span>
                            {product.originalPrice && (
                              <span className={`text-sm line-through ${isFeatured ? 'text-white/25' : 'text-near-black/25'}`}>
                                {formatPrice(product.originalPrice[currency], currency)}
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] font-accent mt-0.5 ${isFeatured ? 'text-white/30' : 'text-near-black/30'}`}>
                            {currency === 'sek'
                              ? `${pbar.sek.toFixed(2)} kr / bar`
                              : `$${pbar.usd.toFixed(2)} / bar`}
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
                        className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold font-accent rounded-full transition-all duration-200 hover:-translate-y-0.5 ${
                          isFeatured
                            ? 'bg-gradient-to-r from-gold to-gold-light text-near-black hover:shadow-lg hover:shadow-gold/30'
                            : 'bg-near-black text-white hover:shadow-lg hover:shadow-near-black/20'
                        }`}
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

          {/* Trust line */}
          <AnimatedSection delay={0.3}>
            <p className="text-center text-[11px] font-accent text-near-black/30 mt-8 tracking-wide">
              Ships within 2–3 business days · {currency === 'sek' ? 'Fri frakt över 499 kr' : 'Free shipping over $50'}
            </p>
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
                  <p className="text-[10px] font-accent font-bold text-near-black/25 tracking-[0.18em] uppercase mb-3">
                    Per bar
                  </p>
                  <h2 className="text-4xl sm:text-5xl font-heading text-near-black leading-tight">
                    {t('nutrition.title')}
                  </h2>
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
                  <div
                    key={item.label}
                    className="bg-white rounded-3xl p-7 border border-near-black/[0.06] flex gap-5 items-start hover:shadow-md transition-all duration-200"
                  >
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
