/**
 * Stripe payment links — one per purchasable option.
 *
 * Each link is a prepared Stripe checkout page for one fixed basket, so the
 * shop sends the customer straight to the one matching their choice. There is
 * no cart and no server: the box count and the mode decide the link.
 *
 * To change a price, edit the price in Stripe. These URLs stay the same.
 * To add a flavour or a box size, create the link in Stripe and add it here.
 */

/**
 * Whether the shop can take money yet.
 *
 * False until there is stock to ship: the buy buttons send people to the
 * waitlist instead of to Stripe, and their labels change to match. Flip to
 * true on the day the first boxes are ready and the shop is open.
 */
export const CHECKOUT_OPEN = false

/**
 * Options that already go to Stripe while the rest of the shop is closed,
 * so the payment link can be tried end to end. Empty this to close them again.
 */
const OPEN_EARLY: { mode: CheckoutMode; boxes: BoxCount }[] = [{ mode: 'onetime', boxes: 1 }]

export type CheckoutMode = 'onetime' | 'subscription'
export type BoxCount = 1 | 2 | 3

const LINKS: Record<CheckoutMode, Record<BoxCount, string>> = {
  onetime: {
    1: 'https://buy.stripe.com/bJebJ1dXscrl5TxfjLcMM02',
    2: 'https://buy.stripe.com/8x200jaLg2QL4Pt7RjcMM03',
    3: 'https://buy.stripe.com/5kQdR9g5A3UPbdRdbDcMM05',
  },
  subscription: {
    1: 'https://buy.stripe.com/eVq28rbPk0ID0zd6NfcMM01',
    2: 'https://buy.stripe.com/3cIdR95qWajd3Lp9ZrcMM04',
    3: 'https://buy.stripe.com/00w3cv6v0bnh3Lp4F7cMM06',
  },
}

/** Maps the shop's product ids to a box count. */
export const PRODUCT_BOXES: Record<string, BoxCount> = {
  starter: 1,
  duo: 2,
  family: 3,
}

/** Whether this option can be bought now (the whole shop, or an early option). */
export function isCheckoutOpen(mode: CheckoutMode, boxes: BoxCount): boolean {
  return CHECKOUT_OPEN || OPEN_EARLY.some((o) => o.mode === mode && o.boxes === boxes)
}

export function checkoutUrl(mode: CheckoutMode, boxes: BoxCount): string {
  return LINKS[mode][boxes]
}

/** Scrolls to the waitlist form and puts the cursor in the email field. */
export function goToWaitlist(): void {
  const section = document.getElementById('waitlist')
  if (!section) {
    window.location.hash = 'waitlist'
    return
  }
  section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const email = section.querySelector<HTMLInputElement>('input[type="email"]')
  if (email) window.setTimeout(() => email.focus({ preventScroll: true }), 600)
}

/**
 * Sends the customer to Stripe for this option — or to the waitlist while
 * the shop is closed.
 */
export function goToCheckout(mode: CheckoutMode, boxes: BoxCount): void {
  if (!isCheckoutOpen(mode, boxes)) {
    goToWaitlist()
    return
  }
  const url = checkoutUrl(mode, boxes)
  if (url) window.location.href = url
}
