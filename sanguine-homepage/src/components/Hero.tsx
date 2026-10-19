import { motion } from "framer-motion";
import { ArrowRight, Building2, Store, UtensilsCrossed } from "lucide-react";
import { ButtonLink } from "./ui/Button";
import HeroDashboard from "./HeroDashboard";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pt-36 lg:min-h-[100svh] lg:pb-24 lg:pt-40">
      {/* Background: grid + slowly drifting glows */}
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-accent-blue/25 blur-[120px]"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[420px] w-[420px] rounded-full bg-accent-cyan/15 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        <div>
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" /> Restaurant POS &amp; Hospitality ERP
          </motion.span>

          <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.1rem]">
            {["One Powerful Platform.", "Smarter Business Operations."].map((line, i) => (
              <motion.span
                key={line}
                className={`block ${i === 1 ? "bg-gradient-to-r from-accent-blue via-sky-400 to-accent-cyan bg-clip-text text-transparent" : ""}`}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-slate2 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
          >
            Streamline billing, inventory, restaurant operations and enterprise workflows with Sanguine's integrated
            POS and ERP solutions.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease }}
          >
            <ButtonLink href="#demo" size="lg">
              Book a Free Demo <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink href="#products" size="lg" variant="ghost">
              Explore Our Solutions
            </ButtonLink>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            <span className="flex -space-x-2" aria-hidden>
              {[UtensilsCrossed, Building2, Store].map((Icon, i) => (
                <span key={i} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-night-2 text-accent-cyan">
                  <Icon size={15} />
                </span>
              ))}
            </span>
            Built for hospitality, retail and multi-location businesses.
          </motion.div>
        </div>

        <HeroDashboard />
      </div>
    </section>
  );
}
