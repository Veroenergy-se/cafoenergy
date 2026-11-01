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

export function checkoutUrl(mode: CheckoutMode, boxes: BoxCount): string {
  return LINKS[mode][boxes]
}

/** Sends the customer to Stripe for this option. */
export function goToCheckout(mode: CheckoutMode, boxes: BoxCount): void {
  const url = checkoutUrl(mode, boxes)
  if (url) window.location.href = url
}
