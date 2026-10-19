import { company } from "../data/site";

/** Uses the official logo when configured, otherwise a neutral wordmark. */
export default function Logo({ dark = false }: { dark?: boolean }) {
  if (company.logoSrc) {
    return <img src={company.logoSrc} alt={company.name} className="h-9 w-auto" width={140} height={36} />;
  }
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className="h-9 w-9 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill={dark ? "#07111F" : "#0C1928"} stroke="rgba(255,255,255,.12)" />
        <path
          d="M42 22c-2-3-6-5-10-5-6 0-10 3-10 8 0 11 20 6 20 15 0 4-4 7-10 7-5 0-9-2-11-6"
          fill="none"
          stroke="url(#lg)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      <span className="leading-none">
        <span className={`block text-lg font-extrabold tracking-tight ${dark ? "text-ink" : "text-white"}`}>
          Sanguine
        </span>
        <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate2">
          Software Solutions
        </span>
      </span>
    </span>
  );
}
