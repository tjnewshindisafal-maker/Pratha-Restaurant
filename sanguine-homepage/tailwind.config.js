/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: "#07111F", 2: "#0C1928", 3: "#122236" },
        accent: { blue: "#3B82F6", cyan: "#22D3EE" },
        mist: "#F5F8FC",
        ink: "#111827",
        slate2: "#94A3B8",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,130,246,.25), 0 20px 50px -12px rgba(59,130,246,.35)",
        card: "0 1px 2px rgba(17,24,39,.04), 0 12px 32px -12px rgba(17,24,39,.12)",
      },
    },
  },
  plugins: [],
};
