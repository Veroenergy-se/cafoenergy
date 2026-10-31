export const SITE = {
  name: 'MOAR Bar',
  // Legal entity shown in the footer and legal pages. Fill in orgNumber and
  // address (required for Swedish online shops); empty values are hidden.
  company: { name: 'MOAR Focus AB', orgNumber: '559604-9105', address: 'Götavägen 18, 182 61 Djursholm, Sweden' },
  domain: 'moarbar.se',
  email: 'thomaswiseman1@hotmail.com',
  ga4Id: 'G-JWFPL9ZW9R',
  social: {
    instagram: 'https://www.instagram.com/moarbars',
    tiktok: 'https://www.tiktok.com/@moarbars',
  },
  freeShippingThreshold: { usd: 50, sek: 499 },
  // First sales (Swedish time). Drives the countdown under the waitlist form.
  launchDate: '2026-11-15T00:00:00+01:00',
  // Hero film (public/videos). Phones get an upright cut; posters show while it loads.
  heroVideo: '/videos/hero.mp4',
  heroVideoMobile: '/videos/hero-mobile.mp4',
  heroPoster: '/images/hero-poster.jpg',
  heroPosterMobile: '/images/hero-poster-mobile.jpg',
}
