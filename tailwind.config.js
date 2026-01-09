/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light Mode
        background: "#F9FAFB",
        surface: "#FFFFFF",

        primary: "#2F6FED",
        "primary-soft": "#E8F0FE",

        accent: "#C9A24D",

        "text-primary": "#111827",
        "text-secondary": "#6B7280",

        border: "#E5E7EB",

        success: "#16A34A",
        error: "#DC2626",

        // Dark Mode
        dark: {
          background: "#0F172A",
          surface: "#111827",

          primary: "#5B8CFF",
          "primary-soft": "#1E3A8A",

          accent: "#E3C770",

          "text-primary": "#F9FAFB",
          "text-secondary": "#9CA3AF",

          border: "#1F2937",

          success: "#22C55E",
          error: "#F87171",
        },
      },
    },
  },
  plugins: [],
};
