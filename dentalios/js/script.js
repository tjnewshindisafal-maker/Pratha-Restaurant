const WHATSAPP_NUMBER = "918329043003";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");

toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Header background on scroll + parallax on the clinic photo
const header = document.querySelector(".site-header");
const aboutImg = document.querySelector(".about-img img");
let ticking = false;

const onScroll = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
  if (aboutImg && !reduceMotion) {
    const rect = aboutImg.parentElement.getBoundingClientRect();
    const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
    aboutImg.style.transform = `translateY(${-6.5 + progress * -8}%)`;
  }
  ticking = false;
};
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  },
  { passive: true }
);
onScroll();

// Hero video: pause control, and respect reduced-motion preference
const video = document.querySelector(".hero-video");
const videoBtn = document.querySelector(".video-toggle");

const setPaused = (paused) => {
  videoBtn.classList.toggle("paused", paused);
  videoBtn.setAttribute("aria-label", paused ? "Play video" : "Pause video");
  videoBtn.title = paused ? "Play video" : "Pause video";
};

if (reduceMotion) {
  video.removeAttribute("autoplay");
  video.pause();
  setPaused(true);
}

videoBtn.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    setPaused(false);
  } else {
    video.pause();
    setPaused(true);
  }
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Earliest selectable appointment date is today
const dateInput = document.querySelector('input[name="date"]');
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().split("T")[0];

// Appointment form -> WhatsApp message
const form = document.getElementById("appointment-form");
const errorBox = form.querySelector(".form-error");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get("name").trim();
  const phone = data.get("phone").trim();

  if (!name || !phone || !form.phone.checkValidity()) {
    errorBox.textContent = "Please enter your name and a valid phone number.";
    errorBox.hidden = false;
    return;
  }
  errorBox.hidden = true;

  const lines = [
    "Hello Dentalios, I'd like to book an appointment.",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Treatment: ${data.get("treatment")}`,
  ];
  if (data.get("date")) lines.push(`Preferred date: ${data.get("date")}`);
  if (data.get("message").trim()) lines.push(`Message: ${data.get("message").trim()}`);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener");
});

// Count-up numbers
const animateCount = (el) => {
  const to = parseFloat(el.dataset.to);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  if (reduceMotion) {
    el.textContent = to.toFixed(decimals);
    return;
  }
  const start = performance.now();
  const duration = 1800;
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = (to * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// Scroll reveals (staggered within grids) and count-ups
const revealEls = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".count");

document.querySelectorAll(".services-grid, .faq").forEach((group) =>
  group.querySelectorAll(".reveal").forEach((el, i) => el.style.setProperty("--rd", `${(i % 3) * 0.12}s`))
);

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target.classList.contains("count")) animateCount(entry.target);
        else entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }),
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
  counters.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
  counters.forEach(animateCount);
}
