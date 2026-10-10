import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '@/providers/CartProvider'
import { products, getCurrency, formatPrice } from '@/lib/products'

const ease = [0.25, 0.46, 0.45, 0.94] as const

// Fanned wrappers: one per box in the pack. Angles spread wider on hover.
const fans: Record<number, { r: number; x: number }[]> = {
  1: [{ r: -12, x: 0 }],
  2: [{ r: -20, x: -18 }, { r: 6, x: 18 }],
  3: [{ r: -26, x: -30 }, { r: -6, x: 0 }, { r: 14, x: 30 }],
}

export default function ProductCards() {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const currency = getCurrency(i18n.language)
  const locale = i18n.language === 'sv' ? 'sv-SE' : 'en-GB'

  return (
    <section className="bg-off-white text-brown py-20 lg:py-28">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-accent text-xs uppercase tracking-[0.2em] font-semibold text-caforange">{t('products.eyebrow')}</p>
            <h2 className="mt-3 font-display uppercase text-5xl sm:text-6xl lg:text-7xl leading-[0.9]">{t('products.title')}</h2>
            <p className="mt-4 text-lg text-brown/70">{t('products.subtitle')}</p>
          </div>
          <Link to="/shop" className="group inline-flex items-center gap-2 font-accent font-semibold text-sm uppercase tracking-[0.12em] border-b-2 border-caforange pb-1">
            {t('products.subscribeLink')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {products.map((product, i) => {
            const boxes = product.barCount / 12
            const featured = product.id === 'duo'
            const price = product.price[currency]
            const perBar = (price / product.barCount).toLocaleString(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 })
            return (
              <motion.article
                key={product.id}
                className={`group relative flex flex-col overflow-hidden ${featured ? 'bg-brown text-off-white' : 'bg-white text-brown'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease }}
              >
                {product.badge && (
                  <span className={`absolute top-4 left-4 z-10 px-3 py-1 font-accent text-[11px] font-semibold uppercase tracking-[0.12em] ${featured ? 'bg-caforange text-brown' : 'bg-brown text-off-white'}`}>
                    {t(product.badge)}
                  </span>
                )}

                {/* Visual: one wrapper per box */}
                <div className={`relative h-64 sm:h-72 overflow-hidden ${featured ? 'bg-caforange' : 'bg-caforange/90'}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {fans[boxes]?.map((f, k) => (
                      <img
                        key={k}
                        src="/images/moar-wrapper.png"
                        alt=""
                        loading="lazy"
                        className="absolute h-[118%] w-auto drop-shadow-[0_18px_22px_rgba(45,30,23,0.4)] transition-transform duration-500 ease-out [transform:translateX(var(--x))_rotate(var(--r))] group-hover:[transform:translateX(calc(var(--x)*1.6))_rotate(calc(var(--r)*1.35))_translateY(-6px)]"
                        style={{ ['--x' as string]: `${f.x}%`, ['--r' as string]: `${f.r}deg` }}
                      />
                    ))}
                  </div>
                  <span className="absolute bottom-3 right-4 font-display text-6xl leading-none text-brown/90">×{product.barCount}</span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display uppercase text-3xl leading-none">{t(product.nameKey)}</h3>
                    <span className={`font-accent text-sm ${featured ? 'text-off-white/60' : 'text-brown/50'}`}>{t(product.descriptionKey)}</span>
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-5xl leading-none">{formatPrice(price, currency)}</span>
                        {product.originalPrice && (
                          <span className={`text-sm line-through ${featured ? 'text-off-white/40' : 'text-brown/35'}`}>
                            {formatPrice(product.originalPrice[currency], currency)}
                          </span>
                        )}
                      </div>
                      <span className="mt-1 block font-accent text-sm text-caforange">
                        {t('products.perBar', { price: perBar })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => addItem(product.id)}
                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 py-4 font-accent font-semibold text-sm uppercase tracking-[0.14em] transition-colors duration-200 ${
                      featured ? 'bg-caforange text-brown hover:bg-off-white' : 'bg-brown text-off-white hover:bg-caforange hover:text-brown'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {t('products.addToCart')}
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
