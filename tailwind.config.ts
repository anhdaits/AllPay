import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0F14",
          900: "#11161D",
          800: "#1A212B",
          700: "#252E3A",
          600: "#3A4553",
          400: "#7A8896",
          200: "#C6CFD8",
          100: "#E7EBEF",
          50: "#F5F7F9",
        },
        signal: {
          DEFAULT: "#2FE0C0",
          dim: "#1CA98D",
          bright: "#5CFCE0",
        },
        amber: {
          DEFAULT: "#F2A94E",
        },
        danger: {
          DEFAULT: "#F0665C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
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
