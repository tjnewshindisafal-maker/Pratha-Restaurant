import { motion } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";

const benefits = [
  {
    n: "01",
    title: "Centralized Operations",
    text: "Manage key business activities through connected software modules.",
  },
  {
    n: "02",
    title: "Better Business Visibility",
    text: "Access reports and dashboards that help teams understand operational performance.",
  },
  {
    n: "03",
    title: "Multi-Location Management",
    text: "Support centralized oversight of branches, outlets and inventory movement.",
  },
  {
    n: "04",
    title: "Connected Workflows",
    text: "Reduce fragmented processes by connecting relevant operational systems.",
  },
];

export default function Benefits() {
  return (
    <section className="bg-white py-24 text-ink lg:py-32" aria-labelledby="benefits-title">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading light align="left" eyebrow="Business Benefits" title={<span id="benefits-title">Less Complexity. More Control.</span>}>
            Replace disconnected spreadsheets and standalone tools with one system your teams, outlets and head office share.
          </SectionHeading>
        </div>

        <ol className="divide-y divide-slate-200 border-y border-slate-200">
          {benefits.map((b, i) => (
            <motion.li
              key={b.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-6 py-8 sm:gap-10 sm:py-10"
            >
              <span className="bg-gradient-to-br from-accent-blue to-accent-cyan bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
                {b.n}
              </span>
              <div>
                <h3 className="text-xl font-bold sm:text-2xl">{b.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600 sm:text-lg">{b.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
