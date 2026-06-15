import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          50: "rgb(var(--color-pitch-50) / <alpha-value>)",
          100: "rgb(var(--color-pitch-100) / <alpha-value>)",
          200: "rgb(var(--color-pitch-200) / <alpha-value>)",
          300: "rgb(var(--color-pitch-300) / <alpha-value>)",
          400: "rgb(var(--color-pitch-400) / <alpha-value>)",
          500: "rgb(var(--color-pitch-500) / <alpha-value>)",
          600: "rgb(var(--color-pitch-600) / <alpha-value>)",
          700: "rgb(var(--color-pitch-700) / <alpha-value>)",
          800: "rgb(var(--color-pitch-800) / <alpha-value>)",
          900: "rgb(var(--color-pitch-900) / <alpha-value>)",
        },
        sand: "rgb(var(--color-sand) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
      },
      boxShadow: {
        glow: "0 30px 80px rgb(var(--color-shadow) / 0.18)",
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
