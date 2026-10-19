import { CheckCircle2, Laptop, ShoppingCart, Globe2 } from "lucide-react";
import { caseStudies, company } from "../data/site";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";

/** Documented capabilities from Sanguine's product pages, used until verified case studies are added. */
const capabilities = [
  {
    icon: Laptop,
    title: "Open-source Java POS",
    text: "Sanguine POS is built on open-source Java and runs on Linux, Mac and Windows machines.",
    href: `${company.site}/sanguine-pos/`,
  },
  {
    icon: ShoppingCart,
    title: "Online orders into the POS",
    text: "With Sanguine Menus, each new online order is pushed into the POS, which generates the kitchen ticket and bill.",
    href: `${company.site}/sanguine-menus/`,
  },
  {
    icon: Globe2,
    title: "Web-based ERP modules",
    text: "WebStocks, WebPMS, WebCRM, WebBanquet and WebBooks run in the browser for teams across locations.",
    href: `${company.site}/sanguine-erp-for-clubs/`,
  },
];

export default function Proof() {
  return (
    <section className="bg-mist py-24 text-ink lg:py-32" aria-labelledby="proof-title">
      <div className="container-x">
        <SectionHeading light eyebrow="Client Projects & Proof" title={<span id="proof-title">Technology in Action</span>}>
          {caseStudies.length
            ? "How businesses use Sanguine to solve real operational challenges."
            : "What the platform does in day-to-day operations, as documented on Sanguine's product pages."}
        </SectionHeading>

        {caseStudies.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {caseStudies.map((c, i) => (
              <Reveal key={c.client} delay={i * 0.08}>
                <article className="h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
                  <h3 className="text-xl font-bold">{c.client}</h3>
                  <dl className="mt-5 space-y-4 text-[15px]">
                    {[
                      ["Challenge", c.challenge],
                      ["Solution", c.solution],
                      ["Outcome", c.outcome],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-accent-blue">{k}</dt>
                        <dd className="mt-1 text-slate-600">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <a
                  href={c.href}
                  className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:border-accent-blue/40 hover:shadow-xl"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-blue/10 text-accent-blue">
                    <c.icon size={22} />
                  </span>
                  <h3 className="mt-6 text-lg font-bold">{c.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-slate-600">{c.text}</p>
                  <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-accent-blue">
                    <CheckCircle2 size={16} /> Read on the product page
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
