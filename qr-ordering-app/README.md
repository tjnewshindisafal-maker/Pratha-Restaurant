# Pratha Restaurant — QR Ordering App

A self-contained QR-code food ordering app for Pratha Restaurant: customers scan a table/packaging QR code, browse the menu, and order directly (COD or online via Razorpay) without a third-party aggregator. Staff manage live orders from a dashboard.

## Tech Stack

- **Framework:** Next.js (React) — frontend pages + API routes in one app
- **Styling:** Tailwind CSS
- **Database:** SQLite via Prisma by default (swap to Postgres by changing `datasource.provider` in `prisma/schema.prisma` and setting `DATABASE_URL`)
- **Auth:** Email/password for staff (JWT in an HttpOnly cookie). Customer OTP login was left out of this MVP (spec marks it optional for v1) — checkout only needs name + phone.
- **"Realtime" dashboard:** polling every 6 seconds, not a persistent WebSocket. This was a deliberate MVP tradeoff — Next.js API routes on typical serverless hosts (Vercel) don't hold long-lived WebSocket connections. Polling is simple, reliable, and fast enough for a single-location dashboard. To upgrade: swap in Pusher, Ably, or a small standalone WebSocket/Socket.IO process.
- **Payments:** Razorpay Checkout + webhook. Inactive until you add real keys — COD works with zero configuration.
- **Notifications:** Twilio WhatsApp. Inactive until you add real credentials — falls back to logging the message to the server console, so the app still runs end-to-end without a Twilio account.

## What's implemented

- Customer ordering page (`/`) — menu grouped by category, veg/non-veg dot, cart, sticky cart bar
- Checkout — name/phone/address/landmark, browser geolocation, Haversine delivery-radius check, COD or Razorpay
- Order confirmation + order tracking page (`/track/[id]`) with live status polling
- Staff dashboard (`/admin/dashboard`) — live orders, status updates, today's analytics, open/closed toggle, "notify rider" WhatsApp link
- Menu management (`/admin/menu`) — add/remove items, toggle sold-out
- QR code generation + download (`/admin/qrcode`, backed by `/api/qrcode`)
- Server-side price recalculation on every order (never trusts client-sent prices)
- Razorpay webhook with signature verification (`/api/webhooks/razorpay`)

## What you still need to provide

These require real accounts the app can't create for you:

1. **Razorpay** — sign up, complete KYC, get `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` from the dashboard, and a webhook secret after registering `https://<your-domain>/api/webhooks/razorpay` as a webhook URL (subscribe to `payment.captured` and `payment.failed`).
2. **Twilio WhatsApp** (or Gupshup) — get a WhatsApp-enabled sender number and API credentials for `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_WHATSAPP_FROM`.
3. **Your restaurant's exact latitude/longitude** — used for the delivery-radius check. Get it from Google Maps (right-click the location → the coordinates are the first item in the context menu).
4. **HTTPS hosting** — required in production for camera QR scanning, geolocation, and Razorpay to work (see Deployment below).

## Local Setup

```bash
cd qr-ordering-app
npm install
cp .env.example .env      # then edit .env with your values
npx prisma migrate dev --name init
npm run seed               # creates the restaurant, menu items, and a staff login
npm run dev
```

- Customer ordering page: http://localhost:3000
- Staff dashboard: http://localhost:3000/admin/login
  - Default seeded login: `owner@pratharestaurant.com` / `pratha123` — **change this password** (or delete/recreate the staff user) before going live.

## Environment Variables

See `.env.example` for the full list. Minimum to run locally with COD-only orders:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="some-long-random-string"
RESTAURANT_LAT="28.6139"
RESTAURANT_LNG="77.2090"
RESTAURANT_DELIVERY_RADIUS_KM="6"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

Add the Razorpay and Twilio blocks once you have those accounts — the app detects missing keys and disables those features gracefully instead of crashing.

## Data Model

Matches the spec's suggested schema (see `prisma/schema.prisma`):

- `Restaurant` — name, location, delivery radius, open/closed flag
- `MenuItem` — name, price, category, veg/non-veg, availability
- `Order` — customer info, items (JSON), totals, payment mode/status, order status, computed distance
- `StaffUser` — login credentials + role (owner/staff)

## Deployment

- **Frontend + API routes:** Vercel (this is a standard Next.js app — `vercel deploy` works out of the box). Set all `.env` variables in the Vercel project settings.
- **Database:** switch `prisma/schema.prisma`'s datasource to `postgresql`, point `DATABASE_URL` at a hosted Postgres (Railway, Render, Neon, Supabase), then run `npx prisma migrate deploy`.
- Make sure `NEXT_PUBLIC_BASE_URL` matches your real HTTPS domain — it's baked into the generated QR code.

## Known MVP limitations (documented, not hidden)

- No per-item stock/quantity counters — "sold out" is a manual staff toggle, not automatic inventory tracking. This sidesteps the concurrent-order double-booking problem for this scope; add a `stock` column + a transaction-guarded decrement if you need real inventory limits.
- Dashboard updates via polling, not a persistent WebSocket (see Tech Stack above).
- Customer login is phone-number-only at checkout, no OTP verification, matching the spec's "optional for v1" note.
- No automated tests included — this is an MVP scaffold, add tests before scaling.
