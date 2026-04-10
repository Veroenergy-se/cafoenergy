import { loadStripe } from '@stripe/stripe-js'
import type { CartItem } from '@/providers/CartProvider'

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

// Map product IDs to Stripe price IDs from env
const PRICE_IDS: Record<string, string> = {
  starter: import.meta.env.VITE_STRIPE_PRICE_STARTER || '',
  duo: import.meta.env.VITE_STRIPE_PRICE_DUO || '',
  family: import.meta.env.VITE_STRIPE_PRICE_FAMILY || '',
}

// Shipping rate IDs from Stripe Dashboard (optional)
// Create these in Stripe Dashboard > Settings > Shipping rates
const SHIPPING_RATE_IDS = (import.meta.env.VITE_STRIPE_SHIPPING_RATES || '')
  .split(',')
  .map((id: string) => id.trim())
  .filter(Boolean)

export function isStripeConfigured(): boolean {
  return STRIPE_KEY.startsWith('pk_') && !STRIPE_KEY.includes('placeholder')
}

export async function redirectToCheckout(items: CartItem[]) {
  if (!isStripeConfigured()) {
    return { error: 'not_configured' as const }
  }

  const stripe = await loadStripe(STRIPE_KEY)
  if (!stripe) {
    return { error: 'load_failed' as const }
  }

  const lineItems = items
    .map((item) => {
      const priceId = PRICE_IDS[item.productId]
      if (!priceId || priceId.includes('test_starter') || priceId.includes('test_duo') || priceId.includes('test_family')) {
        return null
      }
      return { price: priceId, quantity: item.quantity }
    })
    .filter((item): item is { price: string; quantity: number } => item !== null)

  if (lineItems.length === 0) {
    return { error: 'no_prices' as const }
  }

  const checkoutOptions: Parameters<typeof stripe.redirectToCheckout>[0] = {
    lineItems,
    mode: 'payment',
    successUrl: `${window.location.origin}/checkout?success=true`,
    cancelUrl: `${window.location.origin}/shop`,
    // Stripe collects shipping address
    shippingAddressCollection: {
      allowedCountries: [
        'SE', 'NO', 'DK', 'FI', 'DE', 'NL', 'BE', 'FR', 'AT', 'CH',
        'GB', 'IE', 'ES', 'IT', 'PT', 'PL', 'CZ', 'US', 'CA',
      ],
    },
  }

  // Add shipping rates if configured
  if (SHIPPING_RATE_IDS.length > 0) {
    // @ts-expect-error — shipping options supported by Stripe Checkout
    checkoutOptions.shippingOptions = SHIPPING_RATE_IDS.map((id: string) => ({ shippingRate: id }))
  }

  const result = await stripe.redirectToCheckout(checkoutOptions)

  if (result.error) {
    return { error: 'stripe_error' as const, message: result.error.message }
  }

  return { error: null }
}
