import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";
import { AreaChart, Bars } from "./ui/Charts";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

type TabKey = "sales" | "orders" | "inventory" | "reports";

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "sales", label: "Sales Overview", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "inventory", label: "Inventory", icon: Package },
  { key: "reports", label: "Reports", icon: BarChart3 },
];

const card = "rounded-xl border border-white/10 bg-white/[0.03] p-4";

function Kpi({ k, v, d }: { k: string; v: string; d?: string }) {
  return (
    <div className={card}>
      <p className="text-xs text-slate2">{k}</p>
      <p className="mt-1.5 text-xl font-bold text-white sm:text-2xl">{v}</p>
      {d && (
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-400">
          <TrendingUp size={12} /> {d}
        </p>
      )}
    </div>
  );
}

function Sales() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi k="Net sales" v="₹4,86,200" d="+6.8% vs last week" />
        <Kpi k="Bills" v="1,284" d="+4.1%" />
        <Kpi k="Avg. bill value" v="₹379" d="+2.6%" />
        <Kpi k="Covers" v="2,915" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className={card}>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-white">Revenue trend · 14 days</span>
            <span className="text-xs text-slate2">All outlets</span>
          </div>
          <AreaChart data={[42, 48, 45, 56, 61, 72, 88, 54, 58, 60, 66, 74, 92, 81]} height={150} />
        </div>
        <div className={card}>
          <p className="mb-3 text-sm font-semibold text-white">Top selling items</p>
          <ul className="space-y-3 text-sm">
            {[
              ["Butter Chicken", 86],
              ["Veg Biryani", 72],
              ["Cold Coffee", 58],
              ["Margherita Pizza", 44],
            ].map(([n, v]) => (
              <li key={n}>
                <div className="mb-1 flex justify-between text-slate-300">
                  <span>{n}</span>
                  <span className="text-slate2">{v}</span>
                </div>
                <span className="block h-1.5 rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan" style={{ width: `${v}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const status: Record<string, string> = {
  New: "bg-accent-blue/20 text-sky-300",
  Preparing: "bg-amber-400/15 text-amber-300",
  Served: "bg-emerald-400/15 text-emerald-300",
  Settled: "bg-white/10 text-slate-300",
};

function Orders() {
  const rows = [
    ["#2318", "Table 6", "Dine-in", "₹1,240", "Preparing"],
    ["#2317", "Online", "Delivery", "₹560", "New"],
    ["#2316", "Counter", "Takeaway", "₹320", "Served"],
    ["#2315", "Table 2", "Dine-in", "₹2,180", "Settled"],
    ["#2314", "Phone order", "Delivery", "₹740", "Served"],
  ];
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi k="Open orders" v="18" />
        <Kpi k="In kitchen" v="7" />
        <Kpi k="Avg. prep time" v="13 min" />
        <Kpi k="Settled today" v="214" />
      </div>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[480px] text-left text-sm">
          <caption className="sr-only">Recent orders (sample data)</caption>
          <thead className="text-xs text-slate2">
            <tr>
              {["Order", "Source", "Type", "Amount", "Status"].map((h) => (
                <th key={h} scope="col" className="pb-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-white/5 text-slate-300">
                <td className="py-3 font-semibold text-white">{r[0]}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td className="text-white">{r[3]}</td>
                <td>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${status[r[4]]}`}>{r[4]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Inventory() {
  const rows: [string, string, string, number][] = [
    ["Basmati Rice", "Main Store", "182 kg", 78],
    ["Paneer", "Kitchen", "14 kg", 26],
    ["Refined Oil", "Main Store", "9 L", 12],
    ["Tomatoes", "Kitchen", "36 kg", 54],
    ["Milk", "Bakery", "40 L", 62],
  ];
  const tone = (v: number) => (v < 20 ? "text-rose-300 bg-rose-500/15" : v < 35 ? "text-amber-300 bg-amber-400/15" : "text-emerald-300 bg-emerald-400/15");
  const label = (v: number) => (v < 20 ? "Reorder" : v < 35 ? "Low" : "OK");
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi k="Items tracked" v="642" />
        <Kpi k="Low stock" v="11" />
        <Kpi k="Pending indents" v="4" />
        <Kpi k="Transfers today" v="9" />
      </div>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[480px] text-left text-sm">
          <caption className="sr-only">Inventory levels (sample data)</caption>
          <thead className="text-xs text-slate2">
            <tr>
              {["Item", "Location", "On hand", "Level", "Status"].map((h) => (
                <th key={h} scope="col" className="pb-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([n, l, q, v]) => (
              <tr key={n} className="border-t border-white/5 text-slate-300">
                <td className="py-3 font-semibold text-white">{n}</td>
                <td>{l}</td>
                <td>{q}</td>
                <td className="w-32 pr-4">
                  <span className="block h-1.5 rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-accent-blue" style={{ width: `${v}%` }} />
                  </span>
                </td>
                <td>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${tone(v)}`}>{label(v)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Reports() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className={card}>
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-semibold text-white">Outlet-wise sales · this month</span>
          <span className="text-xs text-slate2">Sample</span>
        </div>
        <Bars data={[64, 82, 48, 91, 70, 56, 77, 60]} className="h-44" />
        <div className="mt-2 grid grid-cols-8 text-center text-[10px] text-slate2">
          {["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8"].map((o) => (
            <span key={o}>{o}</span>
          ))}
        </div>
      </div>
      <div className={card}>
        <p className="mb-3 text-sm font-semibold text-white">Scheduled reports</p>
        <ul className="space-y-2 text-sm">
          {["Day-end sales summary", "Item-wise consumption", "Tax & settlement report", "Stock variance", "Outlet comparison"].map((r) => (
            <li key={r} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5 text-slate-300">
              <FileText size={15} className="text-accent-cyan" /> {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const views: Record<TabKey, () => JSX.Element> = { sales: Sales, orders: Orders, inventory: Inventory, reports: Reports };

export default function Showcase() {
  const [tab, setTab] = useState<TabKey>("sales");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const View = views[tab];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.findIndex((t) => t.key === tab);
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % TABS.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = TABS.length - 1;
    if (n < 0) return;
    e.preventDefault();
    setTab(TABS[n].key);
    refs.current[n]?.focus();
  };

  return (
    <section className="relative overflow-hidden py-24 lg:py-32" aria-labelledby="showcase-title">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="container-x relative">
        <SectionHeading eyebrow="Product Showcase" title={<span id="showcase-title">See Your Operations in One View</span>}>
          Switch between sales, orders, inventory and reports — the kind of visibility Sanguine dashboards are built to give
          owners and managers.
        </SectionHeading>

        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-night-2/80 shadow-2xl shadow-black/50 backdrop-blur-xl">
            {/* Window bar */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-300/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="hidden flex-1 items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate2 sm:flex sm:max-w-xs">
                <Search size={13} /> Search bills, items, outlets…
              </div>
              <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate2">
                Representative UI · sample data
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
              {/* Sidebar doubles as the tab list */}
              <aside className="min-w-0 border-b border-white/10 p-3 md:border-b-0 md:border-r md:p-4">
                <div
                  role="tablist"
                  aria-label="Dashboard views"
                  aria-orientation="vertical"
                  onKeyDown={onKey}
                  className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible"
                >
                  {TABS.map((t, i) => {
                    const active = t.key === tab;
                    return (
                      <button
                        key={t.key}
                        ref={(el) => (refs.current[i] = el)}
                        role="tab"
                        id={`tab-${t.key}`}
                        aria-selected={active}
                        aria-controls={`panel-${t.key}`}
                        tabIndex={active ? 0 : -1}
                        onClick={() => setTab(t.key)}
                        className={`relative flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                          active ? "text-white" : "text-slate2 hover:bg-white/5 hover:text-slate-200"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="tab-pill"
                            className="absolute inset-0 rounded-xl border border-accent-blue/40 bg-accent-blue/15"
                            transition={{ type: "spring", stiffness: 400, damping: 34 }}
                          />
                        )}
                        <t.icon size={17} className="relative" />
                        <span className="relative whitespace-nowrap">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 hidden space-y-1 border-t border-white/10 pt-4 text-sm text-slate2 md:block" aria-hidden>
                  <p className="flex items-center gap-2.5 px-3.5 py-2">
                    <Users size={16} /> Customers
                  </p>
                  <p className="flex items-center gap-2.5 px-3.5 py-2">
                    <Settings size={16} /> Settings
                  </p>
                </div>
              </aside>

              <div
                role="tabpanel"
                id={`panel-${tab}`}
                aria-labelledby={`tab-${tab}`}
                tabIndex={0}
                className="min-h-[420px] min-w-0 p-4 sm:p-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <View />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10 text-center">
          <ButtonLink href="#demo" size="lg">
            Schedule Your Product Demo <ArrowRight size={18} />
          </ButtonLink>
          <p className="mt-4 text-xs text-slate2">
            Illustrative visualization with sample figures — not live customer data.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
