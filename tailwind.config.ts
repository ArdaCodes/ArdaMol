import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          950: "#0e0c0a",
          900: "#161310",
          850: "#1c1815",
          800: "#221d19",
          700: "#332c25",
          600: "#4a4038",
          400: "#8a7f72",
          200: "#cfc4b4",
          100: "#e7ddcc",
          50: "#f3ede0",
        },
        parchment: "#ede4d3",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          dim: "var(--accent-dim)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest2: "-0.04em",
      },
      backgroundImage: {
        "grain": "url('/images/grain.svg')",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "45%": { opacity: "0.86" },
          "48%": { opacity: "1" },
          "70%": { opacity: "0.92" },
        },
      },
      animation: {
        drift: "drift 9s ease-in-out infinite",
        flicker: "flicker 4.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
