import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { ChefHat, Clock, Package, Receipt, TrendingUp } from "lucide-react";
import { AreaChart, Meter } from "./ui/Charts";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Float({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

const panel = "rounded-2xl border border-white/10 bg-night-2/90 shadow-2xl shadow-black/40 backdrop-blur-xl";

export default function HeroDashboard() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative mx-auto w-full max-w-[640px] sm:pb-24 lg:pb-16"
      role="img"
      aria-label="Representative Sanguine dashboard showing sales, POS billing, inventory and orders with sample data"
    >
      <div className="absolute inset-6 -z-10 rounded-[32px] bg-gradient-to-tr from-accent-blue/30 to-accent-cyan/20 blur-3xl" />

      {/* Main: sales & revenue dashboard */}
      <motion.div variants={item} className={`${panel} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-3 text-xs font-semibold text-slate-300">Sales Dashboard</span>
          </div>
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate2">
            Sample data
          </span>
        </div>
        <div className="grid gap-4 p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { k: "Net sales", v: "₹1,28,450", d: "+8.2%" },
              { k: "Orders", v: "342", d: "+5.1%" },
              { k: "Avg. bill", v: "₹376", d: "+2.4%" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 sm:p-3">
                <p className="text-[10px] text-slate2 sm:text-[11px]">{s.k}</p>
                <p className="mt-1 text-sm font-bold text-white sm:text-lg">{s.v}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                  <TrendingUp size={11} /> {s.d}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-300">Revenue · Today</span>
              <span className="text-slate2">10 AM – 11 PM</span>
            </div>
            <AreaChart data={[18, 26, 22, 40, 62, 48, 36, 44, 70, 88, 76, 58, 40]} height={110} />
          </div>
        </div>
      </motion.div>

      {/* POS billing — overlaps bottom-left on larger screens */}
      <motion.div variants={item} className="mt-4 sm:absolute sm:-left-10 sm:bottom-0 sm:mt-0 sm:w-[270px] lg:-left-14">
        <Float delay={0.5}>
          <div className={`${panel} p-4`}>
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <Receipt size={14} className="text-accent-cyan" /> POS · Table 12
              </span>
              <span className="text-[10px] text-slate2">Dine-in</span>
            </div>
            <ul className="space-y-2 text-[12px]">
              {[
                ["Paneer Tikka", "1", "₹320"],
                ["Veg Biryani", "2", "₹560"],
                ["Fresh Lime Soda", "2", "₹180"],
              ].map(([n, q, p]) => (
                <li key={n} className="flex items-center justify-between text-slate-300">
                  <span>
                    <span className="mr-2 text-slate2">{q}×</span>
                    {n}
                  </span>
                  <span className="font-medium text-white">{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-dashed border-white/10 pt-3">
              <span className="text-[11px] text-slate2">Total incl. tax</span>
              <span className="text-base font-bold text-white">₹1,113</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <span className="rounded-lg bg-white/5 py-2 text-center text-[11px] font-semibold text-slate-200">KOT</span>
              <span className="rounded-lg bg-accent-blue py-2 text-center text-[11px] font-semibold text-white">Settle Bill</span>
            </div>
          </div>
        </Float>
      </motion.div>

      {/* Inventory overview — top-right */}
      <motion.div
        variants={item}
        className="mt-4 sm:absolute sm:-right-6 sm:-top-24 sm:mt-0 sm:w-[220px] lg:-right-12"
      >
        <Float delay={1.2}>
          <div className={`${panel} p-4`}>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
              <Package size={14} className="text-accent-cyan" /> Inventory
            </p>
            <div className="space-y-2.5 text-[11px]">
              {[
                { n: "Basmati Rice", v: 72, t: "blue" as const },
                { n: "Paneer", v: 28, t: "amber" as const },
                { n: "Cooking Oil", v: 12, t: "red" as const },
              ].map((r) => (
                <div key={r.n}>
                  <div className="mb-1 flex justify-between text-slate-300">
                    <span>{r.n}</span>
                    <span className="text-slate2">{r.v}%</span>
                  </div>
                  <Meter value={r.v} tone={r.t} />
                </div>
              ))}
            </div>
          </div>
        </Float>
      </motion.div>

      {/* Order management — bottom-right */}
      <motion.div variants={item} className="mt-4 sm:absolute sm:-bottom-2 sm:right-0 sm:mt-0 sm:w-[250px] lg:-right-4">
        <Float delay={2}>
          <div className={`${panel} p-4`}>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
              <ChefHat size={14} className="text-accent-cyan" /> Live Orders
            </p>
            <ul className="space-y-2 text-[11px]">
              {[
                { id: "#1042", t: "Takeaway", s: "Preparing", c: "bg-amber-400/15 text-amber-300" },
                { id: "#1041", t: "Table 7", s: "Served", c: "bg-emerald-400/15 text-emerald-300" },
                { id: "#1040", t: "Online", s: "New", c: "bg-accent-blue/20 text-sky-300" },
              ].map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-2">
                  <span className="text-slate-300">
                    <span className="font-semibold text-white">{o.id}</span> · {o.t}
                  </span>
                  <span className={`rounded-md px-1.5 py-0.5 font-semibold ${o.c}`}>{o.s}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2.5 flex items-center gap-1 text-[10px] text-slate2">
              <Clock size={11} /> Avg. prep time 14 min
            </p>
          </div>
        </Float>
      </motion.div>
    </motion.div>
  );
}
