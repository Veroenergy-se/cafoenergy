import { useState, useEffect, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/providers/CartProvider'
import { getCurrency, formatPrice } from '@/lib/products'
import { SITE } from '@/lib/constants'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { ShoppingBag, ArrowLeft, Check, Minus, Plus, Trash2 } from 'lucide-react'

export default function Checkout() {
  const { t, i18n } = useTranslation()
  const { items, getProduct, cartTotal, removeItem, updateQuantity, clearCart } = useCart()
  const currency = getCurrency(i18n.language)
  const total = cartTotal(currency)
  const threshold = SITE.freeShippingThreshold[currency]
  const freeShipping = total >= threshold
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<'cart' | 'details' | 'confirmed'>('cart')

  // Handle Stripe success redirect
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      clearCart()
      setStep('confirmed')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' })

  if (items.length === 0 && step !== 'confirmed') {
    return (
      <>
        <Helmet><title>{t('checkout.title')} — CAFO Energy</title></Helmet>
        <section className="min-h-[70vh] flex items-center justify-center bg-warm-white">
          <AnimatedSection className="text-center px-6">
            <ShoppingBag className="w-16 h-16 text-near-black/20 mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-heading text-near-black mb-4">{t('checkout.emptyTitle')}</h1>
            <p className="text-near-black/50 mb-8">{t('checkout.emptyText')}</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-near-black font-bold font-accent rounded-full hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/20 transition-all duration-300"
            >
              {t('checkout.shopNow')}
            </Link>
          </AnimatedSection>
        </section>
      </>
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const orderLines = items
      .map((item) => {
        const product = getProduct(item.productId)
        if (!product) return null
        return `${item.quantity}x ${t(product.nameKey)} — ${formatPrice(product.price[currency] * item.quantity, currency)}`
      })
      .filter(Boolean)
      .join('\n')

    const emailBody = `New order from ${form.name}\n\n${orderLines}\n\nTotal: ${formatPrice(total, currency)}\n\nShipping to:\n${form.name}\n${form.address}\n${form.zip} ${form.city}\n\nContact: ${form.email}`
    const mailtoLink = `mailto:${SITE.email}?subject=${encodeURIComponent(`CAFO Order from ${form.name}`)}&body=${encodeURIComponent(emailBody)}`

    window.location.href = mailtoLink
    clearCart()
    setStep('confirmed')
  }

  return (
    <>
      <Helmet><title>{t('checkout.title')} — CAFO Energy</title></Helmet>

      <section className="bg-near-black py-20 text-center">
        <AnimatedSection>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading text-white">{t('checkout.title')}</h1>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {['cart', 'details'].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === s ? 'bg-gold text-near-black' :
                  (s === 'cart' && step === 'details') ? 'bg-gold text-near-black' :
                  'bg-white/10 text-white/40'
                }`}>
                  {(s === 'cart' && step === 'details') ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < 1 && <div className={`w-12 h-0.5 ${step === 'details' ? 'bg-gold' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="py-12 bg-warm-white">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 'confirmed' ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-forest" />
                </div>
                <h2 className="text-4xl font-heading text-near-black mb-4">{t('checkout.confirmedTitle')}</h2>
                <p className="text-near-black/50 max-w-md mx-auto mb-8">{t('checkout.confirmedText')}</p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-near-black text-white font-semibold font-accent rounded-full hover:-translate-y-0.5 transition-all"
                >
                  {t('checkout.backHome')}
                </Link>
              </motion.div>
            ) : step === 'cart' ? (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid lg:grid-cols-[1fr_380px] gap-8">
                  {/* Cart items */}
                  <div className="bg-white rounded-3xl border border-near-black/5 p-6 sm:p-8">
                    <h2 className="text-2xl font-heading text-near-black mb-6">{t('checkout.orderSummary')}</h2>
                    <div className="space-y-4">
                      {items.map((item) => {
                        const product = getProduct(item.productId)
                        if (!product) return null
                        return (
                          <div key={item.productId} className="flex items-center gap-4 py-4 border-b border-near-black/5 last:border-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-forest/10 to-forest/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                              <span className="text-forest font-heading text-sm">CAFO</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm font-accent">{t(product.nameKey)}</h3>
                              <p className="text-sm text-near-black/40">{t(product.descriptionKey)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 border border-near-black/10 rounded-full">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="p-1.5 hover:bg-near-black/5 rounded-full transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="p-1.5 hover:bg-near-black/5 rounded-full transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="font-semibold text-sm w-20 text-right">
                                {formatPrice(product.price[currency] * item.quantity, currency)}
                              </span>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="p-1.5 text-near-black/20 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Order total sidebar */}
                  <div className="lg:sticky lg:top-28 h-fit">
                    <div className="bg-white rounded-3xl border border-near-black/5 p-6 sm:p-8 space-y-5">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-near-black/60">
                          <span>{t('checkout.subtotal')}</span>
                          <span>{formatPrice(total, currency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-near-black/60">{t('checkout.shipping')}</span>
                          <span className={freeShipping ? 'text-forest font-medium' : 'text-near-black/60'}>
                            {freeShipping ? t('checkout.free') : t('checkout.calculated')}
                          </span>
                        </div>
                        {!freeShipping && (
                          <p className="text-xs text-near-black/40">
                            {t('cart.freeShipping', { amount: formatPrice(threshold, currency) })}
                          </p>
                        )}
                      </div>
                      <div className="border-t border-near-black/5 pt-5 flex justify-between text-xl font-bold">
                        <span>{t('checkout.total')}</span>
                        <span>{formatPrice(total, currency)}</span>
                      </div>
                      <button
                        onClick={() => setStep('details')}
                        className="w-full py-4 bg-gradient-to-r from-gold to-gold-light text-near-black rounded-2xl font-bold font-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/25 transition-all duration-200 text-lg"
                      >
                        {t('checkout.continue')}
                      </button>
                      <Link
                        to="/shop"
                        className="flex items-center justify-center gap-2 text-sm text-near-black/40 hover:text-near-black transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {t('checkout.continueShopping')}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid lg:grid-cols-[1fr_380px] gap-8">
                  {/* Form */}
                  <div className="bg-white rounded-3xl border border-near-black/5 p-6 sm:p-8">
                    <button
                      onClick={() => setStep('cart')}
                      className="flex items-center gap-2 text-sm text-near-black/40 hover:text-near-black mb-6 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {t('checkout.backToCart')}
                    </button>
                    <h2 className="text-2xl font-heading text-near-black mb-6">{t('checkout.shippingDetails')}</h2>
                    <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium font-accent text-near-black/60 mb-1.5">{t('contact.name')}</label>
                          <input
                            required
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full px-4 py-3 bg-warm-white border border-near-black/10 rounded-xl text-near-black placeholder-near-black/25 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                            placeholder="Anna Svensson"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium font-accent text-near-black/60 mb-1.5">{t('contact.email')}</label>
                          <input
                            required
                            type="email"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            className="w-full px-4 py-3 bg-warm-white border border-near-black/10 rounded-xl text-near-black placeholder-near-black/25 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                            placeholder="anna@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium font-accent text-near-black/60 mb-1.5">{t('checkout.address')}</label>
                        <input
                          required
                          value={form.address}
                          onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                          className="w-full px-4 py-3 bg-warm-white border border-near-black/10 rounded-xl text-near-black placeholder-near-black/25 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                          placeholder="Storgatan 1"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium font-accent text-near-black/60 mb-1.5">{t('checkout.city')}</label>
                          <input
                            required
                            value={form.city}
                            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                            className="w-full px-4 py-3 bg-warm-white border border-near-black/10 rounded-xl text-near-black placeholder-near-black/25 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                            placeholder="Stockholm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium font-accent text-near-black/60 mb-1.5">{t('checkout.zip')}</label>
                          <input
                            required
                            value={form.zip}
                            onChange={e => setForm(f => ({ ...f, zip: e.target.value }))}
                            className="w-full px-4 py-3 bg-warm-white border border-near-black/10 rounded-xl text-near-black placeholder-near-black/25 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                            placeholder="111 22"
                          />
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Summary sidebar */}
                  <div className="lg:sticky lg:top-28 h-fit">
                    <div className="bg-white rounded-3xl border border-near-black/5 p-6 sm:p-8 space-y-4">
                      <h3 className="font-heading text-xl text-near-black">{t('checkout.orderSummary')}</h3>
                      <div className="space-y-3">
                        {items.map((item) => {
                          const product = getProduct(item.productId)
                          if (!product) return null
                          return (
                            <div key={item.productId} className="flex justify-between text-sm">
                              <span className="text-near-black/60">{item.quantity}× {t(product.nameKey)}</span>
                              <span className="font-medium">{formatPrice(product.price[currency] * item.quantity, currency)}</span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="border-t border-near-black/5 pt-4 flex justify-between text-xl font-bold">
                        <span>{t('checkout.total')}</span>
                        <span>{formatPrice(total, currency)}</span>
                      </div>
                      <button
                        type="submit"
                        form="checkout-form"
                        className="w-full py-4 bg-gradient-to-r from-gold to-gold-light text-near-black rounded-2xl font-bold font-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/25 transition-all duration-200 text-lg"
                      >
                        {t('checkout.placeOrder')}
                      </button>
                      <p className="text-xs text-near-black/30 text-center">{t('checkout.instructions')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  )
}
