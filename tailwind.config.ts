import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0A0B",
        surface: "#141416",
        elevated: "#1C1C1F",
        elevated2: "#232327",
        border: "rgba(255,255,255,0.08)",
        borderStrong: "rgba(255,255,255,0.14)",
        primary: "#F5F3EE",
        secondary: "#9CA0A6",
        disabled: "#5A5A5E",
        gold: "#E3B341",
        goldInk: "#14110A",
        green: "#34D399",
        red: "#F87171",
        orange: "#FB923C",
        blue: "#60A5FA",
        purple: "#A78BFA",
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Consistent type scale
        "2xs": ["11px", { lineHeight: "16px", letterSpacing: "0.02em" }],
        xs: ["12px", { lineHeight: "18px" }],
        sm: ["14px", { lineHeight: "21px" }],
        base: ["15px", { lineHeight: "24px" }],
        lg: ["17px", { lineHeight: "26px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em" }],
        "3xl": ["30px", { lineHeight: "38px", letterSpacing: "-0.02em" }],
        "4xl": ["38px", { lineHeight: "44px", letterSpacing: "-0.02em" }],
        "5xl": ["50px", { lineHeight: "54px", letterSpacing: "-0.03em" }],
      },
      boxShadow: {
        ambient: "0 1px 2px rgba(0,0,0,0.4)",
        card: "0 1px 3px rgba(0,0,0,0.5)",
        pop: "0 8px 30px rgba(0,0,0,0.5)",
        gold: "0 6px 24px rgba(227,179,65,0.18)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease both",
        "slide-up": "slide-up 0.35s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
