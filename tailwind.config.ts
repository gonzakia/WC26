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
          50: "#f6fff4",
          100: "#e5f8df",
          200: "#c4eabc",
          300: "#95d68b",
          400: "#61b95a",
          500: "#3f9938",
          600: "#2f7a2b",
          700: "#285f25",
          800: "#234b22",
          900: "#1d3f1e",
        },
        sand: "#f4ead7",
        ink: "#101828",
      },
      boxShadow: {
        glow: "0 30px 80px rgba(16, 24, 40, 0.18)",
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
