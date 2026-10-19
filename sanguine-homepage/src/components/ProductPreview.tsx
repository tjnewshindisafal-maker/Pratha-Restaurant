import type { ProductKey } from "../data/site";

/**
 * Compact, representative interface previews for each product card.
 * These are illustrative mockups, not screenshots of the shipped software.
 */
const box = "h-full w-full rounded-xl border border-white/10 bg-night p-3 text-[10px] text-slate-300";

function Pos() {
  return (
    <div className={`${box} grid grid-cols-[1.4fr_1fr] gap-2`}>
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className={`grid place-items-center rounded-md py-2 font-semibold ${
              [1, 4, 7].includes(i) ? "bg-accent-blue/25 text-sky-200" : "bg-white/5"
            }`}
          >
            T{i + 1}
          </span>
        ))}
      </div>
      <div className="flex flex-col rounded-md bg-white/5 p-2">
        <span className="font-semibold text-white">Bill · T5</span>
        <span className="mt-1 h-1.5 w-4/5 rounded bg-white/10" />
        <span className="mt-1 h-1.5 w-3/5 rounded bg-white/10" />
        <span className="mt-1 h-1.5 w-2/3 rounded bg-white/10" />
        <span className="mt-auto rounded bg-accent-blue py-1 text-center font-semibold text-white">Settle</span>
      </div>
    </div>
  );
}

function Mpos() {
  return (
    <div className={`${box} flex items-center justify-center gap-3`}>
      <div className="h-full w-[92px] rounded-[14px] border-2 border-white/15 bg-night-2 p-1.5">
        <span className="mx-auto mb-1.5 block h-1 w-6 rounded bg-white/20" />
        {["Starters", "Mains", "Drinks"].map((c, i) => (
          <span key={c} className={`mb-1 block rounded px-1.5 py-1 ${i === 1 ? "bg-accent-blue/30 text-white" : "bg-white/5"}`}>
            {c}
          </span>
        ))}
        <span className="mt-1 block rounded bg-accent-cyan/80 py-1 text-center font-bold text-night">Send KOT</span>
      </div>
      <div className="space-y-1.5">
        <span className="block rounded-md bg-emerald-400/15 px-2 py-1 text-emerald-300">Order sent → Kitchen</span>
        <span className="block rounded-md bg-white/5 px-2 py-1">Table 9 · 4 items</span>
      </div>
    </div>
  );
}

function Erp() {
  const mods = ["Purchase", "Stores", "Accounts", "Payroll", "Reports", "Admin"];
  return (
    <div className={`${box} grid grid-cols-3 gap-1.5`}>
      {mods.map((m, i) => (
        <span key={m} className={`grid place-items-center rounded-md py-2.5 ${i === 0 ? "bg-accent-blue/25 text-white" : "bg-white/5"}`}>
          {m}
        </span>
      ))}
    </div>
  );
}

function Stocks() {
  return (
    <div className={box}>
      <div className="mb-1.5 grid grid-cols-[1.4fr_1fr_1fr] font-semibold text-slate2">
        <span>Item</span>
        <span>Main store</span>
        <span>Outlet B</span>
      </div>
      {[
        ["Flour (kg)", "240", "38"],
        ["Butter (kg)", "56", "9"],
        ["Sugar (kg)", "120", "22"],
      ].map((r) => (
        <div key={r[0]} className="grid grid-cols-[1.4fr_1fr_1fr] border-t border-white/5 py-1.5">
          <span className="text-white">{r[0]}</span>
          <span>{r[1]}</span>
          <span className={r[2] === "9" ? "text-amber-300" : ""}>{r[2]}</span>
        </div>
      ))}
      <span className="mt-1 inline-block rounded bg-accent-blue/20 px-1.5 py-0.5 text-sky-200">Transfer → Outlet B</span>
    </div>
  );
}

function Pms() {
  const rooms = ["occ", "vac", "occ", "res", "occ", "vac", "res", "occ", "vac", "occ"];
  const tone: Record<string, string> = {
    occ: "bg-accent-blue/30 text-sky-100",
    vac: "bg-white/5",
    res: "bg-accent-cyan/25 text-cyan-100",
  };
  return (
    <div className={box}>
      <div className="grid grid-cols-5 gap-1.5">
        {rooms.map((r, i) => (
          <span key={i} className={`grid place-items-center rounded-md py-2 font-semibold ${tone[r]}`}>
            {101 + i}
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-3 text-slate2">
        <span>■ Occupied</span>
        <span className="text-cyan-300">■ Reserved</span>
        <span>□ Vacant</span>
      </div>
    </div>
  );
}

function Crm() {
  return (
    <div className={`${box} grid grid-cols-2 gap-2`}>
      <div className="rounded-md bg-white/5 p-2">
        <span className="font-semibold text-white">Invoice #INV-218</span>
        {["Ordered", "Dispatched", "Delivered"].map((s, i) => (
          <span key={s} className="mt-1.5 flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${i < 2 ? "bg-accent-cyan" : "bg-white/20"}`} />
            {s}
          </span>
        ))}
      </div>
      <div className="rounded-md bg-white/5 p-2">
        <span className="font-semibold text-white">Ledger</span>
        <span className="mt-1.5 flex justify-between">
          <span>Receivable</span>
          <span className="text-emerald-300">Dr</span>
        </span>
        <span className="mt-1 flex justify-between">
          <span>Payable</span>
          <span className="text-rose-300">Cr</span>
        </span>
        <span className="mt-1 flex justify-between">
          <span>GST</span>
          <span>Cr</span>
        </span>
      </div>
    </div>
  );
}

const map: Record<ProductKey, () => JSX.Element> = {
  pos: Pos,
  mpos: Mpos,
  erp: Erp,
  stocks: Stocks,
  pms: Pms,
  crm: Crm,
};

export default function ProductPreview({ k }: { k: ProductKey }) {
  const C = map[k];
  return (
    <div className="h-[132px]" aria-hidden>
      <C />
    </div>
  );
}
