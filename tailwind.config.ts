import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy ledger scale — never pure black, carries a cool blue undertone.
        ink: {
          950: "#0A0E16",
          900: "#10151F",
          850: "#141B28",
          800: "#171E2B",
          700: "#232C3D",
          600: "#384254",
          400: "#8993A6",
          200: "#C7CEDA",
          100: "#DDE2EA",
          50: "#F5F7FA",
        },
        // Brand accent — the one warm color in the system. Reserved for
        // actions (buttons, links, focus) and the ink-stamp signature.
        // Never used for status; status has its own palette below.
        brass: {
          DEFAULT: "#E3A345",
          bright: "#F0BE6C",
          dim: "#B97F2E",
        },
        // Functional status colors. Each means exactly one thing, everywhere.
        paid: {
          DEFAULT: "#3FBF8F",
        },
        pending: {
          DEFAULT: "#5B8DEF",
        },
        danger: {
          DEFAULT: "#E2665C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
