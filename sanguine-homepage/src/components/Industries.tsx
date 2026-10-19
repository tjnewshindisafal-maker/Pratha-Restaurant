import { motion } from "framer-motion";
import { ArrowUpRight, BedDouble, Cake, Coffee, PartyPopper, ShoppingBag, Store } from "lucide-react";
import { company } from "../data/site";
import { SectionHeading } from "./ui/SectionHeading";

const industries = [
  {
    name: "Restaurants & Cafes",
    text: "Billing, KOTs, tables and menus for dine-in, takeaway and delivery.",
    icon: Coffee,
    href: `${company.site}/sanguine-pos/`,
  },
  {
    name: "Hotels & Resorts",
    text: "Rooms, reservations and guest details alongside F&B outlets.",
    icon: BedDouble,
    href: `${company.site}/webpms/`,
  },
  {
    name: "Bakeries & Food Production",
    text: "Production planning, recipes and stock across outlets.",
    icon: Cake,
    href: `${company.site}/sanguine-erp-for-clubs/`,
  },
  {
    name: "Clubs & Banquet Venues",
    text: "Member services, banquets and club operations in one system.",
    icon: PartyPopper,
    href: `${company.site}/webclub/`,
  },
  {
    name: "Food Courts & Multi-Outlet Chains",
    text: "Counter-level billing with central menus, pricing and reports.",
    icon: Store,
    href: `${company.site}/sanguine-pos/`,
  },
  {
    name: "Retail & Inventory-Driven Businesses",
    text: "Ordering, invoicing, dispatch and stock control for distribution.",
    icon: ShoppingBag,
    href: `${company.site}/webcrm-2/`,
  },
];

export default function Industries() {
  return (
    <section id="industries" className="py-24 lg:py-32" aria-labelledby="industries-title">
      <div className="container-x">
        <SectionHeading eyebrow="Industry Use Cases" title={<span id="industries-title">Software Shaped for Your Industry</span>}>
          From a single cafe to a multi-property group, pick the setup that matches how you operate.
        </SectionHeading>

        <ul className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <motion.li
              key={ind.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="bg-night"
            >
              <a href={ind.href} className="group relative flex h-full flex-col p-7 transition-colors hover:bg-night-2 sm:p-8">
                <span className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full bg-accent-blue/0 blur-2xl transition-colors duration-500 group-hover:bg-accent-blue/30" />
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent-blue/20 to-accent-cyan/10 text-accent-cyan">
                  <ind.icon size={22} />
                </span>
                <h3 className="mt-6 flex items-start justify-between gap-4 text-lg font-bold text-white">
                  {ind.name}
                  <ArrowUpRight size={18} className="mt-1 shrink-0 text-slate2 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-cyan" />
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate2">{ind.text}</p>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
