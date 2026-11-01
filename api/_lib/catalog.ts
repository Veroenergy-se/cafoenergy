/**
 * Server-side catalog: the only place that decides what a cart line costs.
 *
 * The browser sends which product was chosen, never a price. Everything here
 * is resolved from environment variables so a price change in Stripe never
 * needs a code change.
 *
 * Six prices live on three Stripe products (1 / 2 / 3 boxes), each with a
 * one-time and a monthly price. Create them in the Stripe dashboard and put
 * the price IDs in the environment — see .env.example.
 */

/** Product ids used by the shop front end, in box order. */
export const PRODUCT_BOXES: Record<string, 1 | 2 | 3> = {
  starter: 1,
  duo: 2,
  family: 3,
}

export type Boxes = 1 | 2 | 3

type PriceKind = 'once' | 'sub'

function env(name: string): string {
  return (process.env[name] || '').trim()
}

/** Stripe price id for a given box count and kind, or '' when unconfigured. */
export function priceId(boxes: Boxes, kind: PriceKind): string {
  return env(`STRIPE_PRICE_BOX${boxes}_${kind.toUpperCase()}`)
}

/**
 * How many boxes a cart line represents.
 *
 * A one-time line takes it from the product. A subscription takes it from the
 * first month of the chosen plan, because the shop prices subscriptions by
 * boxes per month rather than by product.
 */
export function boxesFor(item: { productId: string; subscription: boolean; monthlyPlan?: number[] }): Boxes | null {
  if (item.subscription) {
    const first = item.monthlyPlan?.[0]
    if (first === 1 || first === 2 || first === 3) return first
    return PRODUCT_BOXES[item.productId] ?? null
  }
  return PRODUCT_BOXES[item.productId] ?? null
}

/** Shipping rate ids. Both optional: with neither set, Stripe collects an address and shows no rate. */
export const shippingRates = {
  standard: () => env('STRIPE_SHIPPING_RATE_STANDARD'),
  free: () => env('STRIPE_SHIPPING_RATE_FREE'),
}

/**
 * Boxes needed for free shipping on a one-time order. Subscriptions always
 * ship free. Defaults to 3, which is the conservative setting while real
 * carrier quotes are outstanding — lower it to 2 once postage is known.
 */
export function freeShippingFromBoxes(): number {
  const raw = Number(env('FREE_SHIPPING_FROM_BOXES'))
  return Number.isFinite(raw) && raw > 0 ? raw : 3
}

/** Countries the shop will ship to. */
export const SHIPPING_COUNTRIES = ['SE', 'NO', 'DK', 'FI'] as const
