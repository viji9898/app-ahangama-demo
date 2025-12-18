# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Ahangama.com

A curated destination guide for **independent travellers (FITs)**, starting with **Ahangama, Sri Lanka**.

The platform combines:

- Editorially curated listings (eat, stays, experiences, culture)
- Strong SEO foundations
- A paid destination discount card (USD 35) with vendor-verified perks
- A frontend-only MVP architecture designed to evolve into a full backend system

---

## Core Concept

**ahangama.com** is designed to be:

- A **single source of truth** for a destination
- Opinionated and curated (not crowdsourced, not ranked)
- Built for travellers staying **more than a few days**
- Monetised via a **destination card**, not ads or paywalls

We start with Ahangama and plan to expand to other destinations using the same architecture.

---

## Features Overview

### 1. Destination Guide

- Categories:
  - Eat & Drink
  - Stays
  - Experiences
  - Culture
- Editorial, opinionated listings
- No ratings, no reviews, no noise
- Data is intentionally hardcoded for the MVP

---

### 2. SEO-First Architecture

- Indexable category pages
- Indexable detail pages
- Environment-aware canonical URLs
- JSON-LD structured data:
  - `ItemList` on category pages
  - `LocalBusiness` + `BreadcrumbList` on detail pages
- Auto-generated:
  - `sitemap.xml`
  - `robots.txt`
- Crawl-friendly internal linking:
  - Homepage category grid
  - Related places
  - Crawlable `/search` page

---

### 3. Global Search & Filters

- Global search via TopNav
- Category-level filters:
  - Keyword filter
  - Tag filter
  - “Card perks only” toggle
- Fully in-memory (no backend required)

---

### 4. Ahangama Card (MVP)

A **USD 35** destination discount card that:

- Has a fixed validity window
- Is **valid for one person**
- Can be restricted to **once per day per venue**
- Is verified by vendors via QR code

#### Card Flow

1. User completes a dummy checkout
2. Card is issued and stored in `localStorage`
3. User shows QR code to vendor
4. Vendor:
   - Selects venue
   - Enters PIN
   - Scans QR
   - Sees a large **VALID / NOT VALID** status
   - Redeems the perk
5. Redemption is recorded and blocked if reused on the same day at the same venue

> ⚠️ This is a frontend-only MVP.  
> Cards and redemptions live in the browser’s `localStorage`.

---

## Tech Stack

### Frontend

- React
- Vite
- Ant Design
- React Router
- react-helmet-async (SEO)
- qrcode.react (QR code generation)

### Hosting

- Netlify
- SPA routing handled via redirects

---

## Project Structure

src/
├─ app/
│ ├─ App.jsx
│ ├─ routes.jsx
│ ├─ seo.jsx
│ ├─ siteUrl.js
│ ├─ searchContext.jsx
│ └─ cardStore.js
│
├─ components/
│ ├─ layout/
│ │ ├─ SiteLayout.jsx
│ │ ├─ TopNav.jsx
│ │ └─ FooterBar.jsx
│ │
│ └─ ui/
│ ├─ PlaceCard.jsx
│ ├─ PageHeader.jsx
│ ├─ CategoryGrid.jsx
│ ├─ FiltersBar.jsx
│ ├─ RelatedPlaces.jsx
│ └─ VerifyStatusPanel.jsx
│
├─ data/
│ ├─ places.js
│ ├─ categories.js
│ ├─ vendors.js
│ └─ cardConfig.js
│
├─ pages/
│ ├─ Home.jsx
│ ├─ CategoryIndex.jsx
│ ├─ PlaceDetail.jsx
│ ├─ SearchPage.jsx
│ ├─ CardLanding.jsx
│ ├─ CardBuy.jsx
│ ├─ MyCard.jsx
│ └─ CardVerify.jsx
│
├─ styles/
│ └─ globals.css
│
public/
├─ sitemap.xml
├─ robots.txt
└─ \_redirects

yaml
Copy code

---

## Environment Variables

Create a `.env` file:

VITE_SITE_URL=http://localhost:5173

java
Copy code

In production (Netlify):

VITE_SITE_URL=https://ahangama.com

yaml
Copy code

Used for:

- Canonical URLs
- Sitemap URLs
- QR code verification URLs

---

## SEO Generation

Sitemap and robots files are generated from real data.

### Command

npm run seo:gen

yaml
Copy code

### Runs automatically on

- `npm run dev`
- `npm run build`

Outputs:

- `public/sitemap.xml`
- `public/robots.txt`

---

## Local Development

npm install
npm run dev

sql
Copy code

Local app:
http://localhost:5173

yaml
Copy code

---

## Netlify Deployment (Important)

This is a React SPA using client-side routing.

You must configure redirects to avoid 404s on refresh.

### Option A: `_redirects` file

`public/_redirects`
/\* /index.html 200

css
Copy code

### Option B: `netlify.toml`

[build]
command = "npm run build"
publish = "dist"

[[redirects]]
from = "/\*"
to = "/index.html"
status = 200

yaml
Copy code

---

## Known MVP Limitations

- No backend
- No authentication
- Card data stored in `localStorage`
- Vendor PINs are hardcoded
- Not production-safe for payments or fraud prevention

These are intentional trade-offs for speed.

---

## Roadmap

### Phase 2

- Backend + database
- Stripe checkout
- Secure card issuance
- Vendor authentication
- Admin dashboard

### Phase 3

- Multiple destinations
- CMS-driven content
- Editorial workflows
- Vendor onboarding tools

---

## Philosophy

- Curated > Crowdsourced
- Editorial > Algorithmic
- Simple > Over-engineered
- Shipped > Perfect

This project is intentionally lean and opinionated, designed to evolve only once it proves value.
