/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Raspberry-macaron palette — butter cream + hot raspberry pink + berry
        // red glowing on a deep plum base. Semantic slots are preserved from the
        // old brown/beige theme, so every existing class name just re-tints.
        cream: "#FCEFC7", // butter cream (poster's pale yellow) — primary light text
        ivory: "#FBE9BE",
        vanilla: "#FDF3D6",
        beige: "#F7D9A6", // warm cream-gold
        champagne: "#FF5C8A", // ⭐ primary accent — hot raspberry pink
        tan: "#FF5C8A",
        gold: "#EC1E5A", // berry red — secondary accent / button hover fill
        caramel: "#EC1E5A",
        mocha: "#C71B54", // deep raspberry
        cocoa: "#8E0E3D", // wine berry
        choco: "#2E0A1C", // dark plum panel
        espresso: "#1F0713", // deeper plum
        rose: "#F78FB3", // soft blossom pink
        muted: "#C77E97", // dusty rose (muted text)
        dark: "#1A0710", // deep berry-plum base background
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
        shimmer: "shimmer 6s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3.5s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
      },
    },
  },
  plugins: [],
};
