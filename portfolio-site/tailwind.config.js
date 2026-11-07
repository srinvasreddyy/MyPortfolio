/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#08080A",
        stone: "#EFDED9",
        vermilion: "#FF3B1D",
        emerald: "#10B981",
        hairline: "#1F1F24",
        ink: "#111111",
      },
      fontFamily: {
        display: ["'Syne'", "'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'Inter'", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 14s linear infinite",
        "pulse-fast": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};