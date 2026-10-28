# Pratha Restaurant

Website project for Pratha Restaurant.

## Project Structure

```
.
├── index.html      # Homepage
├── css/            # Stylesheets
└── js/             # Scripts
```

## Getting Started

Open `index.html` in a browser, or serve the folder with any static file server, e.g.:

```
python3 -m http.server
```

## Editing content

Design is inspired by fascinateevents.com (red/orange gradient, Poppins + Caveat fonts,
hero slider, category circles, scrolling dish cards, floating Call/WhatsApp buttons).

- **Phone, WhatsApp number, address** — edit `CONFIG` at the top of `js/script.js`
  (currently placeholders).
- **Menu, prices, thalis, FAQs** — edit `CATEGORIES`, `DISHES`, `ROWS`, `PACKAGES`
  and `FAQS` in `js/script.js`. Current dishes and prices are samples.

Visitors can add dishes to an order and send it on WhatsApp; the enquiry form also
opens WhatsApp with the details filled in.
