import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  children,
  light = false,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  light?: boolean;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "mx-auto text-center" : ""} mb-12 max-w-3xl lg:mb-16`}>
      <span className={light ? "eyebrow-light" : "eyebrow"}>{eyebrow}</span>
      <h2 className={`h2 mt-4 ${light ? "text-ink" : "text-white"}`}>{title}</h2>
      {children && (
        <p className={`mt-4 text-base sm:text-lg ${light ? "text-slate-600" : "text-slate2"}`}>{children}</p>
      )}
    </Reveal>
  );
}
