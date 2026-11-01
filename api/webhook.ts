import type { VercelRequest, VercelResponse } from '@vercel/node'
import type Stripe from 'stripe'
import { stripe } from './_lib/stripe.js'

/** Stripe signs the raw body, so it must not be parsed before verification. */
export const config = { api: { bodyParser: false } }

/**
 * The exact bytes Stripe signed. Reads the stream when the body parser is
 * off, and falls back to whatever the parser left behind if the platform
 * ignored the config above — the signature check fails loudly either way
 * rather than silently accepting an unverified payload.
 */
function rawBody(req: VercelRequest): Promise<Buffer> {
  const parsed = (req as { body?: unknown }).body
  if (Buffer.isBuffer(parsed)) return Promise.resolve(parsed)
  if (typeof parsed === 'string') return Promise.resolve(Buffer.from(parsed, 'utf8'))

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function describeOrder(session: Stripe.Checkout.Session): string {
  const lines = [
    `Order ${session.id}`,
    `Mode: ${session.mode}`,
    `Total: ${((session.amount_total ?? 0) / 100).toFixed(2)} ${(session.currency ?? 'sek').toUpperCase()}`,
    `Email: ${session.customer_details?.email ?? 'unknown'}`,
    `Name: ${session.customer_details?.name ?? 'unknown'}`,
  ]
  // Stripe moved shipping_details under collected_information; accept either.
  const loose = session as unknown as {
    collected_information?: { shipping_details?: { address?: Record<string, string | null> } }
    shipping_details?: { address?: Record<string, string | null> }
  }
  const shipping = loose.collected_information?.shipping_details ?? loose.shipping_details ?? null
  if (shipping?.address) {
    const a = shipping.address
    lines.push(`Ship to: ${[a.line1, a.line2, a.postal_code, a.city, a.country].filter(Boolean).join(', ')}`)
  }
  if (session.metadata?.boxes) lines.push(`Boxes: ${session.metadata.boxes}`)
  if (session.metadata?.monthlyPlan) lines.push(`Plan: ${session.metadata.monthlyPlan}`)
  if (session.metadata?.gift) lines.push(`Gift: ${session.metadata.gift}`)
  return lines.join('\n')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = req.headers['stripe-signature']
  if (!secret || typeof signature !== 'string') {
    return res.status(400).json({ error: 'not_configured' })
  }

  let event: Stripe.Event
  try {
    const body = await rawBody(req)
    event = stripe().webhooks.constructEvent(body, signature, secret)
  } catch (err) {
    // A failed signature check is the expected response to a forged request.
    console.error('webhook signature rejected:', err instanceof Error ? err.message : 'unknown')
    return res.status(400).json({ error: 'bad_signature' })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      // The order log. Replace with an email or a sheet once fulfilment is real.
      console.log('NEW ORDER\n' + describeOrder(session))
      break
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object
      console.log(`SUBSCRIPTION ${event.type}: ${sub.id} status=${sub.status}`)
      break
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object
      console.log(`PAYMENT FAILED: invoice ${invoice.id} for ${invoice.customer_email ?? 'unknown'}`)
      break
    }
    default:
      break
  }

  // Always acknowledge: an unhandled event is not an error, and Stripe retries non-2xx.
  return res.status(200).json({ received: true })
}
