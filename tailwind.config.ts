import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2c7be5",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#27bcfd",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#e63757",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#00d27a",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#5e6e82",
          foreground: "#d8e2ef",
        },
        accent: {
          DEFAULT: "#215cac",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#0a0a29",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#0a0a29",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
