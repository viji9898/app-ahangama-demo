# Ahangama App

This repository powers:

- ahangama.com destination content and venue data
- Ahangama Pass promo QR acquisition, checkout, fulfillment, and verification

## Documentation

Primary docs:

- [docs/pass-workflow.md](/Users/viji/DevEnv/ahangama-app/docs/pass-workflow.md)
- [STRIPE_ENVIRONMENTS.md](/Users/viji/DevEnv/ahangama-app/STRIPE_ENVIRONMENTS.md)

## Current Workflow Summary

The current promo pass flow is:

1. User scans a venue QR code and lands on `/qr/:slug`.
2. A dynamic venue promo page renders from the promo configuration.
3. CTA clicks are tracked with GA4 and UTM attribution is persisted.
4. The frontend creates a Stripe Checkout session through a Netlify function.
5. Stripe payment completion is finalized through the promo webhook or verification fallback path.
6. A promo purchase row is written to the promo database.
7. The system generates a pass ID, pass URL, PassKit smart link, and receipt URL.
8. Customer, team, and venue emails are sent through SendGrid.
9. The success page resolves the purchase and can redirect to PassKit.
10. The pass is resolved through `/card/pass/...` and `/verify?...`.

## Database Split

The app uses two separate databases:

- `DATABASE_URL`: venue content and venue-related lookups
- `NETLIFY_DATABASE_URL`: promo purchases and pass fulfillment data

Do not mix them. Promo purchase reads and writes must use `NETLIFY_DATABASE_URL`.

## Key Runtime Pieces

- React + Vite frontend
- Netlify Functions
- Stripe Checkout
- Neon Postgres
- PassKit SmartPass
- SendGrid
- GA4

## Important Files

- [src/pages/VenueQrLandingPage.jsx](/Users/viji/DevEnv/ahangama-app/src/pages/VenueQrLandingPage.jsx)
- [src/services/stripe.js](/Users/viji/DevEnv/ahangama-app/src/services/stripe.js)
- [netlify/functions/create-checkout-session.js](/Users/viji/DevEnv/ahangama-app/netlify/functions/create-checkout-session.js)
- [netlify/functions/verify-payment.js](/Users/viji/DevEnv/ahangama-app/netlify/functions/verify-payment.js)
- [netlify/functions/stripe-webhook-promo.js](/Users/viji/DevEnv/ahangama-app/netlify/functions/stripe-webhook-promo.js)
- [lib/promo-purchases-db.js](/Users/viji/DevEnv/ahangama-app/lib/promo-purchases-db.js)
- [lib/promo-purchase-sync.js](/Users/viji/DevEnv/ahangama-app/lib/promo-purchase-sync.js)
- [lib/promo-purchase-fulfillment.js](/Users/viji/DevEnv/ahangama-app/lib/promo-purchase-fulfillment.js)
- [src/pages/PaymentSuccess.jsx](/Users/viji/DevEnv/ahangama-app/src/pages/PaymentSuccess.jsx)
- [src/pages/CardVerify.jsx](/Users/viji/DevEnv/ahangama-app/src/pages/CardVerify.jsx)

## Local Development

Install dependencies:

```bash
npm install
```

Run Netlify dev:

```bash
ntl dev --port 8890
```

Before testing promo flows:

- configure `DATABASE_URL`
- configure `NETLIFY_DATABASE_URL`
- apply [migrations/001_create_promo_purchases.sql](/Users/viji/DevEnv/ahangama-app/migrations/001_create_promo_purchases.sql) to the promo database
- configure Stripe, SendGrid, and PassKit variables

## Next Read

For the full end-to-end workflow including QR scan, checkout, webhook, fallback verification, emails, PassKit, UTM propagation, GA4 tracking, and verify-page behavior, read:

- [docs/pass-workflow.md](/Users/viji/DevEnv/ahangama-app/docs/pass-workflow.md)
