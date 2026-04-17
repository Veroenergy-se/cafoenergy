export interface Product {
  id: string
  nameKey: string
  descriptionKey: string
  barCount: number
  price: { usd: number; sek: number }
  originalPrice?: { usd: number; sek: number }
  badge?: string
}

export const products: Product[] = [
  {
    id: 'starter',
    nameKey: 'products.starter.name',
    descriptionKey: 'products.starter.description',
    barCount: 12,
    price: { usd: 29, sek: 279 },
  },
  {
    id: 'duo',
    nameKey: 'products.duo.name',
    descriptionKey: 'products.duo.description',
    barCount: 24,
    price: { usd: 54, sek: 519 },
    originalPrice: { usd: 58, sek: 558 },
    badge: 'products.bestseller',
  },
  {
    id: 'family',
    nameKey: 'products.family.name',
    descriptionKey: 'products.family.description',
    barCount: 36,
    price: { usd: 75, sek: 719 },
    originalPrice: { usd: 87, sek: 838 },
    badge: 'products.discount',
  },
]

export const SUBSCRIPTION_DISCOUNT = 0.15

export function getSubscriptionPrice(amount: number): number {
  return Math.round(amount * (1 - SUBSCRIPTION_DISCOUNT))
}

export function getCurrency(_lang: string): 'usd' | 'sek' {
  return 'sek'
}

export function formatPrice(amount: number, currency: 'usd' | 'sek'): string {
  if (currency === 'sek') return `${amount} kr`
  return `$${amount}`
}
