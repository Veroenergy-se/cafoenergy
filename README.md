# CAFO Energy Website

The official website for CAFO Energy — the clean caffeinated protein bar.

**Live site:** [cafoenergy.se](https://cafoenergy.se)

## Tech Stack

- **Vite** + **React** + **TypeScript** — fast builds, modern DX
- **Tailwind CSS** — utility-first styling with custom brand tokens
- **Framer Motion** — scroll animations and transitions
- **react-i18next** — full internationalization (English + Swedish)
- **react-router-dom** — client-side routing
- **react-helmet-async** — SEO meta tags per page
- **Lucide React** — icons

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. To preview the production build locally:

```bash
npx serve dist
```

## Project Structure

```
src/
  app.tsx            — Router setup
  main.tsx           — Entry point
  index.css          — Tailwind config + global styles
  components/
    layout/          — Navbar, Footer, Layout wrapper
    home/            — Hero, SocialProof, ProductCards, Nutrition, FAQ, etc.
    shop/            — Product grid, ingredient cards
    community/       — Stats, join CTA
    about/           — Founder story, team
    contact/         — Contact form
    shared/          — AnimatedSection, CartDrawer, CookieConsent, LanguageSwitcher
  pages/             — Route-level page components
  providers/         — CartProvider (React context + localStorage)
  i18n/              — Translation files (en.json, sv.json)
  lib/               — Product data, constants, helpers
public/
  images/            — Hero image, founder photos, product shots
  CNAME              — Custom domain (cafoenergy.se)
  404.html           — SPA redirect for GitHub Pages
```

## Internationalization

The site supports **English** and **Swedish**. Toggle in the navbar.

- Currency automatically switches: EN = USD ($), SV = SEK (kr)
- All text lives in `src/i18n/en.json` and `src/i18n/sv.json`
- To add a language: create a new JSON file, register it in `src/i18n/index.ts`

## Deployment

The site deploys automatically to **GitHub Pages** via GitHub Actions on push to `main`.

The workflow (`.github/workflows/deploy.yml`) does:
1. Install dependencies
2. Build (`npm run build`)
3. Copy `index.html` as `404.html` (SPA routing)
4. Deploy `dist/` to GitHub Pages

### Manual Deploy

```bash
npm run build
# Upload contents of dist/ to your hosting
```

### GitHub Pages Setup

1. Go to repo Settings > Pages
2. Set Source to **GitHub Actions**
3. Push to `main` — the workflow handles the rest
4. Custom domain: `cafoenergy.se` (configured via `public/CNAME`)

## Pages

| Route | Page |
|-------|------|
| `/` | Home — Hero, social proof, products, nutrition, FAQ, story teaser |
| `/shop` | Shop — Full product grid with add-to-cart |
| `/community` | Community — Stats, showcase, join CTA |
| `/about` | Our Story — Founders, journey, mission |
| `/contact` | Contact — Form, email, social links |
| `/how-it-works` | How It Works — Science behind the product |
| `/privacy-policy` | Privacy Policy |

## Cart & Stripe Checkout

The cart persists in `localStorage`. Checkout is powered by **Stripe Checkout** (redirect mode — no backend needed).

### How it works

- Without Stripe configured: the checkout button shows "Checkout Coming Soon"
- With Stripe configured: clicking checkout redirects to Stripe's hosted payment page

### Setting up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
3. Create 3 products:
   - **Original Energy** (12 bars) — set the price
   - **Twin Pack** (24 bars) — set the price
   - **Family Pack** (36 bars) — set the price
4. Copy each product's **Price ID** (starts with `price_`)
5. Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

6. Fill in your keys:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_abc123...
VITE_STRIPE_PRICE_STARTER=price_1abc...
VITE_STRIPE_PRICE_DUO=price_1def...
VITE_STRIPE_PRICE_FAMILY=price_1ghi...
```

7. For GitHub Pages deployment, add these as **repository secrets** in Settings > Secrets > Actions, then update the deploy workflow to pass them as build args.

### Going live

Just replace `pk_test_` keys with `pk_live_` keys and use live price IDs. That's it.

## Brand Tokens

Defined in `src/index.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `espresso` | `#2C1810` | Deep brown accents |
| `cream` | `#F5F1E8` | Light backgrounds |
| `near-black` | `#0B0C10` | Navbar, dark sections |
| `gold` | `#f59e0b` | CTAs, highlights |
| `gold-light` | `#fbbf24` | Gradient endpoints |
| `forest` | `#1a4d2e` | Product green, success |
| `warm-white` | `#FDFCFA` | Page background |

Fonts: **Bebas Neue** (headings), **Inter** (body), **Poppins** (UI/accent)

---

> **A note from Pelleking:**
> Hey CAFO team! I rebuilt your entire site from scratch because the old one was... let's just say it needed some love. You now have a proper React setup with components, routing, i18n, and a real build pipeline. No more 7,700-line CSS files or 40+ duplicate HTML pages. Everything is clean, organized, and ready to scale. If you need anything tweaked, the code is actually maintainable now. Good luck with the bars — they sound awesome. /Pelleking
