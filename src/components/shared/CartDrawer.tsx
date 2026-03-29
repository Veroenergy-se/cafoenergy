import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/providers/CartProvider'
import { getCurrency, formatPrice } from '@/lib/products'
import { SITE } from '@/lib/constants'
import { isStripeConfigured, redirectToCheckout } from '@/lib/stripe'
import { X, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react'

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
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold font-accent flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                {t('cart.title')}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full text-gray-400"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <ShoppingBag className="w-12 h-12 mb-4" />
                  <p className="text-lg">{t('cart.empty')}</p>
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
                          <div className="w-20 h-20 bg-gradient-to-br from-forest/10 to-forest/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-forest font-heading text-lg">CAFO</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">{t(product.nameKey)}</h3>
                            <p className="text-sm text-gray-500">{t(product.descriptionKey)}</p>
                            <p className="font-semibold mt-1">{formatPrice(product.price[currency], currency)}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                            >
                              {t('cart.remove')}
                            </button>
                            <div className="flex items-center gap-2 border border-gray-200 rounded-full">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Plus className="w-3 h-3" />
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
                className="border-t border-gray-100 p-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {total < threshold && (
                  <p className="text-sm text-center text-gray-500">
                    {t('cart.freeShipping', { amount: formatPrice(threshold, currency) })}
                  </p>
                )}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatPrice(total, currency)}</span>
                </div>
                {checkoutError && (
                  <p className="text-sm text-center text-red-500">{checkoutError}</p>
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
                    className="w-full py-4 bg-gradient-to-r from-gold to-gold-light text-near-black rounded-2xl font-bold font-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/25 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
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
                    className="w-full py-4 bg-gradient-to-r from-gold to-gold-light text-near-black rounded-2xl font-bold font-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/25 transition-all duration-200 flex items-center justify-center gap-2"
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
