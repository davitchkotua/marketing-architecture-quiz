import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Georgian"', '"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        // MAS palette — change these variables to retheme the entire app
        bg: {
          dark: "#0F1115",
          light: "#F7F3EA",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#171A21",
        },
        txt: {
          main: "#111827",
          light: "#F9FAFB",
          muted: "#6B7280",
        },
        accent: {
          DEFAULT: "#D98A24",
          dark: "#B86E16",
        },
        border: {
          DEFAULT: "#E5E7EB",
          dark: "#2A2D35",
        },
      },
      maxWidth: {
        prose: "62ch",
      },
    },
  },
  plugins: [],
};

export default config;
