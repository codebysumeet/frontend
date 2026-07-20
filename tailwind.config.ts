import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Restrained agri-tech palette: deep leaf green primary,
        // warm soil accent for severity/attention, neutral slate for text/surfaces.
        leaf: {
          50: "#f0f7f2",
          100: "#dcecdf",
          400: "#4f9e63",
          500: "#357a48",
          600: "#2a6138",
          700: "#204a2b",
        },
        soil: {
          100: "#f4ece1",
          400: "#c98a4b",
          500: "#b06f34",
          600: "#8f5827",
        },
        alert: {
          100: "#fbe7e6",
          500: "#c0453b",
          600: "#9c352c",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
