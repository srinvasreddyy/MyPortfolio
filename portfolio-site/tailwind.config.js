/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Exact Editorial Palette Specification
        alabaster: "#F4F0EA",   // Background (60%) — Soft, warm, high-end editorial canvas
        linen: "#EAE3D8",       // Surface Containers — Project cards, filtering tabs, code blocks
        espresso: "#1E1916",    // Typography — Sharp headlines, rich readable text
        umber: "#6E655F",       // Supporting Text — Paragraph blocks, labels, metadata
        terracotta: "#C96541",  // Accent / CTA (5%) — Micro-interactions, active states, buttons
      },
      fontFamily: {
        display: ["'Syne'", "'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};