import { Globe2, MapPin, MonitorCog, Layers } from "lucide-react";
import { trust } from "../data/site";
import { Reveal } from "./ui/Reveal";

/** Facts drawn from sanguinesoftwares.com (About, POS and Contact pages). */
const facts = [
  { icon: Layers, title: "POS + ERP suite", text: "Billing, stores, accounts, PMS and CRM modules" },
  { icon: MonitorCog, title: "Cross-platform POS", text: "Runs on Windows, Linux and Mac" },
  { icon: MapPin, title: "Pune & Mumbai", text: "Offices for sales, implementation and support" },
  { icon: Globe2, title: "Beyond India", text: "Work delivered in Oman, UAE, Kenya and Nigeria" },
];

export default function Trust() {
  return (
    <section className="border-y border-white/10 bg-night-2 py-16 lg:py-20" aria-labelledby="trust-title">
      <div className="container-x">
        <Reveal className="text-center">
          <h2 id="trust-title" className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Technology That Powers Everyday Business
          </h2>
          {trust.brandCountClaim && (
            <p className="mt-3 text-slate2">
              Trusted by <span className="font-semibold text-white">{trust.brandCountClaim} leading brands</span>
            </p>
          )}
        </Reveal>

        {trust.clientLogos.length > 0 && (
          <Reveal delay={0.1} className="mt-10">
            <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {trust.clientLogos.map((l) => (
                <li key={l.name}>
                  <img
                    src={l.src}
                    alt={l.name}
                    loading="lazy"
                    className="h-9 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 0.07} className="glass flex h-full items-start gap-4 rounded-2xl p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-blue/25 to-accent-cyan/20 text-accent-cyan">
                  <f.icon size={19} />
                </span>
                <span>
                  <span className="block font-semibold text-white">{f.title}</span>
                  <span className="mt-1 block text-sm text-slate2">{f.text}</span>
                </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
