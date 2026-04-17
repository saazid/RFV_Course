import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        navy: {
          50: "#eef2ff",
          100: "#dbe3ff",
          200: "#b6c5ff",
          400: "#5a78e6",
          500: "#2f4bc4",
          600: "#1f3395",
          700: "#172466",
          800: "#0f1a4b",
          900: "#0a1338",
          950: "#050a20",
        },
        indigo: {
          accent: "#6366f1",
          electric: "#7c3aed",
          glow: "#8b5cf6",
        },
        ink: "#0a1338",
        cream: "#f8fafc",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-grid":
          "linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 58, 237, 0.35)",
        card: "0 10px 30px -10px rgba(10, 19, 56, 0.25)",
        "card-hover":
          "0 20px 60px -20px rgba(99, 102, 241, 0.45), 0 0 0 1px rgba(99, 102, 241, 0.2)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-med": "float 6s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-22px) translateX(10px)" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 30px rgba(124, 58, 237, 0.35)",
            opacity: "0.9",
          },
          "50%": {
            boxShadow: "0 0 60px rgba(124, 58, 237, 0.65)",
            opacity: "1",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
