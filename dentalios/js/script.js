const WHATSAPP_NUMBER = "918329043003";

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

// Header shadow on scroll
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

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

  if (!name || !form.phone.checkValidity() || !phone) {
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

// Reveal sections on scroll
const revealEls = document.querySelectorAll(
  ".service-card, .section-head, .about-text, .steps, .reviews-box, .faq details, .card, .map"
);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
}
