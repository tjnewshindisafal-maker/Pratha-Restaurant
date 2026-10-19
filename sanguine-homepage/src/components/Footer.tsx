import { Mail, MapPin, Phone } from "lucide-react";
import { company, contact, links, products } from "../data/site";
import Logo from "./Logo";

const industryLinks = [
  { label: "Restaurants & QSR", href: "#solutions" },
  { label: "Bakery Chains", href: "#solutions" },
  { label: "Hotels & Properties", href: "#solutions" },
  { label: "Clubs & Banquets", href: `${company.site}/webclub/` },
  { label: "Food Courts & Multi-Outlet", href: "#solutions" },
];

export default function Footer() {
  const companyLinks = [
    { label: "About Us", href: links.about },
    { label: "Contact Us", href: links.contact },
    ...(links.privacy ? [{ label: "Privacy Policy", href: links.privacy }] : []),
  ];

  return (
    <footer className="border-t border-white/10 bg-[#050d18] pt-16 text-sm text-slate2">
      <div className="container-x grid gap-12 pb-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm leading-relaxed">{company.tagline}</p>
          <ul className="mt-6 space-y-2.5">
            {[contact.sales, contact.support].map((c) => (
              <li key={c.label}>
                <a href={`tel:${c.tel}`} className="inline-flex items-center gap-2.5 hover:text-white">
                  <Phone size={15} className="text-accent-cyan" />
                  <span className="text-slate-300">{c.label}:</span> {c.phone}
                </a>
              </li>
            ))}
            {contact.emails.map((e) => (
              <li key={e}>
                <a href={`mailto:${e}`} className="inline-flex items-center gap-2.5 break-all hover:text-white">
                  <Mail size={15} className="shrink-0 text-accent-cyan" /> {e}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Products">
          <h3 className="font-semibold text-white">Products</h3>
          <ul className="mt-4 space-y-2.5">
            {products.map((p) => (
              <li key={p.key}>
                <a href={p.href} className="hover:text-white">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Solutions">
          <h3 className="font-semibold text-white">Solutions</h3>
          <ul className="mt-4 space-y-2.5">
            {industryLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 font-semibold text-white">Company</h3>
          <ul className="mt-4 space-y-2.5">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-semibold text-white">Offices</h3>
          <ul className="mt-4 space-y-6">
            {contact.offices.map((o) => (
              <li key={o.city} className="flex gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent-cyan" />
                <address className="not-italic leading-relaxed">
                  <span className="font-semibold text-slate-300">{o.city}</span>
                  {o.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p>Restaurant POS · Hospitality ERP · Inventory Management Software</p>
        </div>
      </div>
    </footer>
  );
}
