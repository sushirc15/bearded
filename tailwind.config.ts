import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#060806",
          dark: "#030403",
        },
        surface: {
          DEFAULT: "#0D140E",
          card: "#0E150F",
          elevated: "#141F16",
          hover: "#1A281D",
        },
        brand: {
          ember: "#00E700",
          amber: "#BDF76B",
          lime: "#B6FF3B",
          gold: "#FFC83D",
          crimson: "#E5383B",
          neon: "#00E700",
        },
        rank: {
          gold: "#FFC83D",
          silver: "#C9D1D9",
          bronze: "#CD7F32",
        },
        text: {
          primary: "#F5EFE8",
          muted: "#9EADA0",
          faint: "#556457",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.06)",
          glow: "rgba(0, 231, 0, 0.5)",
          lime: "rgba(182, 255, 59, 0.5)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        "ultra-wide": "0.3em",
      },
      boxShadow: {
        glow: "0 0 28px -3px rgba(0, 231, 0, 0.55)",
        "glow-lg": "0 0 55px -4px rgba(0, 231, 0, 0.75)",
        "glow-lime": "0 0 30px -4px rgba(182, 255, 59, 0.6)",
        "glow-gold": "0 0 35px -4px rgba(255, 200, 61, 0.55)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(0, 231, 0, 0.12)",
        "card-hover": "0 20px 45px -10px rgba(0, 231, 0, 0.35), inset 0 1px 0 rgba(189, 247, 107, 0.4)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #00E700 0%, #BDF76B 100%)",
        "gradient-lime": "linear-gradient(135deg, #B6FF3B 0%, #00E700 100%)",
        "gradient-gold": "linear-gradient(135deg, #FFE873 0%, #FFC83D 60%, #B8860B 100%)",
        "stripes-pattern":
          "repeating-linear-gradient(45deg, rgba(0, 231, 0, 0.02) 0px, rgba(0, 231, 0, 0.02) 2px, transparent 2px, transparent 10px)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-gentle": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
