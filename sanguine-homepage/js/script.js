// Mobile navigation
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Header shadow on scroll
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal sections on scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// Demo form (client-side validation only; hook up to a backend/CRM later)
const form = document.getElementById("demoForm");
const msg = document.getElementById("formMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.elements.name;
  const phone = form.elements.phone;
  const phoneOk = /^[+\d][\d\s-]{7,}$/.test(phone.value.trim());

  name.classList.toggle("invalid", !name.value.trim());
  phone.classList.toggle("invalid", !phoneOk);

  if (!name.value.trim() || !phoneOk) {
    msg.className = "form-msg err";
    msg.textContent = "Please enter your name and a valid phone number.";
    return;
  }

  msg.className = "form-msg ok";
  msg.textContent = `Thanks ${name.value.trim()}! Our team will contact you shortly.`;
  form.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
