import type { Config } from "tailwindcss";

/**
 * Shenostore design tokens (see Rules.md §2, ui-ux-brief.md §3-5).
 * NOTE: the default slate/cyan palettes already contain our exact brand
 * hex values (slate-900 #0F172A, slate-800 #1E293B, cyan-500 #06B6D4), so
 * we expose semantic `brand.*` aliases WITHOUT overriding the scales —
 * utilities like text-slate-400 / border-slate-700 keep working.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#0F172A",
          surface: "#1E293B",
          accent: "#06B6D4",
        },
      },
      fontFamily: {
        // Headings (h1-h6, wordmark)
        sora: ["var(--font-sora)", "Sora", "sans-serif"],
        // Body, inputs, labels, buttons
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
