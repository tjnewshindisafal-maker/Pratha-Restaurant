import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "light" | "outline-dark";

const styles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-accent-blue to-[#2563EB] text-white shadow-[0_10px_30px_-10px_rgba(59,130,246,.8)] hover:brightness-110",
  ghost: "border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10",
  light: "bg-white text-ink hover:bg-slate-100",
  "outline-dark": "border border-slate-300 bg-white text-ink hover:border-accent-blue hover:text-accent-blue",
};

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px] sm:h-[52px] sm:px-7",
};

type Props = HTMLMotionProps<"a"> & {
  variant?: Variant;
  size?: keyof typeof sizes;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", size = "md", className = "", children, ...rest }: Props) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors ${styles[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
