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
      <div className="page-container">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading text-near-black">{t('products.title')}</h2>
          <p className="mt-3 text-near-black font-accent">{t('products.subtitle')}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <AnimatedSection key={product.id} delay={i * 0.15} direction="scale">
              <div className="group relative bg-white p-16 border border-near-black/5 hover:border-gold/20 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300">
                {product.badge && (
                  <span className="absolute top-8 right-8 z-10 px-3 py-1 bg-gold text-near-black text-xs font-bold font-accent rounded-full uppercase">
                    {t(product.badge)}
                  </span>
                )}

                {/* Product visual */}
                <div className="h-80 flex items-center justify-center mb-10 overflow-hidden bg-cream group-hover:scale-[1.02] transition-transform duration-300">
                  <img src="/images/product-box.png" alt="CAFO Energy bar" className="h-full w-full object-contain p-6" />
                </div>

                <h3 className="text-xl font-semibold font-accent">{t(product.nameKey)}</h3>
                <p className="text-base text-near-black/50 mt-1">{t(product.descriptionKey)}</p>

                <div className="mt-6 flex items-center justify-between">
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
                    className="inline-flex items-center gap-2 px-8 py-4 bg-near-black text-white text-base font-semibold font-accent hover:bg-near-black/80 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
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
