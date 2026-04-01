import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Didot", "Georgia", "serif"],
      },
      colors: {
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8c97a",
        },
        dark: {
          DEFAULT: "#0a0a0f",
          100: "#0f0f14",
          200: "#141419",
        },
      },
    },
  },
  plugins: [],
};
export default config;
