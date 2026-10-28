// ---------------------------------------------------------------------------
// Restaurant details — update these with the real values.
// ---------------------------------------------------------------------------
const CONFIG = {
  phone: "+910000000000",          // used for tel: links
  phoneDisplay: "+91 00000 00000", // shown on the page
  whatsapp: "910000000000",        // country code + number, digits only
  address: "Address — to be updated",
};

// ---------------------------------------------------------------------------
// Menu data — sample dishes and prices, edit freely.
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { id: "parathas", name: "Parathas", emoji: "🫓" },
  { id: "thalis", name: "Thalis", emoji: "🍛" },
  { id: "north", name: "North Indian", emoji: "🥘" },
  { id: "south", name: "South Indian", emoji: "🥞" },
  { id: "chinese", name: "Chinese", emoji: "🍜" },
  { id: "snacks", name: "Snacks", emoji: "🥟" },
  { id: "sweets", name: "Sweets", emoji: "🍮" },
  { id: "drinks", name: "Drinks", emoji: "🥤" },
];

const DISHES = [
  { id: 1, cat: "parathas", name: "Aloo Paratha", desc: "Spiced potato, butter, curd & pickle", price: 90, strike: 110, rating: 5, emoji: "🫓", tag: "Bestseller" },
  { id: 2, cat: "parathas", name: "Paneer Paratha", desc: "Grated paneer, green chilli, coriander", price: 120, rating: 5, emoji: "🫓" },
  { id: 3, cat: "parathas", name: "Gobi Paratha", desc: "Cauliflower stuffing, served with curd", price: 100, rating: 4, emoji: "🫓" },
  { id: 4, cat: "parathas", name: "Mix Veg Paratha", desc: "Seasonal veggies, desi ghee", price: 110, rating: 4, emoji: "🫓" },
  { id: 5, cat: "parathas", name: "Lachha Paratha", desc: "Flaky layered whole-wheat paratha", price: 60, rating: 4, emoji: "🫓" },

  { id: 10, cat: "north", name: "Paneer Butter Masala", desc: "Creamy tomato gravy, soft paneer", price: 240, strike: 280, rating: 5, emoji: "🥘", tag: "Chef's pick" },
  { id: 11, cat: "north", name: "Dal Makhani", desc: "Slow-cooked black dal, butter & cream", price: 200, rating: 5, emoji: "🥘" },
  { id: 12, cat: "north", name: "Chole Bhature", desc: "Two bhature, Punjabi chole, onion", price: 150, rating: 5, emoji: "🥘", tag: "Bestseller" },
  { id: 13, cat: "north", name: "Kadai Paneer", desc: "Capsicum, onion, freshly ground masala", price: 230, rating: 4, emoji: "🥘" },
  { id: 14, cat: "north", name: "Jeera Rice", desc: "Basmati tempered with cumin", price: 130, rating: 4, emoji: "🍚" },
  { id: 15, cat: "north", name: "Butter Naan", desc: "Tandoori naan brushed with butter", price: 50, rating: 4, emoji: "🫓" },

  { id: 20, cat: "south", name: "Masala Dosa", desc: "Crisp dosa, potato masala, chutneys", price: 120, strike: 140, rating: 5, emoji: "🥞", tag: "Bestseller" },
  { id: 21, cat: "south", name: "Idli Sambar", desc: "Three soft idlis, sambar, chutney", price: 80, rating: 4, emoji: "🍥" },
  { id: 22, cat: "south", name: "Medu Vada", desc: "Two crisp vadas, sambar, chutney", price: 90, rating: 4, emoji: "🍩" },
  { id: 23, cat: "south", name: "Onion Uttapam", desc: "Thick dosa topped with onion & chilli", price: 130, rating: 4, emoji: "🥞" },

  { id: 30, cat: "chinese", name: "Veg Hakka Noodles", desc: "Wok-tossed noodles, crunchy veggies", price: 160, rating: 4, emoji: "🍜" },
  { id: 31, cat: "chinese", name: "Veg Manchurian", desc: "Dry or gravy, your choice", price: 170, rating: 4, emoji: "🥡" },
  { id: 32, cat: "chinese", name: "Chilli Paneer", desc: "Paneer, peppers, spicy-sweet sauce", price: 210, rating: 5, emoji: "🌶️" },
  { id: 33, cat: "chinese", name: "Veg Fried Rice", desc: "Basmati, veggies, spring onion", price: 160, rating: 4, emoji: "🍚" },

  { id: 40, cat: "snacks", name: "Samosa (2 pcs)", desc: "Aloo-matar filling, tamarind chutney", price: 40, rating: 5, emoji: "🥟" },
  { id: 41, cat: "snacks", name: "Pav Bhaji", desc: "Buttery bhaji, two toasted pav", price: 130, rating: 5, emoji: "🍞", tag: "Bestseller" },
  { id: 42, cat: "snacks", name: "Paneer Tikka", desc: "Tandoor-grilled, mint chutney", price: 220, rating: 5, emoji: "🍢" },
  { id: 43, cat: "snacks", name: "Veg Sandwich", desc: "Grilled, with green chutney", price: 90, rating: 4, emoji: "🥪" },

  { id: 50, cat: "sweets", name: "Gulab Jamun (2 pcs)", desc: "Served warm", price: 60, rating: 5, emoji: "🍮" },
  { id: 51, cat: "sweets", name: "Rasmalai (2 pcs)", desc: "Chilled, saffron milk", price: 90, rating: 5, emoji: "🍮" },
  { id: 52, cat: "sweets", name: "Gajar Halwa", desc: "Seasonal, desi ghee", price: 100, rating: 4, emoji: "🥕" },

  { id: 60, cat: "drinks", name: "Sweet Lassi", desc: "Thick Punjabi lassi with malai", price: 70, rating: 5, emoji: "🥛", tag: "Must try" },
  { id: 61, cat: "drinks", name: "Masala Chaas", desc: "Spiced buttermilk", price: 40, rating: 4, emoji: "🥛" },
  { id: 62, cat: "drinks", name: "Masala Chai", desc: "Ginger-cardamom tea", price: 30, rating: 5, emoji: "☕" },
  { id: 63, cat: "drinks", name: "Fresh Lime Soda", desc: "Sweet, salted or mixed", price: 60, rating: 4, emoji: "🍋" },
];

const ROWS = [
  { cat: "parathas", eyebrow: "Fresh off the tawa", title: "Parathas", sub: "Stuffed, hand-rolled and served with curd & pickle", banner: { kicker: "Breakfast special", title: "Any 2 parathas + chai", sub: "Every morning till 11:30 am", cta: "Order on WhatsApp" } },
  { cat: "north", eyebrow: "Main course", title: "North Indian", sub: "Rich gravies, tandoori breads and slow-cooked dals" },
  { cat: "south", eyebrow: "Crisp & light", title: "South Indian", sub: "Dosas, idlis and vadas with fresh sambar" },
  { cat: "snacks", eyebrow: "Evening cravings", title: "Snacks & starters", sub: "Perfect with a cup of chai", banner: { kicker: "Parties", title: "Snack platters for groups", sub: "Tell us the headcount, we quote the same day", cta: "Get a quote", href: "#contact" } },
  { cat: "chinese", eyebrow: "Desi-Chinese", title: "Chinese", sub: "Wok-tossed, spicy and saucy" },
  { cat: "sweets", eyebrow: "Meetha", title: "Sweets", sub: "End it on a sweet note" },
  { cat: "drinks", eyebrow: "Thanda-garam", title: "Drinks", sub: "Lassi, chaas, chai and coolers" },
];

const PACKAGES = [
  { emoji: "🍛", name: "Mini Thali", for: "Quick lunch for one", price: 150, items: ["1 sabzi + dal", "Rice or 3 rotis", "Salad & pickle"] },
  { emoji: "🍽️", name: "Pratha Special Thali", for: "Our most-ordered plate", price: 250, ribbon: "Most popular", featured: true, items: ["Paneer sabzi + seasonal sabzi", "Dal makhani, jeera rice", "2 rotis or 1 paratha", "Raita, papad, salad", "Gulab jamun"] },
  { emoji: "👨‍👩‍👧", name: "Family Combo", for: "Serves 4", price: 899, items: ["2 main-course gravies", "Dal, rice & 8 rotis", "Raita & salad", "4 sweets"] },
];

const FAQS = [
  { q: "Is everything vegetarian?", a: "Yes — Pratha is a 100% pure vegetarian kitchen." },
  { q: "Do you deliver?", a: "Send your order on WhatsApp and we’ll confirm delivery or pickup for your area." },
  { q: "Can I book the restaurant for a party?", a: "Yes. Use the enquiry form below with your date and guest count and we’ll get back with options and a quote." },
  { q: "Do you take bulk / catering orders?", a: "Yes, for birthdays, poojas, office lunches and more. Please give us at least a day’s notice for large orders." },
  { q: "Can I ask for less spicy or Jain food?", a: "Of course — just mention it in your order or tell your server." },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const rupee = (n) => "₹" + n.toLocaleString("en-IN");
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || "";
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const CARD_TINTS = ["#FDECEF", "#FFF3E2", "#EFEAFB", "#E8F6EE", "#E9F1FF", "#FFF6F2"];

// ---------------------------------------------------------------------------
// Contact details
// ---------------------------------------------------------------------------
function applyConfig() {
  $$(".js-phone").forEach((el) => (el.textContent = CONFIG.phoneDisplay));
  $$(".js-phone-link").forEach((el) => (el.href = `tel:${CONFIG.phone}`));
  $$(".js-address").forEach((el) => (el.textContent = CONFIG.address));
  $$(".js-wa").forEach((el) => {
    el.href = waLink("Hi Pratha Restaurant! I'd like to place an order.");
    el.target = "_blank";
    el.rel = "noopener";
  });
  $("#year").textContent = new Date().getFullYear();
}

// ---------------------------------------------------------------------------
// Header: mobile nav + search
// ---------------------------------------------------------------------------
function initHeader() {
  const nav = $("#nav");
  const toggle = $("#menuToggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "✕" : "☰";
  });
  $$("a", nav).forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    })
  );

  const search = $("#search");
  const input = $("#searchInput");
  const results = $("#searchResults");
  const close = () => { search.hidden = true; input.value = ""; results.innerHTML = ""; };

  $("#searchOpen").addEventListener("click", () => {
    search.hidden = !search.hidden;
    if (!search.hidden) input.focus();
  });
  $("#searchClose").addEventListener("click", close);
  document.addEventListener("keydown", (e) => e.key === "Escape" && !search.hidden && close());

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ""; return; }
    const hits = DISHES.filter((d) => (d.name + " " + d.desc + " " + catName(d.cat)).toLowerCase().includes(q)).slice(0, 8);
    results.innerHTML = hits.length
      ? hits.map((d) => `
          <li><button data-cat="${d.cat}" data-id="${d.id}">
            <span class="r-emoji">${d.emoji}</span>
            <span class="r-name">${escapeHtml(d.name)}<span class="r-cat">${catName(d.cat)}</span></span>
            <span class="r-price">${rupee(d.price)}</span>
          </button></li>`).join("")
      : `<li class="search__empty">Nothing matched — try “paneer”, “dosa” or “lassi”.</li>`;
  });

  results.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    close();
    const card = $(`.card[data-id="${btn.dataset.id}"]`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      card.animate([{ boxShadow: "0 0 0 3px #E8113C" }, { boxShadow: "0 0 0 0 transparent" }], { duration: 1600 });
    }
  });
}

// ---------------------------------------------------------------------------
// Hero slider
// ---------------------------------------------------------------------------
function initHero() {
  const slides = $$(".hero__slide");
  const dots = $("#heroDots");
  let current = 0;
  let timer;

  dots.innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i + 1}"></button>`).join("");
  const dotBtns = $$("button", dots);

  const go = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle("is-active", j === current));
    dotBtns.forEach((d, j) => d.classList.toggle("is-active", j === current));
  };
  const restart = () => {
    clearInterval(timer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => go(current + 1), 6000);
  };

  dotBtns.forEach((d, i) => d.addEventListener("click", () => { go(i); restart(); }));
  $("#heroPrev").addEventListener("click", () => { go(current - 1); restart(); });
  $("#heroNext").addEventListener("click", () => { go(current + 1); restart(); });

  go(0);
  restart();
}

// ---------------------------------------------------------------------------
// Menu: categories, dish rows, packages, FAQ
// ---------------------------------------------------------------------------
function renderCategories() {
  $("#cats").innerHTML = CATEGORIES.map((c) => `
    <a class="cat" href="#row-${c.id}">
      <span class="cat__icon">${c.emoji}</span>
      <span class="cat__name">${c.name}</span>
    </a>`).join("")
    // Thalis live in their own section
    .replace('href="#row-thalis"', 'href="#thalis"');

  $("#footerCats").innerHTML = CATEGORIES.map((c) =>
    `<li><a href="${c.id === "thalis" ? "#thalis" : "#row-" + c.id}">${c.name}</a></li>`).join("");
}

function cardHtml(d, i) {
  return `
    <article class="card" data-id="${d.id}">
      <div class="card__media" style="--card-bg:${CARD_TINTS[i % CARD_TINTS.length]}">
        ${d.tag ? `<span class="card__tag">${d.tag}</span>` : ""}
        <span class="veg" title="Vegetarian"></span>
        <span aria-hidden="true">${d.emoji}</span>
      </div>
      <div class="card__body">
        <h3 class="card__name">${escapeHtml(d.name)}</h3>
        <span class="stars" aria-label="${d.rating} out of 5">${stars(d.rating)}</span>
        <p class="card__desc">${escapeHtml(d.desc)}</p>
        <div class="card__foot">
          <span class="price">${rupee(d.price)}${d.strike ? `<span class="strike">${rupee(d.strike)}</span>` : ""}</span>
          <span class="card__cta" data-id="${d.id}"></span>
        </div>
      </div>
    </article>`;
}

function renderRows() {
  $("#rows").innerHTML = ROWS.map((row, r) => {
    const items = DISHES.filter((d) => d.cat === row.cat);
    const b = row.banner;
    return `
      <section class="section ${r % 2 ? "section--tint" : ""}" id="row-${row.cat}">
        <div class="container">
          <div class="section__head">
            <div>
              <span class="eyebrow">${row.eyebrow}</span>
              <h2>${row.title}</h2>
              <p class="muted">${row.sub}</p>
            </div>
            <div class="row__nav">
              <button class="round-btn" data-scroll="-1" aria-label="Scroll left">‹</button>
              <button class="round-btn" data-scroll="1" aria-label="Scroll right">›</button>
            </div>
          </div>
          <div class="track">${items.map(cardHtml).join("")}</div>
          ${b ? `
          <div class="banner">
            <div><span class="eyebrow">${b.kicker}</span><h3>${b.title}</h3><p>${b.sub}</p></div>
            <a href="${b.href || "#"}" class="${b.href ? "" : "js-wa"}">${b.cta} →</a>
          </div>` : ""}
        </div>
      </section>`;
  }).join("");

  $$("#rows [data-scroll]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const track = $(".track", btn.closest(".container"));
      track.scrollBy({ left: Number(btn.dataset.scroll) * track.clientWidth * 0.8, behavior: "smooth" });
    })
  );
}

function renderPackages() {
  $("#packages").innerHTML = PACKAGES.map((p) => `
    <article class="pkg ${p.featured ? "pkg--featured" : ""}">
      ${p.ribbon ? `<span class="pkg__ribbon">${p.ribbon}</span>` : ""}
      <span class="pkg__emoji">${p.emoji}</span>
      <h3>${p.name}</h3>
      <span class="pkg__for">${p.for}</span>
      <span class="pkg__from">STARTING FROM</span>
      <span class="pkg__price">${rupee(p.price)}</span>
      <ul>${p.items.map((x) => `<li>${x}</li>`).join("")}</ul>
      <a class="btn ${p.featured ? "btn--grad" : "btn--outline"}" target="_blank" rel="noopener"
         href="${waLink(`Hi Pratha Restaurant! I'd like to order the ${p.name}.`)}">Order this →</a>
    </article>`).join("");
}

function renderFaq() {
  $("#faq").innerHTML = FAQS.map((f) => `
    <details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("");
}

// ---------------------------------------------------------------------------
// Order (cart) — sent as a WhatsApp message
// ---------------------------------------------------------------------------
const order = new Map(); // dish id -> qty

function renderCtas() {
  $$(".card__cta").forEach((el) => {
    const id = Number(el.dataset.id);
    const qty = order.get(id) || 0;
    el.innerHTML = qty
      ? `<span class="qty"><button data-act="dec" data-id="${id}" aria-label="Remove one">−</button><span>${qty}</span><button data-act="inc" data-id="${id}" aria-label="Add one">+</button></span>`
      : `<button class="add-btn" data-act="inc" data-id="${id}">Add</button>`;
  });

  const lines = [...order].map(([id, qty]) => ({ dish: DISHES.find((d) => d.id === id), qty }));
  const total = lines.reduce((sum, l) => sum + l.dish.price * l.qty, 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  $("#orderbar").hidden = count === 0;
  document.body.classList.toggle("has-order", count > 0);
  $("#orderTotal").textContent = rupee(total);
  $("#orderCount").textContent = count ? `· ${count} item${count > 1 ? "s" : ""}` : "";
}

function initOrder() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const qty = (order.get(id) || 0) + (btn.dataset.act === "inc" ? 1 : -1);
    qty > 0 ? order.set(id, qty) : order.delete(id);
    renderCtas();
  });

  $("#orderClear").addEventListener("click", () => { order.clear(); renderCtas(); });

  $("#orderSend").addEventListener("click", () => {
    const lines = [...order].map(([id, qty]) => {
      const d = DISHES.find((x) => x.id === id);
      return `• ${d.name} × ${qty} — ${rupee(d.price * qty)}`;
    });
    const total = [...order].reduce((s, [id, qty]) => s + DISHES.find((x) => x.id === id).price * qty, 0);
    const text = `Hi Pratha Restaurant! I'd like to order:\n\n${lines.join("\n")}\n\nTotal: ${rupee(total)}`;
    window.open(waLink(text), "_blank", "noopener");
  });

  renderCtas();
}

// ---------------------------------------------------------------------------
// Enquiry form -> WhatsApp
// ---------------------------------------------------------------------------
function initForm() {
  const form = $("#enquiry");
  const error = $("#formError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.name.trim() || !data.phone.trim()) {
      error.textContent = "Please add your name and phone number.";
      return;
    }
    if (!/^[+\d][\d\s-]{6,}$/.test(data.phone.trim())) {
      error.textContent = "That phone number doesn’t look right.";
      return;
    }
    error.textContent = "";

    const text = [
      `Hi Pratha Restaurant! Enquiry: ${data.type}`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      data.date && `Date: ${data.date}`,
      data.guests && `Guests: ${data.guests}`,
      data.message && `Message: ${data.message}`,
    ].filter(Boolean).join("\n");

    window.open(waLink(text), "_blank", "noopener");
    form.reset();
  });
}

// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderRows();
  renderPackages();
  renderFaq();
  applyConfig();
  initHeader();
  initHero();
  initOrder();
  initForm();
});
