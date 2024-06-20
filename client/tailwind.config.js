import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';

export const darkMode = ["class"];
export const content = [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx}",
];
export const prefix = "";
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    fontFamily: {
      sans: ["Poppins", ...defaultTheme.fontFamily.sans],
    },
    colors: {
      light: {
        text: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
        primary: "hsl(var(--primary))",
        primary20: "hsl(359, 100%, 80%, 20%)",
        secondary: "hsl(var(--secondary))",
        secondary30: "hsl(342, 66%, 67%, 30%)",
        accent: "hsl(var(--accent))",
      },
      dark: {
        text: "hsl(var(--foreground))",
        text5: "hsl(303, 77%, 95%, 5%)",
        background: "hsl(var(--background))",
        primary: "hsl(var(--primary))",
        primary5: "hsl(359, 100%, 20%, 5%)",
        secondary: "hsl(var(--secondary))",
        secondary30: "hsl(342, 66%, 33%, 30%)",
        accent: "hsl(var(--accent))",
        input: "hsl(var(--input))",
      },
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      foreground: "hsl(var(--foreground))",
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
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
    fontSize: {
      sm: "0.750rem",
      base: "1rem",
      xl: "1.333rem",
      "2xl": "1.777rem",
      "3xl": "2.369rem",
      "4xl": "3.158rem",
      "5xl": "4.210rem",
    },
  },
};

export const plugins = [tailwindcssAnimate];