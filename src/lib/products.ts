export interface Product {
  id: string
  nameKey: string
  descriptionKey: string
  barCount: number
  price: { usd: number; sek: number }
  originalPrice?: { usd: number; sek: number }
  badge?: string
  image: string
}

export const products: Product[] = [
  {
    id: 'starter',
    nameKey: 'products.starter.name',
    descriptionKey: 'products.starter.description',
    barCount: 12,
    price: { usd: 29, sek: 279 },
    image: '/images/product-1box.png',
  },
  {
    id: 'duo',
    nameKey: 'products.duo.name',
    descriptionKey: 'products.duo.description',
    barCount: 24,
    price: { usd: 54, sek: 519 },
    originalPrice: { usd: 58, sek: 558 },
    badge: 'products.bestseller',
    image: '/images/product-2box.png',
  },
  {
    id: 'family',
    nameKey: 'products.family.name',
    descriptionKey: 'products.family.description',
    barCount: 36,
    price: { usd: 75, sek: 719 },
    originalPrice: { usd: 87, sek: 838 },
    badge: 'products.discount',
    image: '/images/product-3box.png',
  },
]

export const SUBSCRIPTION_DISCOUNT = 0.15

export function getSubscriptionDiscount(boxes: number): number {
  if (boxes >= 3) return 0.20
  if (boxes >= 2) return 0.15
  return 0.10
}

export function getSubscriptionPrice(amount: number, boxes = 1): number {
  return Math.round(amount * (1 - getSubscriptionDiscount(boxes)))
}

export function getCurrency(_lang: string): 'usd' | 'sek' {
  return 'sek'
}

export function formatPrice(amount: number, currency: 'usd' | 'sek'): string {
  if (currency === 'sek') return `${amount} kr`
  return `$${amount}`
}
