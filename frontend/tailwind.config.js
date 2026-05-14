/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: "#1a0a4a",
        },
        nexus: {
          bg: "#080B18",
          surface: "#0E1228",
          card: "#111827",
          border: "#1E2A4A",
          primary: "#4F46E5",
          secondary: "#06B6D4",
          accent: "#8B5CF6",
          glow: "#6366F1",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-nexus":
          "linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)",
        "gradient-purple":
          "linear-gradient(135deg, #8B5CF6 0%, #4F46E5 100%)",
      },
      boxShadow: {
        "glow-indigo": "0 0 20px rgba(79, 70, 229, 0.4)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.4)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.4)",
        "glow-teal": "0 0 20px rgba(20, 184, 166, 0.4)",
        "glow-rose": "0 0 20px rgba(244, 63, 94, 0.35)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(79, 70, 229, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
