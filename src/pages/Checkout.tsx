import { useState, useEffect, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/providers/CartProvider'
import { getCurrency, formatPrice, itemUnitPrice } from '@/lib/products'
import { SITE } from '@/lib/constants'

const field =
  'w-full bg-transparent border-[3px] border-fg px-4 py-3.5 font-accent text-base text-fg placeholder:text-fg/40 focus:outline-none focus:border-accent transition-colors'
const label = 'block font-accent text-xs uppercase tracking-[0.18em] font-semibold mb-2'
const primary =
  'w-full bg-brown text-off-white px-7 py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform'

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
        <Helmet><title>{t('checkout.title')} — MOAR Bar</title></Helmet>
        <section data-tone="cream" className="text-fg min-h-[75vh] grid items-center pt-32 pb-20">
          <div className="page-container">
            <h1 className="font-display uppercase leading-[0.92] text-[clamp(2.6rem,9vw,8rem)] max-w-[12ch]">{t('checkout.emptyTitle')}</h1>
            <p className="mt-6 font-accent text-[clamp(16px,1.5vw,20px)]">{t('checkout.emptyText')}</p>
            <Link to="/shop" className="mt-9 inline-block bg-brown text-off-white px-7 py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform">
              {t('checkout.shopNow')} →
            </Link>
          </div>
        </section>
      </>
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const hasSubscription = items.some(i => i.subscription)

    const orderLines = items
      .map((item) => {
        const product = getProduct(item.productId)
        if (!product) return null
        const unitPrice = itemUnitPrice(item, product, currency)
        const tag = item.subscription ? ' [MONTHLY SUBSCRIPTION]' : ''
        return `${item.quantity}x ${t(product.nameKey)}${tag} — ${formatPrice(unitPrice * item.quantity, currency)}`
      })
      .filter(Boolean)
      .join('\n')

    const planNote = items
      .filter(i => i.subscription && i.monthlyPlan)
      .map((item) => {
        const product = getProduct(item.productId)
        if (!product) return null
        const BOX_BARS: Record<number, number> = { 1: 12, 2: 24, 3: 36 }
        const months = item.monthlyPlan!.map((boxes, i) => `Month ${i + 1}: ${boxes === 0 ? 'skip' : `${boxes} box${boxes > 1 ? 'es' : ''} (${BOX_BARS[boxes] ?? boxes * 12} bars)`}`).join(', ')
        return `Plan for ${t(product.nameKey)}: ${months}`
      })
      .filter(Boolean)
      .join('\n')

    const subscriptionNote = hasSubscription
      ? `\n\n⚡ SUBSCRIPTION ORDER — please set up recurring monthly delivery for the items marked above.${planNote ? `\n\nMonthly plan:\n${planNote}` : ''}`
      : ''

    const giftNote = items
      .filter(i => i.gift && (i.gift.name || i.gift.message))
      .map(i => `🎁 GIFT (${t(getProduct(i.productId)?.nameKey ?? '')}) for ${i.gift!.name || '—'}: "${i.gift!.message || ''}"`)
      .join('\n')

    const emailBody = `New order from ${form.name}\n\n${orderLines}\n\nTotal: ${formatPrice(total, currency)}${subscriptionNote}${giftNote ? `\n\n${giftNote}` : ''}\n\nShipping to:\n${form.name}\n${form.address}\n${form.zip} ${form.city}\n\nContact: ${form.email}`
    const subject = hasSubscription
      ? `MOAR Subscription Order from ${form.name}`
      : `MOAR Order from ${form.name}`
    const mailtoLink = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`

    window.location.href = mailtoLink
    clearCart()
    setStep('confirmed')
  }

  const steps = ['cart', 'details'] as const
  const stepIndex = step === 'details' ? 1 : 0
  const inputs: { key: keyof typeof form; label: string; type?: string; ph: string; auto: string; wide?: boolean }[] = [
    { key: 'name', label: t('contact.name'), ph: 'Anna Svensson', auto: 'name' },
    { key: 'email', label: t('contact.email'), type: 'email', ph: 'anna@example.com', auto: 'email' },
    { key: 'address', label: t('checkout.address'), ph: 'Storgatan 1', auto: 'street-address', wide: true },
    { key: 'zip', label: t('checkout.zip'), ph: '111 22', auto: 'postal-code' },
    { key: 'city', label: t('checkout.city'), ph: 'Stockholm', auto: 'address-level2' },
  ]

  const summary = (
    <div className="lg:sticky lg:top-28 h-fit border-[3px] border-fg p-6 sm:p-8">
      <div className="space-y-3 font-accent text-[15px]">
        {step === 'details' && items.map((item) => {
          const product = getProduct(item.productId)
          if (!product) return null
          return (
            <div key={item.productId} className="flex justify-between gap-4">
              <span className="opacity-75">{item.quantity}× {t(product.nameKey)}</span>
              <span>{formatPrice(itemUnitPrice(item, product, currency) * item.quantity, currency)}</span>
            </div>
          )
        })}
        <div className="flex justify-between">
          <span className="opacity-75">{t('checkout.shipping')}</span>
          <span className={freeShipping ? 'text-accent font-semibold' : 'opacity-75'}>
            {freeShipping ? t('checkout.free') : t('checkout.calculated')}
          </span>
        </div>
        {!freeShipping && (
          <p className="text-[13px] opacity-60">{t('cart.freeShipping', { amount: formatPrice(threshold - total, currency) })}</p>
        )}
      </div>
      <div className="mt-5 pt-5 border-t-[3px] border-fg flex justify-between items-baseline">
        <span className="font-display uppercase text-lg">{t('checkout.total')}</span>
        <span className="font-display text-[clamp(1.6rem,3vw,2.2rem)]">{formatPrice(total, currency)}</span>
      </div>
      {step === 'cart' ? (
        <>
          <button onClick={() => setStep('details')} className={`${primary} mt-6`}>{t('checkout.continue')} →</button>
          <Link to="/shop" className="mt-4 block text-center font-accent text-sm opacity-70 hover:opacity-100">← {t('checkout.continueShopping')}</Link>
        </>
      ) : (
        <>
          <button type="submit" form="checkout-form" className={`${primary} mt-6`}>{t('checkout.placeOrder')} →</button>
          <p className="mt-4 text-[13px] text-center opacity-70">{t('checkout.instructions')}</p>
          <p className="mt-2 text-[13px] text-center opacity-70">
            {t('checkout.agreePrefix')}{' '}
            <Link to="/terms" className="underline hover:text-accent">{t('footer.terms').toLowerCase()}</Link>{' '}
            {t('checkout.agreeAnd')}{' '}
            <Link to="/privacy-policy" className="underline hover:text-accent">{t('footer.privacy').toLowerCase()}</Link>.
          </p>
        </>
      )}
    </div>
  )

  return (
    <>
      <Helmet><title>{t('checkout.title')} — MOAR Bar</title></Helmet>

      <section data-tone="cream" className="text-fg pt-32 pb-24 lg:pt-40 min-h-[80vh]">
        <div className="page-container">
          <AnimatePresence mode="wait">
            {step === 'confirmed' ? (
              <motion.div key="confirmed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-10">
                <h1 className="font-display uppercase leading-[0.92] text-[clamp(2.6rem,9vw,8rem)]">
                  <span className="text-accent">{t('checkout.confirmedTitle')}</span>
                </h1>
                <p className="mt-6 max-w-[44ch] font-accent text-[clamp(16px,1.5vw,20px)] leading-relaxed">{t('checkout.confirmedText')}</p>
                <Link to="/" className="mt-9 inline-block bg-brown text-off-white px-7 py-5 font-accent text-sm uppercase tracking-[0.14em] font-semibold hover:-translate-y-0.5 transition-transform">
                  {t('checkout.backHome')} →
                </Link>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <h1 className="font-display uppercase leading-[0.92] text-[clamp(2.6rem,8vw,7rem)]">
                    {step === 'cart' ? t('checkout.orderSummary') : t('checkout.shippingDetails')}
                  </h1>
                  <ol className="flex gap-2 font-accent text-xs uppercase tracking-[0.18em] font-semibold" aria-label={t('checkout.title')}>
                    {steps.map((s, i) => (
                      <li key={s} className={`px-3 py-2 border-[3px] ${i <= stepIndex ? 'bg-accent border-accent text-brown' : 'border-fg/30 opacity-60'}`}>
                        {i + 1} · {s === 'cart' ? t('checkout.orderSummary') : t('checkout.shippingDetails')}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-12 grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-start">
                  {step === 'cart' ? (
                    <div className="border-t-[3px] border-fg">
                      {items.map((item) => {
                        const product = getProduct(item.productId)
                        if (!product) return null
                        return (
                          <div key={item.productId} className="flex items-center gap-4 sm:gap-6 py-5 border-b-[1.5px] border-fg/25">
                            <img src={product.image} alt="" className="w-20 h-20 sm:w-24 sm:h-24 object-contain shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-display uppercase text-[clamp(1rem,1.8vw,1.3rem)] leading-tight">{t(product.nameKey)}</h3>
                                {item.subscription && (
                                  <span className="font-accent text-[10px] font-bold uppercase tracking-[0.14em] bg-accent text-brown px-2 py-1">{t('cart.monthly')}</span>
                                )}
                              </div>
                              <p className="mt-1 font-accent text-sm opacity-65">{t(product.descriptionKey)}</p>
                              <div className="mt-3 flex items-center gap-4">
                                <div className="flex items-center border-[2px] border-fg">
                                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 font-display hover:bg-fg/10" aria-label="−1">−</button>
                                  <span className="w-8 text-center font-accent font-semibold text-sm">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 font-display hover:bg-fg/10" aria-label="+1">+</button>
                                </div>
                                <button onClick={() => removeItem(item.productId)} className="font-accent text-xs uppercase tracking-[0.14em] opacity-60 hover:opacity-100 underline underline-offset-4">
                                  {t('cart.remove')}
                                </button>
                              </div>
                            </div>
                            <span className="font-display text-[clamp(1rem,1.8vw,1.3rem)] whitespace-nowrap">
                              {formatPrice(itemUnitPrice(item, product, currency) * item.quantity, currency)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => setStep('cart')} className="mb-6 font-accent text-sm opacity-70 hover:opacity-100">← {t('checkout.backToCart')}</button>
                      <form onSubmit={handleSubmit} id="checkout-form" className="grid sm:grid-cols-2 gap-5">
                        {inputs.map((f) => (
                          <label key={f.key} className={f.wide ? 'sm:col-span-2' : ''}>
                            <span className={label}>{f.label}</span>
                            <input
                              required
                              type={f.type ?? 'text'}
                              autoComplete={f.auto}
                              value={form[f.key]}
                              onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                              placeholder={f.ph}
                              className={field}
                            />
                          </label>
                        ))}
                      </form>
                    </div>
                  )}
                  {summary}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
