import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/providers/CartProvider'
import { getCurrency, formatPrice, itemUnitPrice } from '@/lib/products'
import { SITE } from '@/lib/constants'
import { isStripeConfigured, redirectToCheckout } from '@/lib/stripe'
import { X, Loader2 } from 'lucide-react'

export default function CartDrawer() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { items, isOpen, setOpen, removeItem, updateQuantity, cartTotal, getProduct } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const currency = getCurrency(i18n.language)
  const threshold = SITE.freeShippingThreshold[currency]
  const total = cartTotal(currency)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-brown/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-off-white text-brown z-50 shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b-[3px] border-brown">
              <h2 className="font-display uppercase text-2xl leading-none">{t('cart.title')}</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label={t('shopPage.close')}
                className="p-2 hover:bg-brown/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  className="flex flex-col items-start justify-center h-full"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <p className="font-display uppercase text-[2.2rem] leading-[0.95]">{t('cart.empty')}</p>
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="mt-6 inline-block bg-brown text-off-white px-7 py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform"
                  >
                    {t('cart.emptyCta')} →
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {items.map((item, i) => {
                      const product = getProduct(item.productId)
                      if (!product) return null
                      return (
                        <motion.div
                          key={item.productId}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.05 }}
                          className="flex gap-4"
                        >
                          <img src={product.image} alt="" className="w-20 h-20 object-contain shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display uppercase text-base leading-tight">{t(product.nameKey)}</h3>
                              {item.subscription && (
                                <span className="font-accent text-[10px] font-bold uppercase tracking-[0.14em] bg-caforange text-brown px-2 py-1">
                                  {t('cart.monthly')}
                                </span>
                              )}
                            </div>
                            <p className="text-sm opacity-65">{t(product.descriptionKey)}</p>
                            <p className="font-display mt-1.5">
                              {formatPrice(
                                itemUnitPrice(item, product, currency),
                                currency
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="font-accent text-xs uppercase tracking-[0.14em] opacity-60 hover:opacity-100 underline underline-offset-4"
                            >
                              {t('cart.remove')}
                            </button>
                            <div className="flex items-center border-[2px] border-brown">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                aria-label="−1"
                                className="w-8 h-8 font-display hover:bg-brown/10 transition-colors"
                              >
                                −
                              </button>
                              <span className="text-sm font-semibold w-7 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                aria-label="+1"
                                className="w-8 h-8 font-display hover:bg-brown/10 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <motion.div
                className="border-t-[3px] border-brown p-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <p className="font-accent text-sm">
                    {total < threshold
                      ? t('cart.freeShipping', { amount: formatPrice(threshold - total, currency) })
                      : t('cart.freeShippingDone')}
                  </p>
                  <div className="mt-2 h-1.5 bg-brown/15">
                    <div className="h-full bg-caforange transition-[width] duration-500" style={{ width: `${Math.min(100, (total / threshold) * 100)}%` }} />
                  </div>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-display uppercase text-lg">{t('cart.subtotal')}</span>
                  <span className="font-display text-2xl">{formatPrice(total, currency)}</span>
                </div>
                {checkoutError && (
                  <p className="text-sm text-center text-red-700">{checkoutError}</p>
                )}
                {isStripeConfigured() ? (
                  <button
                    onClick={async () => {
                      setCheckingOut(true)
                      setCheckoutError(null)
                      const result = await redirectToCheckout(items)
                      if (result.error) {
                        setCheckoutError(
                          result.error === 'no_prices'
                            ? t('cart.noPrices')
                            : result.error === 'stripe_error'
                              ? (result as { message?: string }).message || 'Checkout failed'
                              : 'Checkout failed'
                        )
                        setCheckingOut(false)
                      }
                    }}
                    disabled={checkingOut}
                    className="w-full py-5 bg-brown text-off-white font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {checkingOut ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('cart.processing')}
                      </>
                    ) : (
                      t('cart.checkout')
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setOpen(false)
                      navigate('/checkout')
                    }}
                    className="w-full py-5 bg-brown text-off-white font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
                  >
                    {t('cart.checkout')}
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
