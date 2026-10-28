// ---------------------------------------------------------------------------
// Blog — renders posts from blog/posts.js on the homepage, blog.html and
// post.html. Needs js/config.js and blog/posts.js loaded first.
// ---------------------------------------------------------------------------
(() => {
  const posts = (window.BLOG_POSTS || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  const TINTS = ["#FDECEF", "#FFF3E2", "#EFEAFB", "#E8F6EE", "#E9F1FF", "#FFF6F2"];

  const formatDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  // Small Markdown subset: ## / ### headings, "- " lists, **bold**, *italic*, paragraphs.
  function renderBody(md) {
    const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
    return md.split(/\n{2,}/).map((block) => {
      const lines = block.trim().split("\n");
      if (lines.every((l) => l.startsWith("- "))) return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`;
      if (block.startsWith("### ")) return `<h3>${inline(block.slice(4))}</h3>`;
      if (block.startsWith("## ")) return `<h2>${inline(block.slice(3))}</h2>`;
      return `<p>${inline(lines.join(" "))}</p>`;
    }).join("");
  }

  const cardHtml = (p, i) => `
    <a class="post-card" href="post.html?p=${encodeURIComponent(p.slug)}">
      <div class="post-card__media" style="--card-bg:${TINTS[i % TINTS.length]}"><span aria-hidden="true">${p.emoji}</span></div>
      <div class="post-card__body">
        <span class="post-meta">${esc(p.category)} · ${formatDate(p.date)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.excerpt)}</p>
        <span class="post-card__more">Read more →</span>
      </div>
    </a>`;

  // Homepage: latest three posts
  function renderLatest() {
    const el = $("#latestPosts");
    if (!el) return;
    if (!posts.length) { el.closest("section").hidden = true; return; }
    el.innerHTML = posts.slice(0, 3).map(cardHtml).join("");
  }

  // blog.html: all posts with category filter
  function renderList() {
    const el = $("#blogList");
    if (!el) return;
    const filters = $("#blogFilters");
    const cats = ["All", ...new Set(posts.map((p) => p.category))];
    let active = "All";

    const draw = () => {
      const shown = active === "All" ? posts : posts.filter((p) => p.category === active);
      el.innerHTML = shown.length ? shown.map(cardHtml).join("") : `<p class="muted">No posts yet — check back tomorrow!</p>`;
      filters.innerHTML = cats.map((c) => `<button class="chip ${c === active ? "is-active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
    };
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (btn) { active = btn.dataset.cat; draw(); }
    });
    draw();
  }

  // post.html?p=<slug>: one post
  function renderPost() {
    const el = $("#post");
    if (!el) return;
    const slug = new URLSearchParams(location.search).get("p");
    const i = posts.findIndex((p) => p.slug === slug);
    if (i === -1) {
      el.innerHTML = `<h1>Post not found</h1><p class="muted">It may have moved. <a href="blog.html">See all posts →</a></p>`;
      return;
    }
    const p = posts[i];
    const newer = posts[i - 1];
    const older = posts[i + 1];
    document.title = `${p.title} — Pratha Restaurant`;
    $('meta[name="description"]')?.setAttribute("content", p.excerpt);

    el.innerHTML = `
      <a href="blog.html" class="back-link">← All posts</a>
      <span class="post-meta">${esc(p.category)} · ${formatDate(p.date)} · ${p.readMins} min read</span>
      <h1>${esc(p.title)}</h1>
      <div class="post__hero" aria-hidden="true">${p.emoji}</div>
      <div class="post__body">${renderBody(p.body)}</div>
      <div class="banner">
        <div><span class="eyebrow">Hungry now?</span><h3>Order fresh from Pratha</h3><p>Send your order on WhatsApp — we'll keep it hot and ready.</p></div>
        <a href="${waLink("Hi Pratha Restaurant! I'd like to place an order.")}" target="_blank" rel="noopener">Order on WhatsApp →</a>
      </div>
      <nav class="post__nav">
        ${older ? `<a href="post.html?p=${encodeURIComponent(older.slug)}"><small>← Older</small>${esc(older.title)}</a>` : "<span></span>"}
        ${newer ? `<a class="next" href="post.html?p=${encodeURIComponent(newer.slug)}"><small>Newer →</small>${esc(newer.title)}</a>` : "<span></span>"}
      </nav>`;
  }

  // Header + contact links on the blog pages (the homepage does this in script.js)
  function initBlogPage() {
    if (document.body.dataset.page !== "blog") return;
    document.querySelectorAll(".js-phone").forEach((el) => (el.textContent = CONFIG.phoneDisplay));
    document.querySelectorAll(".js-phone-link").forEach((el) => (el.href = `tel:${CONFIG.phone}`));
    document.querySelectorAll(".js-wa").forEach((el) => {
      el.href = waLink("Hi Pratha Restaurant! I'd like to place an order.");
      el.target = "_blank";
      el.rel = "noopener";
    });
    $("#year").textContent = new Date().getFullYear();

    const nav = $("#nav");
    const toggle = $("#menuToggle");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? "✕" : "☰";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initBlogPage();
    renderLatest();
    renderList();
    renderPost();
  });
})();
