import { motion } from "framer-motion";
import { useId } from "react";

/** Smooth area chart from a list of values (0–100 scale works best). */
export function AreaChart({ data, className = "", height = 120 }: { data: number[]; className?: string; height?: number }) {
  const id = useId();
  const w = 300;
  const max = Math.max(...data) * 1.1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, height - (v / max) * height] as const);
  const line = pts
    .map(([x, y], i) => {
      if (i === 0) return `M${x},${y}`;
      const [px, py] = pts[i - 1];
      const cx = (px + x) / 2;
      return `C${cx},${py} ${cx},${y} ${x},${y}`;
    })
    .join(" ");
  const area = `${line} L${w},${height} L0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className={`w-full ${className}`} aria-hidden>
      <defs>
        <linearGradient id={`a${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B82F6" stopOpacity=".45" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={w} y1={height * f} y2={height * f} stroke="rgba(148,163,184,.12)" strokeDasharray="3 4" />
      ))}
      <motion.path
        d={area}
        fill={`url(#a${id})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={`url(#l${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

/** Vertical bars that grow from the baseline. */
export function Bars({ data, className = "" }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  return (
    <div className={`flex items-end gap-1.5 ${className}`} aria-hidden>
      {data.map((v, i) => (
        <motion.span
          key={i}
          className="flex-1 rounded-t-[4px] bg-gradient-to-t from-accent-blue to-accent-cyan"
          style={{ height: `${(v / max) * 100}%`, transformOrigin: "bottom" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.4 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/** Thin horizontal progress meter. */
export function Meter({ value, tone = "blue" }: { value: number; tone?: "blue" | "amber" | "red" }) {
  const color = { blue: "bg-accent-blue", amber: "bg-amber-400", red: "bg-rose-500" }[tone];
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <motion.span
        className={`block h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, delay: 0.5 }}
      />
    </span>
  );
}
