import { motion } from "framer-motion";
import { ArrowRight, BedDouble, Cake, Store, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { company } from "../data/site";
import { SectionHeading } from "./ui/SectionHeading";

type Solution = {
  title: string;
  text: string;
  points: string[];
  href: string;
  icon: LucideIcon;
  chips: string[];
};

const solutions: Solution[] = [
  {
    title: "Restaurant & QSR Management",
    text: "Speed up billing at the counter and the table while keeping kitchen, menu and day-end reports in sync.",
    points: ["Fast billing & KOT", "Table and takeaway flows", "Daily sales reports"],
    href: `${company.site}/sanguine-pos/`,
    icon: UtensilsCrossed,
    chips: ["KOT printed", "Table 4 · Settled"],
  },
  {
    title: "Bakery Chain Management",
    text: "Plan production, move stock between the central kitchen and outlets, and see what sells where.",
    points: ["Central production", "Outlet indents & transfers", "Item-wise visibility"],
    href: `${company.site}/sanguine-erp-for-clubs/`,
    icon: Cake,
    chips: ["Indent · Outlet 3", "Transfer approved"],
  },
  {
    title: "Hotel & Property Management",
    text: "Manage rooms, reservations and guest preferences, with restaurant billing connected to the property.",
    points: ["Room status at a glance", "Reservations & guests", "Connected F&B billing"],
    href: `${company.site}/webpms/`,
    icon: BedDouble,
    chips: ["Room 204 · Check-in", "3 arrivals today"],
  },
  {
    title: "Food Court & Multi-Outlet Operations",
    text: "Give every counter its own billing while head office keeps central control of menus, stock and reports.",
    points: ["Centralised control", "Consolidated reporting", "Outlet-level inventory"],
    href: `${company.site}/sanguine-pos/`,
    icon: Store,
    chips: ["6 counters live", "Consolidated report"],
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="bg-mist py-24 text-ink lg:py-32" aria-labelledby="solutions-title">
      <div className="container-x">
        <SectionHeading light eyebrow="Hospitality Solutions" title={<span id="solutions-title">Built Around the Way Your Business Works</span>}>
          Industry-specific setups that focus on what matters day to day: centralised control, inventory visibility, billing
          efficiency and multi-location management.
        </SectionHeading>

        <div className="grid gap-6 md:grid-cols-2">
          {solutions.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition-shadow hover:shadow-xl"
            >
              {/* Visual: representative interface tile */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-night via-night-2 to-[#0f2a4a] p-6" aria-hidden>
                <div className="grid-bg absolute inset-0 opacity-60" />
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent-blue/30 blur-3xl" />
                <s.icon className="relative text-accent-cyan" size={36} strokeWidth={1.6} />
                <div className="relative mt-6 flex flex-wrap gap-2">
                  {s.chips.map((c) => (
                    <span key={c} className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-0 right-6 flex h-20 w-40 items-end gap-1.5 transition-transform duration-500 group-hover:-translate-y-1">
                  {[40, 62, 50, 78, 66, 90].map((h, j) => (
                    <span key={j} className="flex-1 rounded-t bg-gradient-to-t from-accent-blue/70 to-accent-cyan/70" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{s.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li key={p} className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-slate-700">
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href={s.href}
                  className="mt-6 inline-flex items-center gap-1.5 font-semibold text-accent-blue hover:gap-2.5 transition-all"
                >
                  Discover Solution <ArrowRight size={17} />
                  <span className="sr-only">: {s.title}</span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
