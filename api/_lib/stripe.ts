import Stripe from 'stripe'

let client: Stripe | null = null

/** The Stripe client, created once per warm function instance. */
export function stripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    client = new Stripe(key)
  }
  return client
}

/** The site's own origin, used to build return URLs. */
export function siteOrigin(req: { headers: Record<string, string | string[] | undefined> }): string {
  const configured = (process.env.SITE_ORIGIN || '').trim().replace(/\/$/, '')
  if (configured) return configured
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const h = Array.isArray(host) ? host[0] : host
  const p = Array.isArray(proto) ? proto[0] : proto
  return h ? `${p}://${h}` : 'https://moarbar.se'
}
