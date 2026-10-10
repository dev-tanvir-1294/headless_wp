# StichyX Store — Headless WooCommerce Frontend

A production-ready headless storefront built with **Next.js (App Router) + TypeScript +
Tailwind CSS**, powered by the existing WordPress/WooCommerce store at `redbox.page.gd`.

The visual design is modeled on **Aarong** (`aarong.com/bgd`) — orange + navy brand
colors, a sticky utility header, category tiles, and a clean product grid.

## Features

- Home, Shop (search / sort / category filter), Category, and Product detail pages
- Server-rendered product data straight from WooCommerce
- Client-side cart (persisted in `localStorage`)
- Guest checkout → creates a real WooCommerce order (Cash on Delivery by default)
- Customer sign-in via **JWT** (uses WordPress's own authentication)
- Automatic anti-bot challenge solving (see below)

## Stack

- **Next.js 14** (App Router, React Server Components, Node runtime)
- **TypeScript**
- **Tailwind CSS 3**
- **WooCommerce REST API** — `wc/store/v1` for catalog, `wc/v3` for order creation
- **JWT Authentication for WP REST API** for customer login

## Quick start

```bash
npm install --include=dev      # installs prod + dev dependencies
cp .env.example .env.local     # then fill in your WooCommerce keys
npm run dev                    # http://localhost:3000
npm run build && npm start     # production build
```

> **Note:** if your machine has `NODE_ENV=production` set globally, plain
> `npm install` will skip `devDependencies` (Tailwind, TypeScript, ESLint, PostCSS).
> Always use `npm install --include=dev`.

## Environment variables

| Variable                  | Required | Purpose                                |
| ------------------------- | -------- | -------------------------------------- |
| `NEXT_PUBLIC_WP_BASE_URL` | No       | WordPress base URL (no trailing slash) |
| `WC_CONSUMER_KEY`         | For checkout | WooCommerce REST API consumer key  |
| `WC_CONSUMER_SECRET`      | For checkout | WooCommerce REST API secret        |

`NEXT_PUBLIC_*` values are exposed to the browser. **Never prefix the WooCommerce
credentials with `NEXT_PUBLIC_`** — they are server-only.

## Project structure

```
app/
  page.tsx                 Home
  shop/page.tsx            All products + search + sort + filter
  category/[slug]/page.tsx Category listing
  product/[slug]/page.tsx  Product detail + gallery + related
  cart/page.tsx            Client-side cart
  checkout/page.tsx        Guest checkout (cash on delivery)
  login/page.tsx           Customer sign-in
  api/
    checkout/route.ts      Server order-creation proxy
    auth/login/route.ts    Server JWT login proxy
components/                Header, Footer, ProductCard, CartProvider, AuthProvider, ...
lib/
  anti-bot.ts              AES cookie challenge solver
  woocommerce.ts           Catalog data layer (no-store fetch)
  orders.ts                Order creation via wc/v3
  auth.ts                  JWT login
  store-client.ts          Session-aware cart/checkout client
  config.ts / types.ts / format.ts / cart.ts
netlify.toml               Netlify build config
```

## How the data layer works

The host in front of WordPress (`page.gd` / `openresty`) places a small JavaScript
AES cookie challenge in front of **every** request — including `wp-json`. It is not a
real CAPTCHA; the challenge page exposes a static key pair (`a`, `b`) and a
per-request ciphertext (`c`).

`lib/anti-bot.ts` solves it transparently on the server:

1. Detect the challenge in the response body.
2. Decrypt `c` with **AES-128-CBC** (key = `a`, IV = `b`, no padding).
3. Re-request with `?i=1` and `Cookie: __test=<decrypted>`.

This runs server-side (Node `crypto`), so it is invisible to the browser. Catalog
requests use `cache: 'no-store'` so new products appear immediately.

## Authentication

Customer sign-in uses the **JWT Authentication for WP REST API** plugin (already
installed on the store). The Next.js `/login` page posts credentials to
`/api/auth/login`, which exchanges them for a JWT token via WordPress's own
`wp_authenticate`. The token is stored client-side and used for the header's
signed-in state. JWT login shares WordPress's rate limiter, so repeated failed
attempts are throttled by WordPress as usual.

## Cart & checkout

- **Cart** is client-side (React context + `localStorage`), persisted across reloads.
- **Checkout** creates a real WooCommerce order via the authenticated `wc/v3/orders`
  endpoint, defaulting to **Cash on Delivery** (`cod`).

### Checkout setup

1. WordPress admin → **WooCommerce → Settings → Advanced → REST API → Add key**.
2. Set **Read/Write** permission, generate, then paste into `.env.local`:

```bash
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Enable **Cash on Delivery** (WooCommerce → Payments) and set up a shipping zone.
4. Restart the server.

Card payments require a configured gateway and the matching `payment_method` id.

## Security

- **Secrets are never committed.** `.env.local` is gitignored; use `.env.example` as a
  template and store real credentials in Netlify's environment variables.
- WooCommerce keys and the JWT exchange run **server-side only** and are never
  exposed to the browser.
- Server-side rendering avoids exposing the WordPress origin or challenge details to
  the client.
- Product descriptions are stripped of HTML before rendering.

## Deploying to Netlify

1. Push this repo to GitHub/GitLab.
2. In Netlify: **New site → Import an existing project → select the repo**.
3. Set these environment variables (Site settings → Environment variables):

| Key                        | Value                             |
| -------------------------- | --------------------------------- |
| `NEXT_PUBLIC_WP_BASE_URL`  | `https://redbox.page.gd`          |
| `WC_CONSUMER_KEY`          | your `ck_...` key                 |
| `WC_CONSUMER_SECRET`       | your `cs_...` secret              |

4. Deploy. `netlify.toml` sets Node 20 and installs dev dependencies.

> **Note:** the WordPress host's anti-bot is solved server-side, so it should work
> from Netlify. If products render locally but not on Netlify, the host may be
> blocking Netlify's IPs — whitelist them or disable the host's bot protection.

## Notes & known items

- **WooGraphQL (WPGraphQL WooCommerce) is not installed**, so the build uses the REST
  API. Install WooGraphQL if you later want GraphQL.
- **Images** are served directly from WordPress (static assets bypass the challenge)
  and rendered with `<img>` tags to avoid the image-optimizer round-trip.
- **Prices** come from the Store API in minor units; `lib/format.ts` normalizes them.
- **Variable / grouped products** display correctly but need variation selection to
  support actual checkout (a variable product added without a `variation_id` is
  rejected by WooCommerce).

## Customizing

- **Colors / fonts:** `tailwind.config.ts` (brand palette under `brand.*`).
- **Navigation categories:** `NAV_ORDER` in `components/Header.tsx`.
- **Home hero / category tiles:** `app/page.tsx`.
