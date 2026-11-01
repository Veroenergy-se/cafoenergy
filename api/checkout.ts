import type { VercelRequest, VercelResponse } from '@vercel/node'
import type Stripe from 'stripe'
import { stripe, siteOrigin } from './_lib/stripe.js'
import {
  boxesFor,
  priceId,
  shippingRates,
  freeShippingFromBoxes,
  SHIPPING_COUNTRIES,
} from './_lib/catalog.js'

/** What the browser is allowed to send. Prices are never taken from the client. */
interface IncomingItem {
  productId?: unknown
  quantity?: unknown
  subscription?: unknown
  monthlyPlan?: unknown
  gift?: unknown
}

const MAX_QUANTITY = 10

function clampQuantity(value: unknown): number {
  const n = Math.floor(Number(value))
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(n, MAX_QUANTITY)
}

function monthlyPlanOf(value: unknown): number[] | undefined {
  if (!Array.isArray(value)) return undefined
  const plan = value.slice(0, 12).map((n) => Math.max(0, Math.floor(Number(n)) || 0))
  return plan.length ? plan : undefined
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  let body: { items?: IncomingItem[]; locale?: string }
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})
  } catch {
    return res.status(400).json({ error: 'bad_request' })
  }

  const incoming = Array.isArray(body.items) ? body.items.slice(0, 20) : []
  if (incoming.length === 0) {
    return res.status(400).json({ error: 'empty_cart' })
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  let totalBoxes = 0
  let hasSubscription = false
  let planMetadata: string | undefined
  let giftMetadata: string | undefined

  for (const raw of incoming) {
    const item = {
      productId: String(raw.productId ?? ''),
      subscription: raw.subscription === true,
      monthlyPlan: monthlyPlanOf(raw.monthlyPlan),
    }

    const boxes = boxesFor(item)
    if (!boxes) continue

    const price = priceId(boxes, item.subscription ? 'sub' : 'once')
    if (!price) continue

    // A subscription is one plan, never a multiple.
    const quantity = item.subscription ? 1 : clampQuantity(raw.quantity)

    lineItems.push({ price, quantity })
    totalBoxes += boxes * quantity

    if (item.subscription) {
      hasSubscription = true
      if (item.monthlyPlan) planMetadata = item.monthlyPlan.join(',')
    }

    if (raw.gift && typeof raw.gift === 'object') {
      const gift = raw.gift as { name?: unknown; message?: unknown }
      giftMetadata = JSON.stringify({
        name: String(gift.name ?? '').slice(0, 120),
        message: String(gift.message ?? '').slice(0, 400),
      })
    }
  }

  if (lineItems.length === 0) {
    return res.status(400).json({ error: 'no_prices' })
  }

  // Subscriptions ship free. One-time orders ship free from the configured
  // box count and otherwise pay the standard rate.
  const freeRate = shippingRates.free()
  const standardRate = shippingRates.standard()
  const shipsFree = hasSubscription || totalBoxes >= freeShippingFromBoxes()
  const chosenRate = shipsFree ? freeRate : standardRate

  const origin = siteOrigin(req)
  const locale = body.locale === 'en' ? 'en' : 'sv'

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: hasSubscription ? 'subscription' : 'payment',
    line_items: lineItems,
    locale,
    success_url: `${origin}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop`,
    shipping_address_collection: { allowed_countries: [...SHIPPING_COUNTRIES] },
    automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
    metadata: {
      boxes: String(totalBoxes),
      ...(planMetadata ? { monthlyPlan: planMetadata } : {}),
      ...(giftMetadata ? { gift: giftMetadata } : {}),
    },
  }

  if (chosenRate) {
    params.shipping_options = [{ shipping_rate: chosenRate }]
  }

  // Carry the plan onto the subscription itself so it is visible in Stripe
  // and available to the portal later.
  if (hasSubscription && planMetadata) {
    params.subscription_data = { metadata: { monthlyPlan: planMetadata } }
  }

  try {
    const session = await stripe().checkout.sessions.create(params)
    if (!session.url) return res.status(502).json({ error: 'no_session_url' })
    return res.status(200).json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    console.error('checkout session failed:', message)
    return res.status(500).json({ error: 'stripe_error', message })
  }
}
