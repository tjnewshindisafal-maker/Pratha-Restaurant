/**
 * Single source of truth for company content.
 *
 * Contact details and page URLs come from sanguinesoftwares.com (contact page and
 * indexed pages). Anything that could not be verified is left empty and the
 * matching UI hides itself, so nothing fictional is ever rendered.
 */

const BASE = "https://sanguinesoftwares.com";

export const company = {
  name: "Sanguine Software Solutions",
  legalName: "Sanguine Software Solutions Pvt. Ltd.",
  site: BASE,
  // Drop the official logo file in /public and set its path here to replace the wordmark.
  logoSrc: "" as string,
  tagline:
    "Business software for hospitality, retail and enterprise operations — integrated POS and ERP built and supported from Pune.",
};

export const contact = {
  sales: { label: "Sales", phone: "+91 98508 73037", tel: "+919850873037" },
  support: { label: "Support", phone: "+91 77760 02200", tel: "+917776002200" },
  // Listed on the contact page without roles, so no role labels are implied here.
  emails: ["sachin@sanguinesoftwares.com", "swapnil.mohite@sanguinesoftwares.com"],
  offices: [
    {
      city: "Pune",
      lines: [
        "Shub Laxmi Society, Sr. No. 29/7B,",
        "Behind Water Pumping Station, Opp. Novotel,",
        "Wadgaon Sheri, Pune 411014",
      ],
    },
    {
      city: "Mumbai",
      lines: ["904, JMS Business Centre,", "Jogeshwari West, Link Road,", "Mumbai 400102"],
    },
  ],
};

export const links = {
  about: `${BASE}/about-us/`,
  contact: `${BASE}/contact/`,
  // Set once the live privacy policy URL is confirmed; the footer link hides while empty.
  privacy: "" as string,
};

/**
 * Trust section. Both stay empty until verified:
 *  - brandCountClaim: e.g. "1,500+" — only after confirming it is still accurate.
 *  - clientLogos: approved logo files placed in /public/clients.
 */
export const trust = {
  brandCountClaim: "" as string,
  clientLogos: [] as { name: string; src: string }[],
};

/** Verified case studies only. The proof section shows product modules until entries exist. */
export const caseStudies: {
  client: string;
  challenge: string;
  solution: string;
  outcome: string;
}[] = [];

export type ProductKey = "pos" | "mpos" | "erp" | "stocks" | "pms" | "crm";

export const products: {
  key: ProductKey;
  name: string;
  summary: string;
  href: string;
}[] = [
  {
    key: "pos",
    name: "Sanguine POS",
    summary:
      "Smart point-of-sale billing and restaurant operations — tables, KOTs, settlements and day-end in one place.",
    href: `${BASE}/sanguine-pos/`,
  },
  {
    key: "mpos",
    name: "Mobile POS",
    summary: "Take orders at the table on a handheld and send them straight to the kitchen for faster service.",
    href: `${BASE}/sanguine-pos/`,
  },
  {
    key: "erp",
    name: "Sanguine ERP",
    summary: "Connect purchasing, stores, accounts and operations through integrated enterprise modules.",
    href: `${BASE}/sanguine-erp-for-clubs/`,
  },
  {
    key: "stocks",
    name: "WebStocks",
    summary: "Run supply-chain activity — inventory, procurement, stock movement and multi-location transfers.",
    href: `${BASE}/sanguine-erp-for-clubs/`,
  },
  {
    key: "pms",
    name: "WebPMS",
    summary: "Manage property operations, room information, reservations and guest preferences from the web.",
    href: `${BASE}/webpms/`,
  },
  {
    key: "crm",
    name: "WebCRM & WebBooks",
    summary: "Handle customer ordering, invoicing, dispatch and returns, with cloud accounting for your finances.",
    href: `${BASE}/webcrm-2/`,
  },
];

export const productOptions = [
  ...products.map((p) => p.name),
  "WebClub",
  "Sanguine Menus (online ordering)",
  "Not sure yet",
];

export const industryOptions = [
  "Restaurant / Cafe",
  "QSR / Quick service",
  "Hotel / Resort",
  "Bakery / Food production",
  "Club / Banquet venue",
  "Food court / Multi-outlet chain",
  "Retail",
  "Other",
];

export const outletOptions = ["1", "2–5", "6–20", "21–50", "50+"];
