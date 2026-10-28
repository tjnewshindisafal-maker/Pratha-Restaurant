# Pratha Restaurant

Website project for Pratha Restaurant.

## Project Structure

```
.
├── index.html      # Homepage
├── blog.html       # Blog — list of all posts
├── post.html       # Blog — single post (post.html?p=<slug>)
├── blog/posts.js   # Blog posts (newest first)
├── scripts/        # add_post.py — adds a post to blog/posts.js
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

- **Phone, WhatsApp number, address** — edit `CONFIG` in `js/config.js`
  (currently placeholders).
- **Menu, prices, thalis, FAQs** — edit `CATEGORIES`, `DISHES`, `ROWS`, `PACKAGES`
  and `FAQS` in `js/script.js`. Current dishes and prices are samples.

Visitors can add dishes to an order and send it on WhatsApp; the enquiry form also
opens WhatsApp with the details filled in.

## Blog

Posts live in `blog/posts.js`. To add one, write the post as a JSON file and run:

```
python3 scripts/add_post.py my-post.json
```

Fields: `slug`, `title`, `date` (YYYY-MM-DD), `category`, `emoji`, `excerpt`,
`readMins`, `body`. The body supports `## ` / `### ` headings, `- ` lists,
`**bold**`, `*italic*` and blank lines between paragraphs. The script checks the
fields and refuses duplicate slugs.

A daily scheduled Claude routine writes one new post and pushes it.
