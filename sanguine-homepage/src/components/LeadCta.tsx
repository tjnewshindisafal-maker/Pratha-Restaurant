import { ArrowRight, Phone } from "lucide-react";
import { contact } from "../data/site";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { Bars } from "./ui/Charts";

export default function LeadCta() {
  return (
    <section id="contact" className="relative overflow-hidden py-24 lg:py-28" aria-labelledby="cta-title">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-night-2 via-[#0b2140] to-night px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-blue/30 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-accent-cyan/15 blur-[100px]" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <h2 id="cta-title" className="h2 text-white">
                  Ready to Simplify Your Business Operations?
                </h2>
                <p className="mt-5 max-w-xl text-lg text-slate2">
                  Tell us about your business and discover the right Sanguine solution for your operational needs.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="#demo" size="lg">
                    Book Your Free Demo <ArrowRight size={18} />
                  </ButtonLink>
                  <ButtonLink href={`tel:${contact.sales.tel}`} size="lg" variant="ghost">
                    <Phone size={17} /> Talk to Our Team
                  </ButtonLink>
                </div>
              </div>

              <div className="glass hidden rounded-2xl p-5 lg:block" aria-hidden>
                <div className="mb-4 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Weekly sales · all outlets</span>
                  <span className="text-slate2">Sample</span>
                </div>
                <Bars data={[48, 62, 55, 74, 68, 88, 80]} className="h-36" />
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
                  {["Billing", "Inventory", "Reports"].map((t) => (
                    <span key={t} className="rounded-lg bg-white/5 py-2 font-semibold text-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
