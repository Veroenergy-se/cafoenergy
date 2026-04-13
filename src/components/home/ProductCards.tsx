import { useTranslation } from 'react-i18next'
import { useCart } from '@/providers/CartProvider'
import { products, getCurrency, formatPrice } from '@/lib/products'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ShoppingBag } from 'lucide-react'

export default function ProductCards() {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const currency = getCurrency(i18n.language)

  return (
    <section className="py-24 bg-warm-white">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading text-near-black">{t('products.title')}</h2>
          <p className="mt-3 text-near-black/50 font-accent">{t('products.subtitle')}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <AnimatedSection key={product.id} delay={i * 0.15} direction="scale">
              <div className="group relative bg-white rounded-3xl p-8 border border-near-black/5 hover:border-gold/20 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300">
                {product.badge && (
                  <span className="absolute top-6 right-6 z-10 px-3 py-1 bg-gold text-near-black text-xs font-bold font-accent rounded-full uppercase">
                    {t(product.badge)}
                  </span>
                )}

                {/* Product visual */}
                <div className="h-48 bg-gradient-to-br from-cream to-dark-cream rounded-2xl flex items-center justify-center mb-6 group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="text-center">
                    <span className="text-3xl font-heading text-forest">CAFO</span>
                    <p className="text-xs text-forest/50 font-accent mt-1">{t(product.descriptionKey)}</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold font-accent">{t(product.nameKey)}</h3>
                <p className="text-sm text-near-black/50 mt-1">{t(product.descriptionKey)}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-heading">
                      {formatPrice(product.price[currency], currency)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-near-black/30 line-through">
                        {formatPrice(product.originalPrice[currency], currency)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addItem(product.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-near-black text-white text-sm font-semibold font-accent rounded-full hover:bg-near-black/80 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {t('products.addToCart')}
                  </button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
