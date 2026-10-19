import { motion } from "framer-motion";
import { ArrowUpRight, BedDouble, Boxes, FileSpreadsheet, MonitorSmartphone, Network, Receipt } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { products, type ProductKey } from "../data/site";
import { SectionHeading } from "./ui/SectionHeading";
import ProductPreview from "./ProductPreview";

const icons: Record<ProductKey, LucideIcon> = {
  pos: Receipt,
  mpos: MonitorSmartphone,
  erp: Network,
  stocks: Boxes,
  pms: BedDouble,
  crm: FileSpreadsheet,
};

export default function Products() {
  return (
    <section id="products" className="relative py-24 lg:py-32" aria-labelledby="products-title">
      <div className="container-x">
        <SectionHeading eyebrow="Product Ecosystem" title={<span id="products-title">Everything Your Business Needs. Connected.</span>}>
          Integrated software solutions designed to simplify operations, improve visibility and support business growth.
        </SectionHeading>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {products.map((p, i) => {
            const Icon = icons[p.key];
            return (
              <motion.article
                key={p.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-night-2 p-5 transition-shadow duration-300 hover:border-accent-blue/40 hover:shadow-glow sm:p-6"
              >
                <ProductPreview k={p.key} />
                <div className="mt-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-blue/15 text-accent-cyan">
                    <Icon size={20} />
                  </span>
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                </div>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate2">{p.summary}</p>
                <a
                  href={p.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cyan after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                  aria-label={`Explore ${p.name}`}
                >
                  Explore Product
                  <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
