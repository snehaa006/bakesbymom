/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Logo-derived palette: cream vanilla, caramel tan, milk + dark chocolate
        cream: "#F3E5CE",
        ivory: "#EFE0C9",
        vanilla: "#F3E5CE",
        beige: "#EAD7B7",
        champagne: "#C9A074",
        tan: "#C9A074",
        gold: "#B07D4E",
        caramel: "#B07D4E",
        mocha: "#8A5A33",
        cocoa: "#6E4B2A",
        choco: "#3A2418",
        espresso: "#2A1A12",
        rose: "#C98A6A",
        muted: "#9B7B5E",
        dark: "#1A120B",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Jost", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
