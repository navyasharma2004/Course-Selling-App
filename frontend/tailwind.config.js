/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7EF",
        ink: "#1D1B16",
        indigo: {
          DEFAULT: "#2E4374",
          dark: "#1F2E52",
        },
        gold: "#C7962B",
        line: "#DED7C4",
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
