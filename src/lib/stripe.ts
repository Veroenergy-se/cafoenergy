import type { CartItem } from '@/providers/CartProvider'

/**
 * Checkout runs through /api/checkout, which creates the Stripe Checkout
 * Session server-side and returns its URL. Prices live in Stripe and are
 * chosen on the server, so nothing here can be tampered with in the browser.
 *
 * Requires a host that can run serverless functions. GitHub Pages cannot.
 */

/**
 * Whether to show the Stripe checkout button rather than the manual
 * order form. Off unless VITE_CHECKOUT_ENABLED is 'true', so the site can
 * ship ahead of the endpoint being live.
 */
export function isStripeConfigured(): boolean {
  return import.meta.env.VITE_CHECKOUT_ENABLED === 'true'
}

type CheckoutResult =
  | { error: null }
  | { error: 'not_configured' | 'no_prices' | 'empty_cart' | 'network' }
  | { error: 'stripe_error'; message?: string }

export async function redirectToCheckout(
  items: CartItem[],
  locale = 'sv',
): Promise<CheckoutResult> {
  if (!isStripeConfigured()) {
    return { error: 'not_configured' }
  }
  if (items.length === 0) {
    return { error: 'empty_cart' }
  }

  let response: Response
  try {
    response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locale,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          subscription: item.subscription,
          monthlyPlan: item.monthlyPlan,
          gift: item.gift,
        })),
      }),
    })
  } catch {
    return { error: 'network' }
  }

  let data: { url?: string; error?: string; message?: string } = {}
  try {
    data = await response.json()
  } catch {
    return { error: 'stripe_error' }
  }

  if (!response.ok || !data.url) {
    if (data.error === 'no_prices') return { error: 'no_prices' }
    if (data.error === 'empty_cart') return { error: 'empty_cart' }
    return { error: 'stripe_error', message: data.message }
  }

  window.location.href = data.url
  return { error: null }
}

/**
 * Opens the Stripe customer portal for the subscription just purchased.
 * Takes the session_id handed back on the success redirect.
 */
export async function openCustomerPortal(sessionId: string): Promise<{ error: string | null }> {
  try {
    const response = await fetch('/api/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    const data: { url?: string; error?: string } = await response.json()
    if (!response.ok || !data.url) return { error: data.error || 'portal_failed' }
    window.location.href = data.url
    return { error: null }
  } catch {
    return { error: 'network' }
  }
}
