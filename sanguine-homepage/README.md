# Sanguine Software Solutions — Landing Page

React 18 + TypeScript + Tailwind CSS + Framer Motion + Lucide icons, built with Vite.

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build into dist/
npm run preview   # serve the production build
```

## Content

All company content lives in `src/data/site.ts`. Contact numbers, emails, office
addresses and product page links come from sanguinesoftwares.com.

Items that could not be verified are intentionally left empty; the related UI
hides itself until they are filled in:

| Field | Effect when set |
| --- | --- |
| `company.logoSrc` | Replaces the placeholder wordmark with the official logo |
| `trust.brandCountClaim` | Shows "Trusted by … leading brands" (e.g. `1,500+`, once confirmed) |
| `trust.clientLogos` | Shows approved customer logos in the trust section |
| `caseStudies` | Replaces the capability cards in "Technology in Action" with verified case studies |
| `links.privacy` | Adds the Privacy Policy link to the footer |

Dashboards and product previews are representative UI mockups with sample figures
and are labelled as such on the page.

## Demo enquiry form

Copy `.env.example` to `.env` and set `VITE_ENQUIRY_ENDPOINT` to the endpoint that
should receive enquiries (the existing website's form endpoint, a CRM webhook or a
form service). The form POSTs JSON and shows success only on a 2xx response.
Without an endpoint it tells the visitor to call or email sales instead.

Spam protection: a hidden honeypot field and a minimum fill time.

## WordPress

```bash
npm run build:wp
```

Creates:

- `release/sanguine-landing.html` — the whole page in one file (open it in a browser to preview the design)
- `release/sanguine-landing.zip` — WordPress plugin

Install:

1. WordPress admin → Plugins → Add New → Upload Plugin → `sanguine-landing.zip` → Install → Activate.
2. Pages → Add New → in the sidebar set **Template** to "Sanguine Landing Page (full page)" → Publish.
3. To use it as the homepage: Settings → Reading → "A static page" → Homepage = that page.
4. Settings → Sanguine Landing → set the email address that receives demo enquiries.

The page renders on its own (the theme's header, footer and CSS are not loaded),
so theme styles cannot clash with it. Demo enquiries post to
`/wp-json/sanguine/v1/enquiry`; each one is saved under **Demo Enquiries** in the
admin menu and emailed to the configured address. The list shows whether each
email was sent — if it says "No", set up an SMTP plugin; enquiries are still saved.

Plugin source lives in `wordpress-plugin/`; after changing the page, run
`npm run build:wp` again and upload the new zip.
