import { ArrowUpRight, Building2, Globe2, Wrench } from "lucide-react";
import { contact, links } from "../data/site";
import { Reveal } from "./ui/Reveal";
import { ButtonLink } from "./ui/Button";
import { AreaChart } from "./ui/Charts";

export default function About() {
  return (
    <section id="about" className="bg-white py-24 text-ink lg:py-32" aria-labelledby="about-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="eyebrow-light">About Sanguine</span>
          <h2 id="about-title" className="h2 mt-4">
            Practical Technology. Real Business Needs.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Sanguine Software Solutions develops and supports business software for hospitality, retail and enterprise
            operations. Our integrated POS and ERP solutions help businesses manage essential workflows, improve visibility
            and connect day-to-day operations.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            Based in Pune with an office in Mumbai, the team designs, implements and supports its own products — and has
            delivered work for businesses in India, Oman, the UAE, Kenya and Nigeria.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Wrench, t: "Built in-house" },
              { icon: Building2, t: `${contact.offices.map((o) => o.city).join(" & ")} offices` },
              { icon: Globe2, t: "International work" },
            ].map((f) => (
              <li key={f.t} className="flex items-center gap-3 rounded-2xl bg-mist px-4 py-3 text-sm font-semibold">
                <f.icon size={18} className="text-accent-blue" /> {f.t}
              </li>
            ))}
          </ul>
          <ButtonLink href={links.about} variant="outline-dark" className="mt-8">
            More about us <ArrowUpRight size={16} />
          </ButtonLink>
        </Reveal>

        {/* Product imagery: representative composition */}
        <Reveal delay={0.1}>
          <div className="relative" aria-hidden>
            <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-tr from-accent-blue/20 to-accent-cyan/20 blur-2xl" />
            <div className="relative rounded-3xl bg-night p-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-3">
                {["POS", "WebStocks", "WebPMS", "WebBooks"].map((m, i) => (
                  <div key={m} className={`rounded-2xl border border-white/10 p-4 ${i === 0 ? "bg-accent-blue/20" : "bg-white/[0.04]"}`}>
                    <p className="text-xs text-slate2">Module</p>
                    <p className="mt-1 font-bold text-white">{m}</p>
                    <span className="mt-3 block h-1.5 w-2/3 rounded bg-white/10" />
                    <span className="mt-1.5 block h-1.5 w-1/2 rounded bg-white/10" />
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="mb-2 text-xs font-semibold text-slate-300">Connected data · one platform</p>
                <AreaChart data={[30, 42, 38, 55, 50, 68, 74, 70, 86]} height={90} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
