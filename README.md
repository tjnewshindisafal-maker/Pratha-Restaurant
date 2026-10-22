# ChatPilot — WhatsApp automation SaaS

Multi-tenant WhatsApp automation for small businesses (clinics, salons, coaching
centres, restaurants, shops). Each business signs up, connects its own WhatsApp
Business number through Meta's **official WhatsApp Cloud API**, and gets:

- **Keyword auto-replies** — "fees", "timing", "location" answered 24×7
- **Welcome & fallback messages** for new customers / unmatched questions
- **Shared inbox** — every chat in one dashboard, reply manually when needed
- **Contacts & tags** — add one by one or import CSV (`phone,name,tag1;tag2`)
- **Broadcasts** — to everyone or one tag, now or scheduled (free text or approved template)
- **Reminders** — appointment / fee / class reminders at a set time
- **STOP / START opt-out** handled automatically (keeps numbers from getting banned)
- **Test bot simulator** — try everything before connecting WhatsApp
- **Plans** — Free / Starter ₹999 / Growth ₹2,499 with monthly message and contact limits

Without WhatsApp credentials a workspace runs in **test mode**: nothing is sent,
messages are marked `simulated`, so the whole product can be demoed.

## Run locally

Requires Node.js 22.13+ (uses the built-in `node:sqlite`, no native modules).

```bash
npm install
npm start          # http://localhost:3000
npm test           # API tests
```

| Env var      | Default               | Purpose                                            |
|--------------|-----------------------|----------------------------------------------------|
| `PORT`       | `3000`                | HTTP port                                          |
| `DB_PATH`    | `data/chatpilot.db`   | SQLite database file                               |
| `PUBLIC_URL` | request host          | Public base URL shown as the webhook URL           |
| `NODE_ENV`   | —                     | Set `production` to mark session cookies `Secure`  |

## Connecting a WhatsApp number (per business)

1. Create an app at <https://developers.facebook.com/apps> and add the **WhatsApp** product.
2. In ChatPilot → **Settings**, paste the **Phone number ID**, a permanent
   **access token** (System User token) and the **App secret**.
3. In Meta → WhatsApp → Configuration, set the **Webhook URL** and **Verify token**
   shown in Settings, and subscribe to the `messages` field.

The server must be reachable over HTTPS for Meta's webhooks (deploy it, or use a
tunnel such as ngrok while testing).

WhatsApp rules to know: free-form messages can only be sent within 24 hours of the
customer's last message. Outside that window (and for most broadcasts) use a
template approved in Meta Business Manager. Meta bills conversation charges directly.

## How it works

```
Customer WhatsApp ──► Meta Cloud API ──► POST /webhook/:workspaceId
                                            │  save message, upsert contact
                                            │  STOP/START → welcome → keyword rule → fallback
                                            ▼
                         Meta Cloud API ◄── reply   (status updates come back via webhook)

Scheduler (every 15 s): due reminders and broadcasts are sent, skipping opted-out contacts.
```

## Project layout

```
src/
  server.js      entry point: opens DB, starts HTTP server and scheduler
  app.js         Express app: webhook, auth and dashboard API
  messaging.js   sending, plan limits, inbound bot logic
  scheduler.js   reminders and broadcasts
  whatsapp.js    Cloud API client, signature check, simulation mode
  auth.js        password hashing and cookie sessions
  db.js          SQLite schema
public/          landing page, login, dashboard (vanilla JS)
test/            node:test API tests
```

## Not built yet (next steps)

- Online payments for plan upgrades (e.g. Razorpay subscriptions) — switching plans is free for now
- Encrypting stored access tokens at rest
- Team members per workspace, media messages, message templates manager, password reset email
