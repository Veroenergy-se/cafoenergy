import type { VercelRequest, VercelResponse } from '@vercel/node'
import { stripe, siteOrigin } from './_lib/stripe.js'

/**
 * Opens the Stripe customer portal, where a subscriber can change the number
 * of boxes, pause, or cancel.
 *
 * Access is granted by a Checkout Session id, which only the person who just
 * completed that checkout holds. Taking an email address instead would let
 * anyone open anyone else's billing portal, so that is deliberately not an
 * option here. For subscribers returning later, Stripe's own subscription
 * emails can carry a portal link — configure that in the dashboard.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  let body: { sessionId?: unknown }
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})
  } catch {
    return res.status(400).json({ error: 'bad_request' })
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
  if (!sessionId.startsWith('cs_')) {
    return res.status(400).json({ error: 'bad_session' })
  }

  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId)
    const customer = typeof session.customer === 'string' ? session.customer : session.customer?.id
    if (!customer) {
      return res.status(404).json({ error: 'no_customer' })
    }

    const portal = await stripe().billingPortal.sessions.create({
      customer,
      return_url: `${siteOrigin(req)}/checkout`,
    })
    return res.status(200).json({ url: portal.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    console.error('portal session failed:', message)
    return res.status(500).json({ error: 'stripe_error' })
  }
}
