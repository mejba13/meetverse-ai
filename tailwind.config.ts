import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ============================================
      // COLOR SYSTEM
      // ============================================
      colors: {
        // Semantic color tokens (use these in components)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Brand color palette
        ink: "#0A0A0B",
        charcoal: "#18181B",
        graphite: "#27272A",
        steel: "#3F3F46",
        slate: "#71717A",
        silver: "#A1A1AA",
        pearl: "#E4E4E7",
        snow: "#FAFAFA",

        // Cyan accent scale (primary brand color)
        cyan: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
          950: "#083344",
        },

        // Semantic colors
        success: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          500: "#10B981",
          600: "#059669",
        },
        warning: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          500: "#F59E0B",
          600: "#D97706",
        },
        error: {
          DEFAULT: "#EF4444",
          50: "#FEF2F2",
          500: "#EF4444",
          600: "#DC2626",
        },
        info: {
          DEFAULT: "#3B82F6",
          50: "#EFF6FF",
          500: "#3B82F6",
          600: "#2563EB",
        },
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        sans: [
          "var(--font-jakarta)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "var(--font-bricolage)",
          "var(--font-jakarta)",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Consolas",
          "monospace",
        ],
      },

      fontSize: {
        // Display sizes
        "display-xl": ["4.5rem", { lineHeight: "1", fontWeight: "700", letterSpacing: "-0.03em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.025em" }],
        "display-md": ["2.75rem", { lineHeight: "1.15", fontWeight: "600", letterSpacing: "-0.02em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.015em" }],
        // Heading sizes
        "heading-lg": ["1.75rem", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.01em" }],
        "heading-md": ["1.375rem", { lineHeight: "1.35", fontWeight: "600", letterSpacing: "-0.01em" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0" }],
        // Body sizes
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400", letterSpacing: "0" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400", letterSpacing: "0" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0.01em" }],
        // Utility sizes
        caption: ["0.75rem", { lineHeight: "1.5", fontWeight: "500", letterSpacing: "0.02em" }],
        overline: ["0.6875rem", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.1em" }],
      },

      // ============================================
      // SPACING (based on 4px grid)
      // ============================================
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "16px",
        "2xl": "24px",
      },

      // ============================================
      // SHADOWS
      // ============================================
      boxShadow: {
        "xs": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "sm": "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "md": "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        "lg": "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        "xl": "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px rgba(0, 0, 0, 0.25)",
        "glow": "0 0 20px rgba(6, 182, 212, 0.3)",
        "glow-lg": "0 0 40px rgba(6, 182, 212, 0.4)",
        "inner-glow": "inset 0 0 20px rgba(6, 182, 212, 0.1)",
      },

      // ============================================
      // ANIMATION
      // ============================================
      transitionTimingFunction: {
        "ease-smooth": "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "ease-bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },

      transitionDuration: {
        "instant": "50ms",
        "fast": "100ms",
        "normal": "200ms",
        "slow": "300ms",
        "slower": "500ms",
        "slowest": "800ms",
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px rgba(6, 182, 212, 0.5)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },

      // ============================================
      // CONTAINER
      // ============================================
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },

      // ============================================
      // Z-INDEX SCALE
      // ============================================
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
