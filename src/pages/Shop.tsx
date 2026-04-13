import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/providers/CartProvider'
import { products, getCurrency, formatPrice } from '@/lib/products'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ShoppingBag } from 'lucide-react'

export default function Shop() {
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const currency = getCurrency(i18n.language)

  const ingredients = [
    { titleKey: 'nutrition.caffeineTitle', descKey: 'nutrition.caffeineDesc', value: '90mg', icon: '⚡' },
    { titleKey: 'nutrition.proteinTitle', descKey: 'nutrition.proteinDesc', value: '10g', icon: '💪' },
    { titleKey: 'nutrition.sugarTitle', descKey: 'nutrition.sugarDesc', value: '0g', icon: '🚫' },
    { titleKey: 'nutrition.ltheanineTitle', descKey: 'nutrition.ltheanineDesc', value: '✔', icon: '🧠' },
  ]

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
          <p className="mt-4 text-white/50 font-accent text-lg">{t('products.subtitle')}</p>
        </AnimatedSection>
      </section>

      {/* Products */}
      <section className="py-24 bg-warm-white">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <AnimatedSection key={product.id} delay={i * 0.15} direction="scale">
                <div className="group relative bg-white rounded-3xl p-8 border border-near-black/5 hover:border-gold/20 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300">
                  {product.badge && (
                    <span className="absolute top-6 right-6 z-10 px-3 py-1 bg-gold text-near-black text-xs font-bold font-accent rounded-full uppercase">
                      {t(product.badge)}
                    </span>
                  )}

                  <div className="h-56 bg-gradient-to-br from-cream to-dark-cream rounded-2xl flex items-center justify-center mb-6 group-hover:scale-[1.02] transition-transform duration-300">
                    <div className="text-center">
                      <span className="text-4xl font-heading text-forest">CAFO</span>
                      <p className="text-xs text-forest/50 font-accent mt-1">{t(product.descriptionKey)}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold font-accent">{t(product.nameKey)}</h3>
                  <p className="text-sm text-near-black/50 mt-1">{t(product.descriptionKey)}</p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-heading">
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-near-black font-semibold font-accent rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/25 transition-all duration-200"
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

      {/* Ingredients */}
      <section className="py-24 bg-cream">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading text-near-black">{t('nutrition.title')}</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ingredients.map((item, i) => (
              <AnimatedSection key={item.titleKey} delay={i * 0.1} className="h-full">
                <div className="bg-white rounded-3xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-near-black/5 h-full flex flex-col items-center justify-start">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <span className="text-3xl font-heading text-forest block mb-2">{item.value}</span>
                  <h3 className="font-semibold font-accent text-near-black mb-2">{t(item.titleKey)}</h3>
                  <p className="text-sm text-near-black/50 leading-relaxed">{t(item.descKey)}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
